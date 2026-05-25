import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, UserRound, BookOpen, ClipboardList, StickyNote } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const PARISHES = [
  "Saint Andrew","Saint David","Saint George","Saint John","Saint Joseph",
  "Saint Luke","Saint Mark","Saint Patrick","Saint Paul","Saint Peter"
];

const emptyMusician = () => ({
  full_name: "", also_known_as: "", birth_year: "", parish: "",
  village_community: "", biography: "", ethnicity_heritage: "",
  instruments: [], contact_info: "", notes: ""
});

const emptySource = () => ({
  title: "", source_type: "", author_collector: "", date: "",
  location: "", parish: "", language: "English", description: "",
  url_or_path: "", tags: [], notes: ""
});

const emptyActivity = () => ({
  activity_type: "", title: "", date: new Date().toISOString().slice(0, 10),
  time_start: "", time_end: "", parish: "", location_description: "",
  researcher: "", summary: "", findings: "", follow_up_needed: false,
  follow_up_notes: "", notes: ""
});

const emptyBandNote = () => ({
  band_id: "", quick_note: "", note_type: "other"
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-5 space-y-4">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function SaveBtn({ saving, onClick, label = "Save Record" }) {
  return (
    <Button onClick={onClick} disabled={saving} className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-8 h-11 w-full md:w-auto">
      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
      {saving ? "Saving…" : label}
    </Button>
  );
}

// ─── Musician Tab ─────────────────────────────────────────────────────────────
function MusicianForm() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyMusician());
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const { mutate, isPending } = useMutation({
    mutationFn: d => base44.entities.Musician.create(d),
    onSuccess: () => {
      toast.success("Musician saved!");
      setForm(emptyMusician());
      qc.invalidateQueries({ queryKey: ["fieldwork-musicians"] });
    }
  });

  const handleSave = () => {
    if (!form.full_name.trim()) { toast.error("Full name is required."); return; }
    const d = {
      ...form,
      birth_year: form.birth_year ? Number(form.birth_year) : undefined,
      instruments: form.instruments.length ? form.instruments : undefined,
    };
    mutate(d);
  };

  return (
    <div className="space-y-5">
      <Section title="Identity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <Input value={form.full_name} onChange={e => f("full_name", e.target.value)} placeholder="e.g. John Titre" className="h-11 rounded-xl" />
          </Field>
          <Field label="Also Known As">
            <Input value={form.also_known_as} onChange={e => f("also_known_as", e.target.value)} placeholder="Nickname or alias" className="h-11 rounded-xl" />
          </Field>
          <Field label="Birth Year">
            <Input type="number" value={form.birth_year} onChange={e => f("birth_year", e.target.value)} placeholder="e.g. 1952" className="h-11 rounded-xl" />
          </Field>
          <Field label="Ethnicity / Heritage">
            <Input value={form.ethnicity_heritage} onChange={e => f("ethnicity_heritage", e.target.value)} placeholder="e.g. African-Creole, Kalinago" className="h-11 rounded-xl" />
          </Field>
        </div>
      </Section>
      <Section title="Location">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Parish">
            <Select value={form.parish} onValueChange={v => f("parish", v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…" /></SelectTrigger>
              <SelectContent>{PARISHES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Village / Community">
            <Input value={form.village_community} onChange={e => f("village_community", e.target.value)} placeholder="e.g. Roseau, Soufrière" className="h-11 rounded-xl" />
          </Field>
        </div>
      </Section>
      <Section title="Details">
        <Field label="Biography">
          <Textarea value={form.biography} onChange={e => f("biography", e.target.value)} placeholder="Background, career history, cultural role…" className="rounded-xl min-h-[100px]" />
        </Field>
        <Field label="Instruments (comma-separated)">
          <Input
            value={form.instruments.join(", ")}
            onChange={e => f("instruments", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
            placeholder="e.g. boula, accordion, chak-chak"
            className="h-11 rounded-xl"
          />
        </Field>
        <Field label="Contact Info">
          <Input value={form.contact_info} onChange={e => f("contact_info", e.target.value)} placeholder="Phone or email" className="h-11 rounded-xl" />
        </Field>
        <Field label="Researcher Notes">
          <Textarea value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="Internal notes only…" className="rounded-xl min-h-[70px]" />
        </Field>
      </Section>
      <div className="flex justify-end">
        <SaveBtn saving={isPending} onClick={handleSave} label="Save Musician" />
      </div>
    </div>
  );
}

// ─── Source Tab ───────────────────────────────────────────────────────────────
function SourceForm() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptySource());
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const { mutate, isPending } = useMutation({
    mutationFn: d => base44.entities.Source.create(d),
    onSuccess: () => {
      toast.success("Source saved!");
      setForm(emptySource());
      qc.invalidateQueries({ queryKey: ["fieldwork-sources"] });
    }
  });

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.source_type) { toast.error("Source type is required."); return; }
    mutate({ ...form, tags: form.tags.length ? form.tags : undefined });
  };

  const SOURCE_TYPES = [
    "interview","field_recording","archival_document","newspaper","book",
    "journal_article","photograph","video","government_record","oral_history","other"
  ];

  return (
    <div className="space-y-5">
      <Section title="Source Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title" required>
            <Input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Source title or description" className="h-11 rounded-xl" />
          </Field>
          <Field label="Type" required>
            <Select value={form.source_type} onValueChange={v => f("source_type", v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select type…" /></SelectTrigger>
              <SelectContent>{SOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Author / Collector">
            <Input value={form.author_collector} onChange={e => f("author_collector", e.target.value)} placeholder="Researcher or author name" className="h-11 rounded-xl" />
          </Field>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={e => f("date", e.target.value)} className="h-11 rounded-xl" />
          </Field>
          <Field label="Parish">
            <Select value={form.parish} onValueChange={v => f("parish", v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…" /></SelectTrigger>
              <SelectContent>{PARISHES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Location / Archive">
            <Input value={form.location} onChange={e => f("location", e.target.value)} placeholder="Where collected or archived" className="h-11 rounded-xl" />
          </Field>
          <Field label="Language">
            <Input value={form.language} onChange={e => f("language", e.target.value)} placeholder="e.g. English, Kwéyòl" className="h-11 rounded-xl" />
          </Field>
          <Field label="URL or File Path">
            <Input value={form.url_or_path} onChange={e => f("url_or_path", e.target.value)} placeholder="https://… or file reference" className="h-11 rounded-xl" />
          </Field>
        </div>
        <Field label="Description / Summary">
          <Textarea value={form.description} onChange={e => f("description", e.target.value)} placeholder="What does this source contain?" className="rounded-xl min-h-[90px]" />
        </Field>
        <Field label="Tags (comma-separated)">
          <Input
            value={form.tags.join(", ")}
            onChange={e => f("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
            placeholder="e.g. jing ping, carnival, 1970s"
            className="h-11 rounded-xl"
          />
        </Field>
        <Field label="Notes">
          <Textarea value={form.notes} onChange={e => f("notes", e.target.value)} className="rounded-xl min-h-[60px]" />
        </Field>
      </Section>
      <div className="flex justify-end">
        <SaveBtn saving={isPending} onClick={handleSave} label="Save Source" />
      </div>
    </div>
  );
}

// ─── Field Activity Tab ───────────────────────────────────────────────────────
function ActivityForm() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyActivity());
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const { mutate, isPending } = useMutation({
    mutationFn: d => base44.entities.FieldActivity.create(d),
    onSuccess: () => {
      toast.success("Field activity saved!");
      setForm(emptyActivity());
      qc.invalidateQueries({ queryKey: ["fieldwork-activities"] });
    }
  });

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.activity_type) { toast.error("Activity type is required."); return; }
    if (!form.date) { toast.error("Date is required."); return; }
    mutate(form);
  };

  const ACTIVITY_TYPES = [
    "interview","observation","recording_session","archive_visit",
    "community_meeting","performance_attendance","site_visit","survey","other"
  ];

  return (
    <div className="space-y-5">
      <Section title="Activity Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title" required>
            <Input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Brief descriptive title" className="h-11 rounded-xl" />
          </Field>
          <Field label="Type" required>
            <Select value={form.activity_type} onValueChange={v => f("activity_type", v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select type…" /></SelectTrigger>
              <SelectContent>{ACTIVITY_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Date" required>
            <Input type="date" value={form.date} onChange={e => f("date", e.target.value)} className="h-11 rounded-xl" />
          </Field>
          <Field label="Researcher">
            <Input value={form.researcher} onChange={e => f("researcher", e.target.value)} placeholder="Your name" className="h-11 rounded-xl" />
          </Field>
          <Field label="Start Time">
            <Input type="time" value={form.time_start} onChange={e => f("time_start", e.target.value)} className="h-11 rounded-xl" />
          </Field>
          <Field label="End Time">
            <Input type="time" value={form.time_end} onChange={e => f("time_end", e.target.value)} className="h-11 rounded-xl" />
          </Field>
          <Field label="Parish">
            <Select value={form.parish} onValueChange={v => f("parish", v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…" /></SelectTrigger>
              <SelectContent>{PARISHES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Location Description">
            <Input value={form.location_description} onChange={e => f("location_description", e.target.value)} placeholder="Village, building, GPS…" className="h-11 rounded-xl" />
          </Field>
        </div>
        <Field label="Summary">
          <Textarea value={form.summary} onChange={e => f("summary", e.target.value)} placeholder="What happened? Who was present?" className="rounded-xl min-h-[90px]" />
        </Field>
        <Field label="Key Findings">
          <Textarea value={form.findings} onChange={e => f("findings", e.target.value)} placeholder="What did you learn?" className="rounded-xl min-h-[80px]" />
        </Field>
        <Field label="Follow-up Notes">
          <Textarea value={form.follow_up_notes} onChange={e => f("follow_up_notes", e.target.value)} placeholder="What still needs to be done?" className="rounded-xl min-h-[60px]" />
        </Field>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="followup"
            checked={form.follow_up_needed}
            onChange={e => f("follow_up_needed", e.target.checked)}
            className="h-4 w-4 accent-primary rounded"
          />
          <Label htmlFor="followup">Follow-up required</Label>
        </div>
        <Field label="Additional Notes">
          <Textarea value={form.notes} onChange={e => f("notes", e.target.value)} className="rounded-xl min-h-[60px]" />
        </Field>
      </Section>
      <div className="flex justify-end">
        <SaveBtn saving={isPending} onClick={handleSave} label="Save Activity" />
      </div>
    </div>
  );
}

// ─── Quick Band Note Tab ──────────────────────────────────────────────────────
function BandNoteForm() {
  const qc = useQueryClient();
  const [selectedBandId, setSelectedBandId] = useState("");
  const [noteText, setNoteText] = useState("");
  const [search, setSearch] = useState("");

  const { data: bands = [], isLoading } = useQuery({
    queryKey: ["fieldwork-bands"],
    queryFn: () => base44.entities.Band.list("name"),
  });

  const filtered = bands.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.parish?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBand = bands.find(b => b.id === selectedBandId);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, notes }) => base44.entities.Band.update(id, { notes }),
    onSuccess: () => {
      toast.success("Note appended to band record!");
      setNoteText("");
      qc.invalidateQueries({ queryKey: ["fieldwork-bands"] });
    }
  });

  const handleSave = () => {
    if (!selectedBandId) { toast.error("Select a band first."); return; }
    if (!noteText.trim()) { toast.error("Note cannot be empty."); return; }
    const existing = selectedBand?.notes || "";
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
    const appended = existing
      ? `${existing}\n\n[${timestamp}]\n${noteText.trim()}`
      : `[${timestamp}]\n${noteText.trim()}`;
    mutate({ id: selectedBandId, notes: appended });
  };

  return (
    <div className="space-y-5">
      <Section title="Select Band">
        <Field label="Search & Select Band">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type band name or parish…"
            className="h-11 rounded-xl"
          />
        </Field>
        {search && (
          <div className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border">
            {isLoading ? (
              <p className="text-sm text-muted-foreground p-4">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No bands found.</p>
            ) : filtered.map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBandId(b.id); setSearch(b.name); }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${selectedBandId === b.id ? "bg-primary/10 text-primary font-medium" : ""}`}
              >
                {b.name} <span className="text-xs text-muted-foreground">· {b.parish}</span>
              </button>
            ))}
          </div>
        )}
        {selectedBand && (
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
            <p className="font-semibold text-primary">{selectedBand.name}</p>
            {selectedBand.parish && <p className="text-xs text-muted-foreground">{selectedBand.parish}{selectedBand.village_community ? ` · ${selectedBand.village_community}` : ""}</p>}
            {selectedBand.notes && (
              <details className="mt-2">
                <summary className="text-xs text-muted-foreground cursor-pointer">Existing notes</summary>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap mt-1 font-sans">{selectedBand.notes}</pre>
              </details>
            )}
          </div>
        )}
      </Section>
      <Section title="Add Field Note">
        <Field label="Note">
          <Textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Your field observation, interview excerpt, correction, or update…"
            className="rounded-xl min-h-[140px]"
          />
        </Field>
        <p className="text-xs text-muted-foreground">This note will be timestamped and appended to the band's existing research notes.</p>
      </Section>
      <div className="flex justify-end">
        <SaveBtn saving={isPending} onClick={handleSave} label="Append Note" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FieldworkEntry() {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            Fieldwork Data Entry
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">
            Field Entry Forms
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Rapid data capture for musicians, sources, activities, and band notes. All records save directly to the research database.
          </p>
        </motion.div>

        <Tabs defaultValue="musician" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6 h-auto rounded-2xl bg-muted p-1">
            <TabsTrigger value="musician" className="rounded-xl flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
              <UserRound className="w-4 h-4" />
              Musician
            </TabsTrigger>
            <TabsTrigger value="source" className="rounded-xl flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
              <BookOpen className="w-4 h-4" />
              Source
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
              <ClipboardList className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="bandnote" className="rounded-xl flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
              <StickyNote className="w-4 h-4" />
              Band Note
            </TabsTrigger>
          </TabsList>

          <TabsContent value="musician"><MusicianForm /></TabsContent>
          <TabsContent value="source"><SourceForm /></TabsContent>
          <TabsContent value="activity"><ActivityForm /></TabsContent>
          <TabsContent value="bandnote"><BandNoteForm /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}