import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, Trash2, FileText, Database } from "lucide-react";
import { toast } from "sonner";

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map(row =>
    keys.map(k => JSON.stringify(row[k] ?? "")).join(",")
  )];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ArchiveDownloads() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("other");
  const [file, setFile] = useState(null);

  const { data: bands = [] } = useQuery({ queryKey: ["dl-bands"], queryFn: () => base44.entities.Band.list("name") });
  const { data: festivals = [] } = useQuery({ queryKey: ["dl-festivals"], queryFn: () => base44.entities.Festival.list("-year") });
  const { data: archiveFiles = [] } = useQuery({ queryKey: ["archive-files"], queryFn: () => base44.entities.ArchiveFile.list("-created_date") });

  const deleteM = useMutation({
    mutationFn: id => base44.entities.ArchiveFile.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["archive-files"] }); toast.success("Deleted."); }
  });

  const handleUpload = async () => {
    if (!file) { toast.error("Please select a file."); return; }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.ArchiveFile.create({
      label: label || file.name,
      file_name: file.name,
      file_url,
      file_size: file.size,
      category,
    });
    qc.invalidateQueries({ queryKey: ["archive-files"] });
    toast.success("Uploaded!");
    setFile(null);
    setLabel("");
    setCategory("other");
    setUploading(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold">Archive & Downloads</h1>

      {/* Export Section */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Export Database</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="outline" className="gap-2" onClick={() => downloadJSON(bands, "bands.json")}>
            <Download className="w-4 h-4" /> Bands JSON
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => downloadCSV(bands, "bands.csv")}>
            <Download className="w-4 h-4" /> Bands CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => downloadJSON(festivals, "festivals.json")}>
            <Download className="w-4 h-4" /> Festivals JSON
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => downloadCSV(festivals, "festivals.csv")}>
            <Download className="w-4 h-4" /> Festivals CSV
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Bands: {bands.length} records · Festivals: {festivals.length} records
        </p>
      </div>

      {/* Upload Section */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Upload Archive File</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Label</Label>
            <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. WCMF 2003 Audio" className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["audio","video","image","document","data","other"].map(c => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>File</Label>
            <Input type="file" onChange={e => setFile(e.target.files[0])} className="h-10 rounded-xl" />
          </div>
        </div>
        <Button onClick={handleUpload} disabled={uploading} className="gap-2">
          {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>

      {/* Files List */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Uploaded Files ({archiveFiles.length})</h2>
        </div>
        {archiveFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No files uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {archiveFiles.map(f => (
              <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{f.label || f.file_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{f.category} · {f.file_name}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" asChild className="gap-1 h-8 text-xs">
                    <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteM.mutate(f.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}