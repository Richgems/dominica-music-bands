import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Music, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState as useStateHook } from "react";

const GENRES = [
  { value: "all", label: "All" },
  { value: "Calypso / Cadence-Lypso", label: "Calypso / Cadence-Lypso" },
  { value: "Bouyon / Digital Era", label: "Bouyon / Digital Era" },
  { value: "Bouyon / Reggae / Soca", label: "Bouyon / Reggae / Soca" },
  { value: "Jing Ping", label: "Jing Ping" },
  { value: "Steel Band", label: "Steel Band" },
  { value: "Folk Heritage / Chorale", label: "Folk Heritage / Chorale" },
  { value: "Jazz", label: "Jazz" },
  { value: "Reggae", label: "Reggae" },
];

const ERAS = [
  { value: "1930s", label: "1930s" },
  { value: "1940s\u20131950s", label: "1940s–1950s" },
  { value: "1950s\u20132000s", label: "1950s–2000s" },
  { value: "1960s\u20131970s", label: "1960s–1970s" },
  { value: "1960s\u20132000", label: "1960s–2000" },
  { value: "1960s\u20132000s", label: "1960s–2000s" },
  { value: "1980s\u20131990s", label: "1980s–1990s" },
  { value: "2000s", label: "2000s" },
];

const PARISHES = [
  "Saint Andrew","Saint David","Saint George","Saint John","Saint Joseph",
  "Saint Luke","Saint Mark","Saint Patrick","Saint Paul","Saint Peter"
];

const TYPE_LABELS = {
  steelband: "Steel Band", jing_ping: "Jing Ping", bélé: "Bélé",
  quadrille: "Quadrille", bouyon: "Bouyon", cadence_lypso: "Cadence-lypso",
  gospel: "Gospel", string_band: "String Band", drum_and_chant: "Drum & Chant", other: "Other",
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-amber-100 text-amber-700 border-amber-200",
  dissolved: "bg-red-100 text-red-700 border-red-200",
  unknown: "bg-gray-100 text-gray-600 border-gray-200",
};

function BandRow({ band }) {
  return (
    <Link to={`/bands/${band.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Music className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{band.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {band.parish}{band.village_community ? ` · ${band.village_community}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {band.active_years && (
            <span className="text-xs text-muted-foreground hidden sm:block">{band.active_years}</span>
          )}
          {band.band_type && (
            <Badge variant="outline" className="text-[10px] hidden md:block">
              {TYPE_LABELS[band.band_type] || band.band_type}
            </Badge>
          )}
          {band.status && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[band.status] || STATUS_COLORS.unknown}`}>
              {band.status}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

function BandList({ bands, isLoading, search }) {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : bands.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>{search ? "No bands match your search." : "No bands found."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground pb-1">{bands.length} band{bands.length !== 1 ? "s" : ""}</p>
          {bands.map(b => <BandRow key={b.id} band={b} />)}
        </div>
      )}
    </div>
  );
}

export default function Bands() {
  const [activeGenre, setActiveGenre] = useState("all");
  const [activeEra, setActiveEra] = useState("all");
  const [activeParish, setActiveParish] = useState("all");
  const [search, setSearch] = useState("");
  const [showTaglineEdit, setShowTaglineEdit] = useState(false);
  const [customTagline, setCustomTagline] = useState(localStorage.getItem("bandsTagline") || "");

  const { data: allBands = [], isLoading } = useQuery({
    queryKey: ["bands"],
    queryFn: () => base44.entities.Band.list("name"),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allBands.filter(b => {
      const genreMatch = activeGenre === "all" || b.genre === activeGenre;
      const eraMatch = activeEra === "all" || b.era === activeEra;
      const parishMatch = activeParish === "all" || b.parish === activeParish;
      const searchMatch = !q ||
        b.name?.toLowerCase().includes(q) ||
        b.parish?.toLowerCase().includes(q) ||
        b.era?.toLowerCase().includes(q) ||
        b.genre?.toLowerCase().includes(q) ||
        b.village_community?.toLowerCase().includes(q);
      return genreMatch && eraMatch && parishMatch && searchMatch;
    });
  }, [allBands, activeGenre, activeEra, activeParish, search]);

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            Band Directory
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">
            Bands of Dominica
          </h1>
          <div className="flex items-start gap-2 max-w-xl">
            <p className="text-muted-foreground flex-1">
              {customTagline || "Explore the rich musical heritage of Dominica's ensembles—from traditional steelbands and folk heritage to contemporary soca and bouyon—part of our ongoing research documentation of Caribbean musical traditions."}
            </p>
            <button
              onClick={() => setShowTaglineEdit(true)}
              className="mt-1 p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
              title="Edit tagline"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <Dialog open={showTaglineEdit} onOpenChange={setShowTaglineEdit}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Bands Page Tagline</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Textarea
                value={customTagline}
                onChange={e => setCustomTagline(e.target.value)}
                placeholder="Enter your custom tagline..."
                className="h-24 rounded-lg"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    localStorage.setItem("bandsTagline", customTagline);
                    setShowTaglineEdit(false);
                  }}
                  variant="default"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setCustomTagline(localStorage.getItem("bandsTagline") || "");
                    setShowTaglineEdit(false);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, parish, era, genre…"
            className="pl-9 h-11 rounded-xl"
          />
        </div>

        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {GENRES.map(g => (
            <button
              key={g.value}
              onClick={() => setActiveGenre(g.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeGenre === g.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Era filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setActiveEra("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeEra === "all"
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-background text-foreground border-border hover:border-secondary/50 hover:bg-muted"
            }`}
          >All Eras</button>
          {ERAS.map(era => (
            <button
              key={era.value}
              onClick={() => setActiveEra(era.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeEra === era.value
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-background text-foreground border-border hover:border-secondary/50 hover:bg-muted"
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>

        {/* Parish filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveParish("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeParish === "all"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-background text-foreground border-border hover:border-amber-400/50 hover:bg-muted"
            }`}
          >All Parishes</button>
          {PARISHES.map(p => (
            <button
              key={p}
              onClick={() => setActiveParish(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeParish === p
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-background text-foreground border-border hover:border-amber-400/50 hover:bg-muted"
              }`}
            >
              {p.replace("Saint ", "St. ")}
            </button>
          ))}
        </div>

        <BandList bands={filtered} isLoading={isLoading} search={search} />
      </div>
    </div>
  );
}