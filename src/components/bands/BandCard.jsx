import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const genreLabels = {
  merengue: "Merengue",
  bachata: "Bachata",
  salsa: "Salsa",
  dembow: "Dembow",
  reggaeton: "Reggaeton",
  son: "Son",
  jazz: "Jazz",
  rock: "Rock",
  fusion: "Fusion",
  traditional: "Traditional",
};

export default function BandCard({ band, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/bands/${band.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
          <div className="aspect-[4/3] overflow-hidden">
            {band.image_url ? (
              <img
                src={band.image_url}
                alt={band.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Users className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {band.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider">
                Featured
              </Badge>
            )}

            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-heading text-xl font-bold text-white mb-1">{band.name}</h3>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/15 text-white border-0 backdrop-blur-sm text-xs">
                  {genreLabels[band.genre] || band.genre}
                </Badge>
                {band.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs text-white/80 font-medium">{band.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {band.description || "An amazing Dominican band ready to make your event unforgettable."}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {band.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {band.location}
                  </span>
                )}
                {band.members_count && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {band.members_count} members
                  </span>
                )}
              </div>
              {band.price_range && (
                <span className="text-sm font-semibold text-primary">{band.price_range}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}