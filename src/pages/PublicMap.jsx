import React, { useState, useMemo, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Music, MapPin, Search, Users, ExternalLink, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import QRCodePanel from "@/components/map/QRCodePanel";

const SETTINGS_KEY = "parishPositions";

const PARISHES = [
  { name: "Saint John",    color: "#dc2626", x: 22, y: 13,  size: null },
  { name: "Saint Andrew",  color: "#2563eb", x: 64, y: 30,  size: null },
  { name: "Saint Peter",   color: "#16a34a", x: 35, y: 31,  size: null },
  { name: "Saint Joseph",  color: "#16a34a", x: 35, y: 50,  size: null },
  { name: "Saint David",   color: "#111827", x: 71, y: 60,  size: null },
  { name: "Saint Paul",    color: "#db2777", x: 47, y: 67,  size: null },
  { name: "Saint George",  color: "#dc2626", x: 34, y: 81,  size: null },
  { name: "Saint Patrick", color: "#ea580c", x: 73, y: 82,  size: null },
  { name: "Saint Luke",    color: "#6b7280", x: 34, y: 94,  size: null },
  { name: "Saint Mark",    color: "#ca8a04", x: 46, y: 95,  size: null },
];

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-amber-100 text-amber-700 border-amber-200",
  dissolved: "bg-red-100 text-red-700 border-red-200",
  unknown: "bg-gray-100 text-gray-600 border-gray-200",
};

function getBubbleSize(count) {
  if (count >= 80) return 52;
  if (count >= 20) return 44;
  if (count >= 15) return 36;
  if (count >= 10) return 30;
  if (count >= 6)  return 24;
  if (count >= 1)  return 20;
  return 16;
}

function ParishPanel({ parish, bands }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() =>
    bands.filter(b =>
      !search ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.genre?.toLowerCase().includes(search.toLowerCase())
    ), [bands, search]);

  return (
    <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle className="font-heading flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          {parish}
        </DialogTitle>
        <p className="text-sm text-muted-foreground">{bands.length} band{bands.length !== 1 ? "s" : ""} documented</p>
      </DialogHeader>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search bands…"
          className="pl-9 h-10 rounded-lg"
        />
      </div>
      <div className="overflow-y-auto space-y-2 mt-2 flex-1 pr-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No bands match your search.</p>
        ) : filtered.map(b => (
          <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Music className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{b.name}</p>
                {b.genre && <p className="text-xs text-muted-foreground truncate">{b.genre}</p>}
                {b.active_years && <p className="text-xs text-muted-foreground">{b.active_years}</p>}
                {b.village_community && <p className="text-xs text-muted-foreground">{b.village_community}</p>}
              </div>
            </div>
            {b.status && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${STATUS_COLORS[b.status] || STATUS_COLORS.unknown}`}>
                {b.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </DialogContent>
  );
}

export default function PublicMap() {
  const [selectedParish, setSelectedParish] = useState(null);
  const [positions, setPositions] = useState(PARISHES);
  const [showQR, setShowQR] = useState(false);
  const mapRef = useRef(null);

  // Load saved positions from MapSettings DB (synced to admin editor)
  const { data: settingsRecords = [] } = useQuery({
    queryKey: ["map-settings-public"],
    queryFn: () => base44.entities.MapSettings.filter({ key: SETTINGS_KEY }),
  });

  useEffect(() => {
    if (settingsRecords.length > 0) {
      try {
        const parsed = JSON.parse(settingsRecords[0].value);
        const merged = PARISHES.map(p => {
          const saved = parsed.find(s => s.name === p.name);
          return saved ? { ...p, x: saved.x, y: saved.y, size: saved.size } : p;
        });
        setPositions(merged);
      } catch {
        setPositions(PARISHES);
      }
    }
  }, [settingsRecords]);

  const { data: bands = [], isLoading } = useQuery({
    queryKey: ["map-bands-public"],
    queryFn: () => base44.entities.Band.list("name"),
  });

  const byParish = useMemo(() => {
    const g = {};
    PARISHES.forEach(p => g[p.name] = []);
    bands.forEach(b => {
      if (b.parish && g[b.parish] !== undefined) g[b.parish].push(b);
    });
    return g;
  }, [bands]);

  const selectedBands = selectedParish ? (byParish[selectedParish] || []) : [];
  const mapUrl = typeof window !== "undefined" ? window.location.origin + "/map" : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Clean minimal nav — About + Contact + Share only */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold text-sm tracking-tight">dominicamusicarchives.org</span>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/about"
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              Contact
            </Link>
            <button
              onClick={() => setShowQR(true)}
              className="ml-1 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-14 flex-1 max-w-5xl mx-auto w-full px-4 py-6">

        {/* Header */}
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1 block">
            Interactive Parish Map
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-1">
            Bands of Dominica
          </h1>
          <p className="text-muted-foreground text-xs">
            Tap any parish bubble to explore documented ensembles. To contribute information, use the{" "}
            <Link to="/contact" className="text-primary underline">Contact</Link> page.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Map — view only, no edit controls */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-border shadow-lg bg-card w-full">
            <div ref={mapRef} className="relative w-full" style={{ paddingBottom: "105%" }}>
              <img
                src="https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/51c726f9f_DominicaMap-Option1.png"
                alt="Dominica Parish Map"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
              {positions.map(parish => {
                const count = (byParish[parish.name] || []).length;
                const size = parish.size ?? getBubbleSize(count);
                return (
                  <div
                    key={parish.name}
                    onClick={() => setSelectedParish(parish.name)}
                    title={`${parish.name} — ${count} band${count !== 1 ? "s" : ""}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold text-white shadow-lg select-none cursor-pointer active:scale-95 transition-transform"
                    style={{
                      left: `${parish.x}%`,
                      top: `${parish.y}%`,
                      width: size,
                      height: size,
                      backgroundColor: parish.color,
                      fontSize: Math.max(9, size * 0.32),
                      opacity: 0.9,
                      border: "2.5px solid white",
                      zIndex: 10,
                      userSelect: "none",
                    }}
                  >
                    {count > 0 ? count : ""}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar — stats + parish list */}
          <div className="lg:w-56 space-y-4 w-full">
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <h3 className="font-heading text-sm font-bold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Registry Summary
              </h3>
              {isLoading ? (
                <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div>
              ) : (
                <>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total bands</span><span className="font-semibold">{bands.length}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Active</span><span className="font-semibold text-green-600">{bands.filter(b => b.status === "active").length}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Dissolved</span><span className="font-semibold text-red-500">{bands.filter(b => b.status === "dissolved").length}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Unknown</span><span className="font-semibold text-gray-500">{bands.filter(b => !b.status || b.status === "unknown").length}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between text-xs"><span className="text-muted-foreground">Parishes covered</span><span className="font-semibold">{PARISHES.filter(p => (byParish[p.name] || []).length > 0).length}/10</span></div>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Parishes</h3>
              <div className="space-y-1">
                {PARISHES.map(parish => {
                  const count = (byParish[parish.name] || []).length;
                  return (
                    <button
                      key={parish.name}
                      onClick={() => setSelectedParish(parish.name)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: parish.color }} />
                        <span className="text-xs font-medium">{parish.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Dominica Music Archive · Research by Richard · All rights reserved ·{" "}
          <Link to="/about" className="text-primary hover:underline">About</Link> ·{" "}
          <Link to="/contact" className="text-primary hover:underline">Contact</Link>
        </div>
      </div>

      {/* Parish dialog */}
      <Dialog open={!!selectedParish} onOpenChange={o => !o && setSelectedParish(null)}>
        {selectedParish && <ParishPanel parish={selectedParish} bands={selectedBands} />}
      </Dialog>

      {/* QR / Share dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <QRCodePanel url={mapUrl} />
      </Dialog>
    </div>
  );
}