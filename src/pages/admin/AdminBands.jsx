import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

const genres = ["merengue", "bachata", "salsa", "dembow", "reggaeton", "son", "jazz", "rock", "fusion", "traditional"];
const priceRanges = ["$", "$$", "$$$", "$$$$"];

const emptyBand = { name: "", genre: "", description: "", image_url: "", members_count: "", price_range: "", rating: "", location: "", available: true, featured: false, phone: "", email: "" };

export default function AdminBands() {
  const [editBand, setEditBand] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: bands = [], isLoading } = useQuery({
    queryKey: ["admin-bands"],
    queryFn: () => base44.entities.Band.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Band.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-bands"] }); setIsOpen(false); toast.success("Band created!"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Band.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-bands"] }); setIsOpen(false); toast.success("Band updated!"); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Band.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-bands"] }); toast.success("Band deleted."); },
  });

  const handleSave = () => {
    const data = {
      ...editBand,
      members_count: editBand.members_count ? Number(editBand.members_count) : undefined,
      rating: editBand.rating ? Number(editBand.rating) : undefined,
    };
    if (editBand.id) {
      updateMutation.mutate({ id: editBand.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openCreate = () => { setEditBand({ ...emptyBand }); setIsOpen(true); };
  const openEdit = (band) => { setEditBand({ ...band }); setIsOpen(true); };
  const updateField = (field, value) => setEditBand({ ...editBand, [field]: value });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Manage Bands</h1>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Band
        </Button>
      </div>

      {bands.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No bands yet. Click "Add Band" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bands.map((band) => (
            <Card key={band.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {band.image_url ? (
                    <img src={band.image_url} alt={band.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{band.name}</h3>
                    {band.featured && <Badge className="bg-primary/10 text-primary text-[10px]">Featured</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="capitalize">{band.genre}</span>
                    {band.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{band.location}</span>}
                    {band.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary fill-primary" />{band.rating}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(band)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(band.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editBand?.id ? "Edit Band" : "Add Band"}</DialogTitle>
          </DialogHeader>
          {editBand && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={editBand.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Band name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Genre *</Label>
                  <Select value={editBand.genre} onValueChange={(v) => updateField("genre", v)}>
                    <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Select value={editBand.price_range || ""} onValueChange={(v) => updateField("price_range", v)}>
                    <SelectTrigger><SelectValue placeholder="Price" /></SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={editBand.description || ""} onChange={(e) => updateField("description", e.target.value)} placeholder="Band bio..." />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={editBand.image_url || ""} onChange={(e) => updateField("image_url", e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Members</Label>
                  <Input type="number" value={editBand.members_count || ""} onChange={(e) => updateField("members_count", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={editBand.rating || ""} onChange={(e) => updateField("rating", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={editBand.location || ""} onChange={(e) => updateField("location", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editBand.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={editBand.email || ""} onChange={(e) => updateField("email", e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-8 pt-2">
                <div className="flex items-center gap-3">
                  <Switch checked={editBand.available} onCheckedChange={(v) => updateField("available", v)} />
                  <Label>Available</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={editBand.featured} onCheckedChange={(v) => updateField("featured", v)} />
                  <Label>Featured</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 rounded-xl mt-4" disabled={createMutation.isPending || updateMutation.isPending}>
                {editBand.id ? "Update Band" : "Create Band"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}