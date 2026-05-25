import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Save, Mic, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const PARISHES = [
  "Saint Andrew","Saint David","Saint George","Saint John","Saint Joseph",
  "Saint Luke","Saint Mark","Saint Patrick","Saint Paul","Saint Peter","Other / Diaspora"
];

const BAND_TYPES = [
  { value: "steelband", label: "Steel Band" },
  { value: "jing_ping", label: "Jing Ping" },
  { value: "bélé", label: "Bélé" },
  { value: "quadrille", label: "Quadrille" },
  { value: "bouyon", label: "Bouyon" },
  { value: "cadence_lypso", label: "Cadence-lypso" },
  { value: "gospel", label: "Gospel" },
  { value: "string_band", label: "String Band" },
  { value: "drum_and_chant", label: "Drum & Chant" },
  { value: "brass_band", label: "Brass Band" },
  { value: "other", label: "Other" },
];

function FieldRow({ label, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-primary ml-1">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{title}</span>
        <Separator className="flex-1" />
      </div>
      {children}
    </div>
  );
}

function SuccessMessage({ onReset }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center py-16 gap-4">
      <CheckCircle2 className="w-14 h-14 text-green-500" />
      <h3 className="font-heading text-2xl font-bold">Thank you for your contribution!</h3>
      <p className="text-muted-foreground max-w-md">
        Your submission has been recorded and will be reviewed for inclusion in the research.
      </p>
      <Button onClick={onReset} variant="outline" className="rounded-xl mt-2">Submit Another</Button>
    </motion.div>
  );
}

// ── BAND INFORMATION FORM (face-to-face interview / site visitor) ──────────
function BandInfoForm() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    submitter_name: "", submitter_role: "", submitter_contact: "",
    band_name: "", also_known_as: "", band_type: "", parish: "",
    village_community: "", active_years: "", status: "",
    leader_name: "", key_members: "", instruments: "",
    performance_contexts: "", repertoire_notes: "", description: "",
    formation_story: "", dissolution_reason: "", cultural_significance: "",
    recordings_known: "", archival_sources: "", additional_notes: "",
  });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const createM = useMutation({
    mutationFn: async (data) => {
      // Save as a DataRecord for review
      return base44.entities.DataRecord.create({
        record_type: "band_profile",
        title: `Submission: ${data.band_name || "Unnamed Band"}`,
        parish: data.parish,
        collector: data.submitter_name,
        content: JSON.stringify(data, null, 2),
        tags: [data.band_type, data.parish].filter(Boolean),
        quality: "medium",
        verified: false,
        notes: `Submitted via questionnaire. Submitter role: ${data.submitter_role}. Contact: ${data.submitter_contact}`,
      });
    },
    onSuccess: () => { setDone(true); toast.success("Band information submitted!"); }
  });

  if (done) return <SuccessMessage onReset={() => { setDone(false); setForm({ submitter_name:"",submitter_role:"",submitter_contact:"",band_name:"",also_known_as:"",band_type:"",parish:"",village_community:"",active_years:"",status:"",leader_name:"",key_members:"",instruments:"",performance_contexts:"",repertoire_notes:"",description:"",formation_story:"",dissolution_reason:"",cultural_significance:"",recordings_known:"",archival_sources:"",additional_notes:"" }); }} />;

  return (
    <div className="max-w-2xl space-y-8">
      <Section title="About You">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Your Name" hint="Optional — helps us follow up if needed">
            <Input value={form.submitter_name} onChange={e=>f("submitter_name",e.target.value)} className="h-11 rounded-xl" placeholder="Full name"/>
          </FieldRow>
          <FieldRow label="Your Role / Connection">
            <Select value={form.submitter_role} onValueChange={v=>f("submitter_role",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select…"/></SelectTrigger>
              <SelectContent>
                {["Former band member","Current band member","Band leader / founder","Family member of musician","Community member","Historian / researcher","Cultural officer","Music fan / site visitor","Other"].map(r=>(
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Contact Email or Phone" hint="Optional — for follow-up only">
            <Input value={form.submitter_contact} onChange={e=>f("submitter_contact",e.target.value)} className="h-11 rounded-xl" placeholder="email or phone"/>
          </FieldRow>
        </div>
      </Section>

      <Section title="Band Identity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Band Name" required>
            <Input value={form.band_name} onChange={e=>f("band_name",e.target.value)} className="h-11 rounded-xl" placeholder="Official or known name"/>
          </FieldRow>
          <FieldRow label="Also Known As" hint="Aliases, abbreviations, alternate spellings">
            <Input value={form.also_known_as} onChange={e=>f("also_known_as",e.target.value)} className="h-11 rounded-xl" placeholder="Alternate name(s)"/>
          </FieldRow>
          <FieldRow label="Band Type / Genre">
            <Select value={form.band_type} onValueChange={v=>f("band_type",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select type…"/></SelectTrigger>
              <SelectContent>{BAND_TYPES.map(t=><SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Status">
            <Select value={form.status} onValueChange={v=>f("status",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select…"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Still active</SelectItem>
                <SelectItem value="inactive">Inactive (paused)</SelectItem>
                <SelectItem value="dissolved">Dissolved / no longer exists</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Active Years" hint="e.g. 1965–1983, or 1978–present">
            <Input value={form.active_years} onChange={e=>f("active_years",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. 1965–1983"/>
          </FieldRow>
        </div>
      </Section>

      <Section title="Location — Commonwealth of Dominica">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Parish">
            <Select value={form.parish} onValueChange={v=>f("parish",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…"/></SelectTrigger>
              <SelectContent>{PARISHES.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Village or Community">
            <Input value={form.village_community} onChange={e=>f("village_community",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. Roseau, Soufrière, Marigot"/>
          </FieldRow>
        </div>
      </Section>

      <Section title="Personnel">
        <FieldRow label="Band Leader / Founder">
          <Input value={form.leader_name} onChange={e=>f("leader_name",e.target.value)} className="h-11 rounded-xl" placeholder="Name(s) of leader or founder"/>
        </FieldRow>
        <FieldRow label="Key Members" hint="Names of notable or founding members you can recall">
          <Textarea value={form.key_members} onChange={e=>f("key_members",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="List key members, instruments they played, approximate years active…"/>
        </FieldRow>
        <FieldRow label="Instruments Used">
          <Textarea value={form.instruments} onChange={e=>f("instruments",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="e.g. accordion, boula drum, steel pans, bass guitar…"/>
        </FieldRow>
      </Section>

      <Section title="Music & Performance">
        <FieldRow label="Performance Contexts" hint="When and where did this band typically perform?">
          <Textarea value={form.performance_contexts} onChange={e=>f("performance_contexts",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="e.g. Carnival, Independence celebrations, weddings, funerals, dances, fetes…"/>
        </FieldRow>
        <FieldRow label="Repertoire" hint="Songs, rhythms, or musical styles associated with this band">
          <Textarea value={form.repertoire_notes} onChange={e=>f("repertoire_notes",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Known songs, compositions, signature pieces, style of music…"/>
        </FieldRow>
      </Section>

      <Section title="History & Context">
        <FieldRow label="Description / Overview" hint="Any general information about the band's character and significance">
          <Textarea value={form.description} onChange={e=>f("description",e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Describe the band in your own words…"/>
        </FieldRow>
        <FieldRow label="Formation Story" hint="How and why was the band formed? Who was involved at the beginning?">
          <Textarea value={form.formation_story} onChange={e=>f("formation_story",e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Circumstances of founding, year, inspiration, early activities…"/>
        </FieldRow>
        <FieldRow label="Reason for Dissolution" hint="If the band no longer exists, what led to its end?">
          <Textarea value={form.dissolution_reason} onChange={e=>f("dissolution_reason",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="e.g. key member emigrated, funding issues, death of leader, natural disaster…"/>
        </FieldRow>
        <FieldRow label="Cultural Significance" hint="What did this band mean to its community or to Dominican music overall?">
          <Textarea value={form.cultural_significance} onChange={e=>f("cultural_significance",e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Describe the band's impact on the community, culture, or music history of Dominica…"/>
        </FieldRow>
      </Section>

      <Section title="Sources & Records">
        <FieldRow label="Known Recordings" hint="Are you aware of any recordings (audio, video, film) of this band?">
          <Textarea value={form.recordings_known} onChange={e=>f("recordings_known",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="Recordings, tapes, videos — where they might be found, who might hold them…"/>
        </FieldRow>
        <FieldRow label="Archival or Documentary Sources" hint="Newspapers, photographs, programmes, government records, etc.">
          <Textarea value={form.archival_sources} onChange={e=>f("archival_sources",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="Any documents, photos, newspaper articles, or records relating to this band…"/>
        </FieldRow>
        <FieldRow label="Additional Notes" hint="Anything else you would like to add">
          <Textarea value={form.additional_notes} onChange={e=>f("additional_notes",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Other information, corrections, names of people who may know more…"/>
        </FieldRow>
      </Section>

      <Button
        onClick={() => createM.mutate(form)}
        disabled={!form.band_name || createM.isPending}
        className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-8 h-12"
      >
        {createM.isPending
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
          : <Save className="w-4 h-4"/>}
        Submit Band Information
      </Button>
    </div>
  );
}

// ── MUSICIAN / INFORMANT FORM ──────────────────────────────────────────────
function MusicianForm() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    submitter_name:"", submitter_contact:"",
    full_name:"", also_known_as:"", birth_year:"", death_year:"",
    parish:"", village_community:"", instruments:"", roles:"",
    bands_associated:"", biography:"", key_anecdotes:"",
    recordings_known:"", sources:"", notes:""
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const createM = useMutation({
    mutationFn: async (data) => base44.entities.DataRecord.create({
      record_type: "interview_transcript",
      title: `Musician Submission: ${data.full_name || "Unknown"}`,
      parish: data.parish,
      collector: data.submitter_name,
      content: JSON.stringify(data, null, 2),
      verified: false,
      notes: `Contact: ${data.submitter_contact}`,
    }),
    onSuccess: () => { setDone(true); toast.success("Musician information submitted!"); }
  });

  if (done) return <SuccessMessage onReset={() => setDone(false)} />;

  return (
    <div className="max-w-2xl space-y-8">
      <Section title="About You">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Your Name">
            <Input value={form.submitter_name} onChange={e=>f("submitter_name",e.target.value)} className="h-11 rounded-xl" placeholder="Your name"/>
          </FieldRow>
          <FieldRow label="Your Contact (optional)">
            <Input value={form.submitter_contact} onChange={e=>f("submitter_contact",e.target.value)} className="h-11 rounded-xl" placeholder="Email or phone"/>
          </FieldRow>
        </div>
      </Section>

      <Section title="Musician / Informant Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Full Name" required>
            <Input value={form.full_name} onChange={e=>f("full_name",e.target.value)} className="h-11 rounded-xl" placeholder="Full name"/>
          </FieldRow>
          <FieldRow label="Also Known As">
            <Input value={form.also_known_as} onChange={e=>f("also_known_as",e.target.value)} className="h-11 rounded-xl" placeholder="Nickname or alias"/>
          </FieldRow>
          <FieldRow label="Birth Year">
            <Input type="number" value={form.birth_year} onChange={e=>f("birth_year",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. 1942"/>
          </FieldRow>
          <FieldRow label="Death Year (if applicable)">
            <Input type="number" value={form.death_year} onChange={e=>f("death_year",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. 2005"/>
          </FieldRow>
          <FieldRow label="Parish">
            <Select value={form.parish} onValueChange={v=>f("parish",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…"/></SelectTrigger>
              <SelectContent>{PARISHES.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Village / Community">
            <Input value={form.village_community} onChange={e=>f("village_community",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. Pointe Michel"/>
          </FieldRow>
        </div>
        <FieldRow label="Instruments Played">
          <Input value={form.instruments} onChange={e=>f("instruments",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. accordion, bass drum, guitar…"/>
        </FieldRow>
        <FieldRow label="Role(s) in Music" hint="e.g. performer, composer, band leader, teacher, arranger">
          <Input value={form.roles} onChange={e=>f("roles",e.target.value)} className="h-11 rounded-xl" placeholder="e.g. lead vocalist and arranger"/>
        </FieldRow>
        <FieldRow label="Bands Associated With">
          <Textarea value={form.bands_associated} onChange={e=>f("bands_associated",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Names of bands they were part of, approximate years…"/>
        </FieldRow>
        <FieldRow label="Biography / Life Story" hint="Any relevant background, training, career highlights">
          <Textarea value={form.biography} onChange={e=>f("biography",e.target.value)} className="rounded-xl min-h-[120px]" placeholder="Background, how they got into music, notable career moments…"/>
        </FieldRow>
        <FieldRow label="Key Anecdotes or Memories" hint="Stories, events, performances worth recording">
          <Textarea value={form.key_anecdotes} onChange={e=>f("key_anecdotes",e.target.value)} className="rounded-xl min-h-[120px]" placeholder="Any particular stories, performances, or memories that stand out…"/>
        </FieldRow>
        <FieldRow label="Known Recordings or Materials">
          <Textarea value={form.recordings_known} onChange={e=>f("recordings_known",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="Audio, video, photographs, documents…"/>
        </FieldRow>
        <FieldRow label="Additional Notes">
          <Textarea value={form.notes} onChange={e=>f("notes",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="Anything else of interest…"/>
        </FieldRow>
      </Section>

      <Button onClick={()=>createM.mutate(form)} disabled={!form.full_name||createM.isPending}
        className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-8 h-12">
        {createM.isPending?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Save className="w-4 h-4"/>}
        Submit Musician Information
      </Button>
    </div>
  );
}

// ── GENERAL MEMORIES FORM ─────────────────────────────────────────────────
function MemoriesForm() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    submitter_name:"", submitter_contact:"", submitter_role:"",
    parish:"", era:"", memory:"", band_names:"", event_context:"",
    cultural_observations:"", sources_or_evidence:"", additional:""
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const createM = useMutation({
    mutationFn: async (data) => base44.entities.DataRecord.create({
      record_type: "other",
      title: `Memory Submission — ${data.parish || "Dominica"} (${data.era || "era unknown"})`,
      parish: data.parish,
      collector: data.submitter_name,
      content: JSON.stringify(data, null, 2),
      verified: false,
      notes: `Contact: ${data.submitter_contact}. Role: ${data.submitter_role}`,
    }),
    onSuccess: () => { setDone(true); toast.success("Memories submitted!"); }
  });

  if (done) return <SuccessMessage onReset={() => setDone(false)} />;

  return (
    <div className="max-w-2xl space-y-8">
      <Section title="About You">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Your Name">
            <Input value={form.submitter_name} onChange={e=>f("submitter_name",e.target.value)} className="h-11 rounded-xl" placeholder="Optional"/>
          </FieldRow>
          <FieldRow label="Your Connection to Dominican Music">
            <Select value={form.submitter_role} onValueChange={v=>f("submitter_role",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select…"/></SelectTrigger>
              <SelectContent>
                {["Musician / former musician","Music lover / fan","Community member","Researcher","Cultural officer","Diaspora Dominican","Other"].map(r=>(
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Contact (optional)">
            <Input value={form.submitter_contact} onChange={e=>f("submitter_contact",e.target.value)} className="h-11 rounded-xl" placeholder="Email or phone"/>
          </FieldRow>
        </div>
      </Section>

      <Section title="Your Memories & Observations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Parish or Location">
            <Select value={form.parish} onValueChange={v=>f("parish",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select parish…"/></SelectTrigger>
              <SelectContent>{PARISHES.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Era / Period" hint="Approximate decade(s) your memories relate to">
            <Select value={form.era} onValueChange={v=>f("era",v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select era…"/></SelectTrigger>
              <SelectContent>
                {["1930s","1940s","1950s","1960s","1970s","1980s","1990s","2000s","Multiple eras"].map(e=>(
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>
        </div>
        <FieldRow label="Bands You Remember" hint="Names of any bands you recall, however incomplete">
          <Textarea value={form.band_names} onChange={e=>f("band_names",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="Band names, even partial or phonetic spellings are helpful…"/>
        </FieldRow>
        <FieldRow label="Your Memories" required hint="Describe what you remember about music in your community — events, performances, musicians, dances, celebrations">
          <Textarea value={form.memory} onChange={e=>f("memory",e.target.value)} className="rounded-xl min-h-[150px]" placeholder="Share your memories in as much detail as you feel comfortable with…"/>
        </FieldRow>
        <FieldRow label="Event Context" hint="Were these memories connected to specific events?">
          <Textarea value={form.event_context} onChange={e=>f("event_context",e.target.value)} className="rounded-xl min-h-[80px]" placeholder="e.g. Carnival, Independence Day, church events, dances, mas camps…"/>
        </FieldRow>
        <FieldRow label="Cultural Observations" hint="What role did music play in the social and cultural life of your community?">
          <Textarea value={form.cultural_observations} onChange={e=>f("cultural_observations",e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Music's role in community life, identity, celebrations, conflict, healing…"/>
        </FieldRow>
        <FieldRow label="Evidence or Sources" hint="Do you have photographs, recordings, programmes, or know where materials might be found?">
          <Textarea value={form.sources_or_evidence} onChange={e=>f("sources_or_evidence",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="Photos, tapes, posters, newspaper clippings, documents…"/>
        </FieldRow>
        <FieldRow label="Anything Else to Add">
          <Textarea value={form.additional} onChange={e=>f("additional",e.target.value)} className="rounded-xl min-h-[70px]" placeholder="Names of people who might know more, corrections, other details…"/>
        </FieldRow>
      </Section>

      <Button onClick={()=>createM.mutate(form)} disabled={!form.memory||createM.isPending}
        className="bg-primary hover:bg-primary/90 rounded-xl gap-2 px-8 h-12">
        {createM.isPending?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Save className="w-4 h-4"/>}
        Submit Memories
      </Button>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function Questionnaire() {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 block">
            Research Questionnaire — Commonwealth of Dominica
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Contribute to the Research</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Help document the history of music and bands in Dominica. Share what you know —
            whether from a face-to-face interview, your own memories, or knowledge of a musician or band.
          </p>
        </motion.div>

        <Tabs defaultValue="band">
          <TabsList className="mb-8 bg-muted rounded-xl p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="band" className="rounded-lg gap-2 data-[state=active]:bg-background px-4 py-2.5">
              <BookOpen className="w-4 h-4"/> Band Information
            </TabsTrigger>
            <TabsTrigger value="musician" className="rounded-lg gap-2 data-[state=active]:bg-background px-4 py-2.5">
              <Mic className="w-4 h-4"/> Musician / Informant
            </TabsTrigger>
            <TabsTrigger value="memories" className="rounded-lg gap-2 data-[state=active]:bg-background px-4 py-2.5">
              <Users className="w-4 h-4"/> Memories & Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="band"><BandInfoForm /></TabsContent>
          <TabsContent value="musician"><MusicianForm /></TabsContent>
          <TabsContent value="memories"><MemoriesForm /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}