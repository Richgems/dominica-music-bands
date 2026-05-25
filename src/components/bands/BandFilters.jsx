import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const genres = [
  { value: "all", label: "All Genres" },
  { value: "merengue", label: "Merengue" },
  { value: "bachata", label: "Bachata" },
  { value: "salsa", label: "Salsa" },
  { value: "dembow", label: "Dembow" },
  { value: "reggaeton", label: "Reggaeton" },
  { value: "son", label: "Son" },
  { value: "jazz", label: "Jazz" },
  { value: "rock", label: "Rock" },
  { value: "fusion", label: "Fusion" },
  { value: "traditional", label: "Traditional" },
];

export default function BandFilters({ search, setSearch, genre, setGenre }) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search bands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12 rounded-xl bg-card border-border/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <Button
            key={g.value}
            variant={genre === g.value ? "default" : "outline"}
            size="sm"
            className={`rounded-full text-xs ${
              genre === g.value ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => setGenre(g.value)}
          >
            {g.label}
          </Button>
        ))}
      </div>
    </div>
  );
}