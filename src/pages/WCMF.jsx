import React, { useState, useMemo, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Music, Star, X, ChevronLeft, ChevronRight, Pencil, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const WCMF_POSTERS = {
  1997: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/6ff12dd7c_1-WCMF-1997.jpg",
  1998: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/d67454464_2-WCMF-1998.jpg",
  1999: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/8e36108c7_3-WCMF-1999.jpg",
  2000: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/cf53cc966_4-WCMF-2000.jpg",
  2001: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/c48fa3879_5-WCMF-2001.jpg",
  2002: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/75cae9421_6-WCMF2002PottersvilleSavannah.jpg",
  2003: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/13d9d2d83_7-WCMF-2003.jpg",
  2004: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/e7aaaf401_8-WCMF2004PottersvilleSavannah.jpg",
  2005: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/3d252e75c_9-WCMF2005.jpg",
  2006: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/af293a45f_10-WCMF2006-PottersvilleSavannah.jpg",
  2007: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/beada286e_11-WCMF2007Stadium.jpg",
  2008: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/03585587a_12-WCMF2008.jpg",
  2009: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/7a18e86d8_13-WCMF2009.jpg",
  2010: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/287fdfa5a_14-WCMF-2010.jpg",
  2011: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/86d143d17_15-WCMF2011.jpg",
  2012: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/ddf65b369_16-WCMF2012.jpg",
  2013: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/8015e7d12_17-2013-WCMF.jpg",
  2014: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/a16ac34bd_18-2014-WCMF.jpg",
  2015: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/c09fe08a2_18-2015.jpg",
  2016: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/499ca8b59_19-WCMF2016.jpg",
  2017: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/b631f89e5_20-2017WCMF.jpg",
  2018: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/e7bc3bf17_20-WCMF2018.jpg",
  2019: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/449c5a390_21-WCMF-2019.jpg",
  2020: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/19cf2ee04_22-1-WCMFCancelled.jpg",
  2021: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/02c9974d8_22-2021-WCMFCancelled.jpg",
  2022: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/64f3e8db3_generated_image.png",
  2023: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/9ab98e92e_generated_image.png",
  2024: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/5009a05fc_generated_image.png",
  2025: "https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/7e31aa221_25-2025-1WCMF.jpg"
};

const POSTER_YEARS = Object.keys(WCMF_POSTERS).map(Number).sort((a, b) => a - b);

function PosterLightbox({ year, onClose, onPrev, onNext, posterOverrides = {} }) {
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={isFullscreen ? undefined : onClose}
      >
        <button
          onClick={isFullscreen ? toggleFullscreen : onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10"
          title={isFullscreen ? "Exit fullscreen" : "Close"}
        >
          <X className="w-6 h-6" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10 text-xs font-semibold"
          title="Fullscreen"
        >
          ⛶
        </button>
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 rounded-full p-2 z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <motion.div
          key={year}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={posterOverrides[year] || WCMF_POSTERS[year]}
            alt={`WCMF ${year} Poster`}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-semibold px-4 py-1 rounded-full">
            WCMF {year}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function WCMF() {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [lightboxYear, setLightboxYear] = useState(null);
  const [uploadingYear, setUploadingYear] = useState(null);
  const [posterOverrides, setPosterOverrides] = useState({});

  const { data: festivals = [], isLoading } = useQuery({
    queryKey: ["wcmf-public"],
    queryFn: () => base44.entities.Festival.list("-year"),
    onSuccess: (data) => {
      // Seed overrides from DB poster_urls
      const overrides = {};
      data.forEach(f => {
        const yr = Math.floor(f.year);
        if (f.poster_url && f.poster_url !== WCMF_POSTERS[yr]) {
          overrides[yr] = f.poster_url;
        }
      });
      setPosterOverrides(overrides);
    }
  });

  // Also sync posterOverrides when festivals data changes
  React.useEffect(() => {
    if (!festivals.length) return;
    const overrides = {};
    festivals.forEach(f => {
      const yr = Math.floor(f.year);
      if (f.poster_url) overrides[yr] = f.poster_url;
    });
    setPosterOverrides(overrides);
  }, [festivals]);

  const years = useMemo(() => {
    const ys = [...new Set(festivals.map(f => f.year))].sort((a, b) => b - a);
    return ys;
  }, [festivals]);

  const filtered = useMemo(() => {
    return festivals.filter(f => {
      const yearMatch = selectedYear === "all" || Math.floor(f.year) === parseInt(selectedYear);
      const searchMatch = !search ||
        f.festival_name?.toLowerCase().includes(search.toLowerCase()) ||
        f.lineup?.toLowerCase().includes(search.toLowerCase()) ||
        String(Math.floor(f.year)).includes(search);
      return yearMatch && searchMatch;
    });
  }, [festivals, selectedYear, search]);

  const lightboxIndex = lightboxYear ? POSTER_YEARS.indexOf(lightboxYear) : -1;
  const handlePrev = () => {
    if (lightboxIndex > 0) setLightboxYear(POSTER_YEARS[lightboxIndex - 1]);
  };
  const handleNext = () => {
    if (lightboxIndex < POSTER_YEARS.length - 1) setLightboxYear(POSTER_YEARS[lightboxIndex + 1]);
  };

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            Festival Archive
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">
            World Creole Music Festival
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Historical lineup and performance records from the World Creole Music Festival, Dominica, 1997–2025.
          </p>
        </motion.div>

        {/* Poster Thumbnail Grid */}
        <div className="mb-10">
          <h2 className="font-heading text-lg font-semibold mb-4">Official Posters</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
            {POSTER_YEARS.map(year => (
              <div key={year} className="group relative rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-sm aspect-[3/4]">
                <button
                  onClick={() => setLightboxYear(year)}
                  className="w-full h-full"
                  title={`WCMF ${year}`}
                >
                  <img
                    src={posterOverrides[year] || WCMF_POSTERS[year]}
                    alt={`WCMF ${year}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[11px] font-bold text-white bg-black/50 py-0.5">
                    {year}
                  </span>
                </button>
                {/* Edit/upload button */}
                <button
                  onClick={e => { e.stopPropagation(); document.getElementById(`poster-upload-${year}`).click(); }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-primary text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title={`Replace ${year} poster`}
                >
                  {uploadingYear === year ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                </button>
                <input
                  id={`poster-upload-${year}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploadingYear(year);
                    const { file_url } = await base44.integrations.Core.UploadFile({ file });
                    // Update all festival records for this year
                    const toUpdate = festivals.filter(f => Math.floor(f.year) === year);
                    await Promise.all(toUpdate.map(f => base44.entities.Festival.update(f.id, { poster_url: file_url })));
                    setPosterOverrides(prev => ({ ...prev, [year]: file_url }));
                    setUploadingYear(null);
                    e.target.value = "";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search artists, bands, year…"
            className="pl-9 h-11 rounded-xl"
          />
        </div>

        {/* Year filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedYear("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selectedYear === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
            }`}
          >
            All Years
          </button>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(String(y))}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedYear === String(y)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Festival cards */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>{search ? "No results match your search." : "No festival records found."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground pb-1">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
            {filtered.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {(f.poster_url || WCMF_POSTERS[Math.floor(f.year)]) && (
                      <button
                        onClick={() => setLightboxYear(Math.floor(f.year))}
                        className="flex-shrink-0 w-16 rounded-lg overflow-hidden border border-border hover:border-primary transition-all shadow-sm"
                      >
                        <img
                          src={f.poster_url || WCMF_POSTERS[Math.floor(f.year)]}
                          alt={`${f.year} poster`}
                          className="w-full h-auto object-cover"
                        />
                      </button>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-heading font-bold text-lg leading-tight">{f.year}</p>
                          <p className="text-sm text-muted-foreground">{f.festival_name}</p>
                          {f.stage_number && f.stage_number !== 0 && (
                            <span className="text-xs text-primary font-medium">Night {f.stage_number}</span>
                          )}
                        </div>
                        <a href={`/admin/festivals?id=${f.id}`} target="_blank" rel="noopener noreferrer" title="Edit this record"
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                          <Pencil className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {f.lineup && (
                        <p className="mt-2 text-sm text-foreground/80 leading-relaxed whitespace-pre-line border-t border-border/40 pt-2">
                          {f.lineup}
                        </p>
                      )}
                      {f.description && (
                        <p className="mt-2 text-xs text-muted-foreground">{f.description}</p>
                      )}
                      {f.notes && (
                        <p className="mt-1 text-xs text-muted-foreground italic">{f.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxYear && (
        <PosterLightbox
          year={lightboxYear}
          onClose={() => setLightboxYear(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          posterOverrides={posterOverrides}
        />
      )}
    </div>
  );
}