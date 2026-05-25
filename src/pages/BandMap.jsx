import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music, MapPin, Search, Users, Settings, ExternalLink } from "lucide-react";
import QRCodePanel from "@/components/map/QRCodePanel";
import { motion } from "framer-motion";

const SETTINGS_KEY = "parishPositions";

// Bubble positions as % of image width/height, derived from the colored parish map
// Image is portrait ~980x1040px. Positions tuned to match provided bubble guide.
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

function ParishPanel({ parish, bands, onClose }) {
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

export default function BandMap() {
  const [selectedParish, setSelectedParish] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [positions, setPositions] = useState(PARISHES);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const mapRef = React.useRef(null);
  const queryClient = useQueryClient();

  // Load positions from DB on mount
  const { data: settingsRecords = [] } = useQuery({
    queryKey: ["map-settings"],
    queryFn: () => base44.entities.MapSettings.filter({ key: SETTINGS_KEY }),
  });

  useEffect(() => {
    if (settingsRecords.length > 0) {
      try {
        const parsed = JSON.parse(settingsRecords[0].value);
        // Merge with PARISHES to preserve color and any new parishes added later
        const merged = PARISHES.map(p => {
          const saved = parsed.find(s => s.name === p.name);
          return saved ? { ...p, x: saved.x, y: saved.y, size: saved.size } : p;
        });
        setPositions(merged);
      } catch (e) {
        setPositions(PARISHES);
      }
    }
  }, [settingsRecords]);

  const handlePositionChange = (name, field, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const updated = positions.map(p =>
      p.name === name ? { ...p, [field]: num } : p
    );
    setPositions(updated);
  };

  const savePositions = async () => {
    setSaving(true);
    const payload = positions.map(({ name, x, y, size }) => ({ name, x, y, size }));
    const valueStr = JSON.stringify(payload);
    if (settingsRecords.length > 0) {
      await base44.entities.MapSettings.update(settingsRecords[0].id, { value: valueStr });
    } else {
      await base44.entities.MapSettings.create({ key: SETTINGS_KEY, value: valueStr });
    }
    await queryClient.invalidateQueries({ queryKey: ["map-settings"] });
    setSaving(false);
    setEditMode(false);
  };

  const resetPositions = async () => {
    setSaving(true);
    const payload = PARISHES.map(({ name, x, y, size }) => ({ name, x, y, size }));
    const valueStr = JSON.stringify(payload);
    if (settingsRecords.length > 0) {
      await base44.entities.MapSettings.update(settingsRecords[0].id, { value: valueStr });
    } else {
      await base44.entities.MapSettings.create({ key: SETTINGS_KEY, value: valueStr });
    }
    await queryClient.invalidateQueries({ queryKey: ["map-settings"] });
    setPositions(PARISHES);
    setSaving(false);
    setEditMode(false);
  };

  const getEventCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleBubbleMouseDown = useCallback((e, name) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(name);
  }, [editMode]);

  const handleMapMouseMove = useCallback((e) => {
    if (!dragging || !mapRef.current) return;
    const { clientX, clientY } = getEventCoords(e);
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(105, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setPositions(prev => prev.map(p =>
      p.name === dragging
        ? { ...p, x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2 }
        : p
    ));
  }, [dragging]);

  const handleMapMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const { data: bands = [], isLoading } = useQuery({
    queryKey: ["map-bands"],
    queryFn: () => base44.entities.Band.list("name"),
  });

  const byParish = useMemo(() => {
    const g = {};
    PARISHES.forEach(p => g[p.name] = []);
    bands.forEach(b => {
      if (b.parish && g[b.parish] !== undefined) {
        g[b.parish].push(b);
      }
    });
    return g;
  }, [bands]);

  const selectedBands = selectedParish ? (byParish[selectedParish] || []) : [];

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 block">
            Interactive Parish Map
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Bands of Dominica
          </h1>
          <p className="text-muted-foreground text-sm">
            Click any parish bubble to explore documented bands. Submit corrections or additions via the <a href="/questionnaire" className="text-primary underline">Questionnaire</a>.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Map */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-border shadow-lg bg-card w-full">
            {/* Actual parish map image as background */}
            <div
              ref={mapRef}
              className="relative w-full"
              style={{ paddingBottom: "105%", cursor: dragging ? "grabbing" : "default" }}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
              onTouchMove={handleMapMouseMove}
              onTouchEnd={handleMapMouseUp}
            >
              <img
                src="https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/51c726f9f_DominicaMap-Option1.png"
                alt="Dominica Parish Map"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />

              {/* Clickable / draggable bubbles overlaid on map */}
              {positions.map(parish => {
                const count = (byParish[parish.name] || []).length;
                const size = parish.size !== null && parish.size !== undefined ? parish.size : getBubbleSize(count);
                const isDraggingThis = dragging === parish.name;

                return (
                  <div
                    key={parish.name}
                    onMouseDown={e => handleBubbleMouseDown(e, parish.name)}
                    onTouchStart={e => handleBubbleMouseDown(e, parish.name)}
                    onClick={() => !editMode && setSelectedParish(parish.name)}
                    title={editMode ? `Drag to reposition ${parish.name}` : `${parish.name} — ${count} band${count !== 1 ? "s" : ""}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold text-white shadow-lg select-none"
                    style={{
                      left: `${parish.x}%`,
                      top: `${parish.y}%`,
                      width: size,
                      height: size,
                      backgroundColor: parish.color,
                      fontSize: count > 0 ? Math.max(9, size * 0.32) : 8,
                      opacity: isDraggingThis ? 0.7 : (editMode ? 1 : 0.88),
                      border: editMode ? "3px dashed white" : "2.5px solid white",
                      cursor: editMode ? (isDraggingThis ? "grabbing" : "grab") : "pointer",
                      zIndex: isDraggingThis ? 20 : 10,
                      transition: isDraggingThis ? "none" : "transform 0.15s",
                      userSelect: "none",
                    }}
                  >
                    {editMode ? parish.name.replace("Saint ", "") : (count > 0 ? count : "")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-64 space-y-4 w-full">
            {/* Edit mode toggle */}
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "default" : "outline"}
              className="w-full gap-2"
              size="sm"
            >
              <Settings className="w-4 h-4" />
              {editMode ? "Editing positions…" : "Edit positions"}
            </Button>

            {/* Share / QR */}
            <Button
              onClick={() => setShowQR(true)}
              variant="outline"
              className="w-full gap-2"
              size="sm"
            >
              <ExternalLink className="w-4 h-4" />
              Share Map (QR)
            </Button>

            {/* Position editor (when active) */}
            {editMode && (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3 max-h-96 overflow-y-auto">
                <h3 className="font-heading text-sm font-bold">Adjust bubble positions</h3>
                <p className="text-[11px] text-muted-foreground">Drag bubbles on the map, or edit X/Y below.</p>
                <div className="space-y-2 text-xs">
                  {positions.map(p => (
                    <div key={p.name} className="space-y-1 pb-2 border-b border-border/40 last:border-b-0">
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-muted-foreground">X (%)</label>
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            value={p.x}
                            onChange={e => handlePositionChange(p.name, "x", e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground">Y (%)</label>
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            max="105"
                            value={p.y}
                            onChange={e => handlePositionChange(p.name, "y", e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-muted-foreground">Size (px): {p.size ?? "auto"}</label>
                        <input
                          type="range"
                          min="14"
                          max="80"
                          step="1"
                          value={p.size ?? getBubbleSize((byParish[p.name] || []).length)}
                          onChange={e => handlePositionChange(p.name, "size", e.target.value)}
                          className="w-full h-4 accent-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <Button onClick={savePositions} size="sm" className="flex-1 text-xs h-7" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                  <Button onClick={resetPositions} variant="outline" size="sm" className="flex-1 text-xs h-7" disabled={saving}>Reset</Button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <h3 className="font-heading text-sm font-bold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Registry Summary
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total bands</span>
                    <span className="font-semibold">{bands.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Active</span>
                    <span className="font-semibold text-green-600">{bands.filter(b => b.status === "active").length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Dissolved</span>
                    <span className="font-semibold text-red-500">{bands.filter(b => b.status === "dissolved").length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Unknown</span>
                    <span className="font-semibold text-gray-500">{bands.filter(b => b.status === "unknown" || !b.status).length}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Parishes covered</span>
                    <span className="font-semibold">{PARISHES.filter(p => (byParish[p.name] || []).length > 0).length}/10</span>
                  </div>
                </>
              )}
            </div>

            {/* Parish list */}
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
      </div>

      {/* QR / Share dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <QRCodePanel url={typeof window !== "undefined" ? window.location.origin + "/map" : ""} />
      </Dialog>

      {/* Parish dialog */}
      <Dialog open={!!selectedParish} onOpenChange={o => !o && setSelectedParish(null)}>
        {selectedParish && (
          <ParishPanel
            parish={selectedParish}
            bands={selectedBands}
            onClose={() => setSelectedParish(null)}
          />
        )}
      </Dialog>
    </div>
  );
}