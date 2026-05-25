import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Music, Plus, Trash2, Edit2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function FestivalForm({ festival, onSave, onCancel }) {
  const [data, setData] = useState(festival || {
    festival_name: "",
    year: new Date().getFullYear(),
    stage_number: null,
    lineup: "",
    description: "",
    notes: "",
    poster_url: ""
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (festival?.id) {
        return base44.entities.Festival.update(festival.id, data);
      } else {
        return base44.entities.Festival.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      toast.success(festival?.id ? "Festival updated" : "Festival created");
      onSave();
    },
    onError: err => toast.error(err.message),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Festival Name"
        value={data.festival_name}
        onChange={e => setData({ ...data, festival_name: e.target.value })}
        className="rounded-lg"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          placeholder="Year"
          value={data.year}
          onChange={e => setData({ ...data, year: parseInt(e.target.value) })}
          className="rounded-lg"
        />
        <Input
          type="number"
          placeholder="Stage Number"
          value={data.stage_number || ""}
          onChange={e => setData({ ...data, stage_number: e.target.value ? parseInt(e.target.value) : null })}
          className="rounded-lg"
        />
      </div>
      <Textarea
        placeholder="Lineup (bands/artists)"
        value={data.lineup}
        onChange={e => setData({ ...data, lineup: e.target.value })}
        className="rounded-lg h-24"
      />
      <Textarea
        placeholder="Description"
        value={data.description}
        onChange={e => setData({ ...data, description: e.target.value })}
        className="rounded-lg h-16"
      />
      <Textarea
        placeholder="Notes"
        value={data.notes}
        onChange={e => setData({ ...data, notes: e.target.value })}
        className="rounded-lg h-16"
      />
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Poster Image</label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={async e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (!file) return;
            setData(d => ({ ...d, _uploading: true }));
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setData(d => ({ ...d, poster_url: file_url, _uploading: false }));
          }}
          onClick={() => document.getElementById('poster-upload').click()}
        >
          {data._uploading ? (
            <p className="text-sm text-muted-foreground">Uploading…</p>
          ) : data.poster_url ? (
            <img src={data.poster_url} alt="Poster preview" className="w-24 mx-auto rounded-lg" />
          ) : (
            <p className="text-sm text-muted-foreground">Drag & drop or click to select a poster image</p>
          )}
        </div>
        <input
          id="poster-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async e => {
            const file = e.target.files[0];
            if (!file) return;
            setData(d => ({ ...d, _uploading: true }));
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setData(d => ({ ...d, poster_url: file_url, _uploading: false }));
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => saveMutation.mutate()} variant="default" disabled={saveMutation.isPending || !data.festival_name}>
          {saveMutation.isPending ? "Saving…" : festival?.id ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminFestivals() {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const queryClient = useQueryClient();
  const { data: festivals = [], isLoading } = useQuery({
    queryKey: ["festivals"],
    queryFn: () => base44.entities.Festival.list("-year"),
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Festival.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      toast.success("Festival deleted");
    },
  });

  const filtered = festivals.filter(f =>
    !search || f.festival_name.toLowerCase().includes(search.toLowerCase()) || f.lineup?.toLowerCase().includes(search.toLowerCase())
  );

  const toEdit = editingId ? festivals.find(f => f.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-2">WCMF & Festival Records</h1>
        <p className="text-muted-foreground">Manage World Creole Music Festival and other performance data.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search festivals…"
            className="pl-9 rounded-lg"
          />
        </div>
        <Button onClick={() => {
          setEditingId(null);
          setShowForm(true);
        }} variant="default" className="gap-2">
          <Plus className="w-4 h-4" /> New Festival
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={o => {
        setShowForm(o);
        if (!o) setEditingId(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Festival" : "New Festival"}</DialogTitle>
          </DialogHeader>
          <FestivalForm
            festival={toEdit}
            onSave={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>{search ? "No festivals match your search." : "No festivals recorded yet."}</p>
          </div>
        ) : (
          filtered.map(f => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-between gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{f.festival_name} ({f.year})</p>
                {f.stage_number && <p className="text-xs text-muted-foreground">Stage {f.stage_number}</p>}
                {f.lineup && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{f.lineup}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(f.id);
                    setShowForm(true);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(f.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}