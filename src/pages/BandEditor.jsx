import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, X, Save, Trash2, PlusCircle, Music, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PARISHES = [
  "Saint Andrew","Saint David","Saint George","Saint John","Saint Joseph",
  "Saint Luke","Saint Mark","Saint Patrick","Saint Paul","Saint Peter"
];
const BAND_TYPES = [
  { value:"steelband", label:"Steel Band" },
  { value:"jing_ping", label:"Jing Ping" },
  { value:"bélé", label:"Bélé" },
  { value:"quadrille", label:"Quadrille" },
  { value:"bouyon", label:"Bouyon" },
  { value:"cadence_lypso", label:"Cadence-lypso" },
  { value:"gospel", label:"Gospel" },
  { value:"string_band", label:"String Band" },
  { value:"drum_and_chant", label:"Drum & Chant" },
  { value:"other", label:"Other" },
];
const STATUSES = ["active","inactive","dissolved","unknown"];

const empty = () => ({
  name:"", also_known_as:"", band_type:"", parish:"", village_community:"",
  active_years:"", status:"unknown", description:"", instruments:[],
  repertoire_notes:"", performance_contexts:[], leader_name:"", contact_info:"",
  latitude:"", longitude:"", image_url:"", audio_url:"",
  verified:false, notes:""
});

function TagInput({ label, value=[], onChange, placeholder }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={draft} onChange={e=>setDraft(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); add(); }}}
          placeholder={placeholder} className="h-10 rounded-xl flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={add} className="rounded-xl px-3">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((v,i)=>(
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {v}
              <button onClick={()=>onChange(value.filter((_,j)=>j!==i))} className="hover:text-destructive ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-6 space-y-5">
      <h3 className="font-heading text-base font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

export default function BandEditor() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null); // band id or "new"
  const [form, setForm] = useState(empty());
  const [search, setSearch] = useState("");

  // Pre-select band from URL ?id=xxx
  const urlParams = new URLSearchParams(window.location.search);
  const urlId = urlParams.get("id");

  const { data: bands=[], isLoading } = useQuery({
    queryKey:["editor-bands"],
    queryFn:()=>base44.entities.Band.list("name"),
  });

  // Auto-select band from URL param once bands are loaded
  useEffect(() => {
    if (urlId && bands.length > 0 && !selected) {
      const b = bands.find(b => b.id === urlId);
      if (b) selectBand(b);
    }
  }, [urlId, bands]);

  const createM = useMutation({
    mutationFn: d => base44.entities.Band.create(d),
    onSuccess: b => { qc.invalidateQueries({queryKey:["editor-bands"]}); setSelected(b.id); toast.success("Band created!"); }
  });
  const updateM = useMutation({
    mutationFn: ({id,d})=>base44.entities.Band.update(id,d),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["editor-bands"]}); toast.success("Saved!"); }
  });
  const deleteM = useMutation({
    mutationFn: id=>base44.entities.Band.delete(id),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["editor-bands"]}); setSelected(null); setForm(empty()); toast.success("Deleted."); }
  });

  const selectBand = (b) => {
    setSelected(b.id);
    const base = empty();
    const cleaned = Object.fromEntries(
      Object.entries(b).map(([k, v]) => [k, v === null || v === undefined ? base[k] ?? "" : v])
    );
    setForm({ ...base, ...cleaned, latitude: b.latitude ?? "", longitude: b.longitude ?? "" });
  };
  const startNew = () => { setSelected("new"); setForm(empty()); };

  const f = (field,val) => setForm(p=>({...p,[field]:val}));

  const handleSave = () => {
    const d = { ...form,
      latitude: form.latitude !== "" ? Number(form.latitude) : undefined,
      longitude: form.longitude !== "" ? Number(form.longitude) : undefined,
    };
    if (selected === "new") createM.mutate(d);
    else updateM.mutate({ id:selected, d });
  };

  const filtered = bands.filter(b=>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.parish?.toLowerCase().includes(search.toLowerCase())
  );

  const saving = createM.isPending || updateM.isPending;

  return (
    <div className="min-h-screen bg-background flex pt-20">
      {/* Sidebar list */}
      <aside className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col h-[calc(100vh-5rem)] sticky top-20">
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="font-heading text-lg font-bold">Band Editor</h2>
          <p className="text-xs text-muted-foreground">Commonwealth of Dominica</p>
          <Input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search bands…" className="h-9 rounded-xl text-sm" />
          <Button onClick={startNew} size="sm" className="w-full rounded-xl gap-1 bg-primary hover:bg-primary/90">
            <PlusCircle className="w-4 h-4" /> New Band
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="space-y-1 p-2">
              {Array(5).fill(0).map((_,i)=>(
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No bands found.</p>
          ) : filtered.map(b=>(
            <button key={b.id} onClick={()=>selectBand(b)}
              className={`w-full text-left p-3 rounded-xl transition-all mb-1 ${selected===b.id?"bg-primary/10 border border-primary/20":"hover:bg-muted"}`}
            >
              <p className="text-sm font-medium truncate">{b.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{b.band_type?.replace(/_/g," ")} · {b.parish}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Editor */}
      <main className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-heading text-xl">Select a band or create a new one</p>
            </div>
          </div>
        ) : (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} key={selected}
            className="max-w-3xl mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold">
                  {selected==="new" ? "New Band" : form.name || "Edit Band"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Commonwealth of Dominica</p>
              </div>
              <div className="flex gap-2">
                {selected !== "new" && (
                  <Button variant="ghost" size="icon" onClick={()=>{ if(confirm("Delete this band?")) deleteM.mutate(selected); }}
                    className="text-destructive hover:text-destructive rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={handleSave} disabled={saving}
                  className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-6">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save className="w-4 h-4"/>}
                  Save
                </Button>
              </div>
            </div>

            {/* Identity */}
            <FormSection title="Identity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Band Name *</Label>
                  <Input value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Official name" className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Also Known As</Label>
                  <Input value={form.also_known_as} onChange={e=>f("also_known_as",e.target.value)} placeholder="Alias or alternate name" className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Band Type *</Label>
                  <Select value={form.band_type} onValueChange={v=>f("band_type",v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select type…"/></SelectTrigger>
                    <SelectContent>{BAND_TYPES.map(t=><SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v=>f("status",v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s=><SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Active Years</Label>
                  <Input value={form.active_years} onChange={e=>f("active_years",e.target.value)} placeholder="e.g. 1985–present" className="h-11 rounded-xl"/>
                </div>
              </div>
            </FormSection>

            {/* Location */}
            <FormSection title="Location (Commonwealth of Dominica)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Parish *</Label>
                  <Select value={form.parish} onValueChange={v=>f("parish",v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…"/></SelectTrigger>
                    <SelectContent>{PARISHES.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Village / Community</Label>
                  <Input value={form.village_community} onChange={e=>f("village_community",e.target.value)} placeholder="e.g. Roseau, Soufrière" className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={form.latitude} onChange={e=>f("latitude",e.target.value)} placeholder="15.41…" className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={form.longitude} onChange={e=>f("longitude",e.target.value)} placeholder="-61.37…" className="h-11 rounded-xl"/>
                </div>
              </div>
            </FormSection>

            {/* Description */}
            <FormSection title="Description & Repertoire">
              <div className="space-y-2">
                <Label>Description / Ethnographic Notes</Label>
                <Textarea value={form.description} onChange={e=>f("description",e.target.value)}
                  placeholder="History, style, cultural significance…" className="rounded-xl min-h-[120px]"/>
              </div>
              <div className="space-y-2">
                <Label>Repertoire Notes</Label>
                <Textarea value={form.repertoire_notes} onChange={e=>f("repertoire_notes",e.target.value)}
                  placeholder="Songs, rhythms, typical set…" className="rounded-xl min-h-[80px]"/>
              </div>
              <TagInput label="Instruments" value={form.instruments} onChange={v=>f("instruments",v)} placeholder="e.g. boula drum, accordion…"/>
              <TagInput label="Performance Contexts" value={form.performance_contexts} onChange={v=>f("performance_contexts",v)} placeholder="e.g. Carnival, funeral, wedding…"/>
            </FormSection>

            {/* Contact */}
            <FormSection title="Contact & Media">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Leader / Contact Name</Label>
                  <Input value={form.leader_name} onChange={e=>f("leader_name",e.target.value)} className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Contact Info</Label>
                  <Input value={form.contact_info} onChange={e=>f("contact_info",e.target.value)} placeholder="Phone or email" className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input value={form.image_url} onChange={e=>f("image_url",e.target.value)} placeholder="https://…" className="h-11 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label>Audio URL</Label>
                  <Input value={form.audio_url} onChange={e=>f("audio_url",e.target.value)} placeholder="https://…" className="h-11 rounded-xl"/>
                </div>
              </div>
            </FormSection>

            {/* Internal */}
            <FormSection title="Internal / Research">
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea value={form.notes} onChange={e=>f("notes",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Researcher-only notes…"/>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.verified} onCheckedChange={v=>f("verified",v)} />
                <Label>Field-Verified Entry</Label>
              </div>
            </FormSection>

            <div className="flex justify-end pb-8">
              <Button onClick={handleSave} disabled={saving}
                className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-8 h-12">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save className="w-4 h-4"/>}
                Save Band
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}