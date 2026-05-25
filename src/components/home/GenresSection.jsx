import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const genres = [
  { id: "jing_ping", label: "Jing Ping", emoji: "🪗", desc: "The national music of Dominica" },
  { id: "bélé", label: "Bélé", emoji: "🥁", desc: "African-rooted ceremonial dance music" },
  { id: "steelband", label: "Steel Band", emoji: "🎶", desc: "Pan percussion tradition" },
  { id: "bouyon", label: "Bouyon", emoji: "🔊", desc: "Modern energetic Dominican fusion" },
  { id: "quadrille", label: "Quadrille", emoji: "💃", desc: "European-Caribbean folk dance" },
  { id: "cadence_lypso", label: "Cadence-lypso", emoji: "✨", desc: "Dominica's Caribbean pop sound" },
];

export default function GenresSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            Genres
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Musical Traditions of Dominica
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From ancient Kalinago-influenced rhythms to vibrant modern bouyon — explore
            the diverse musical heritage of the Commonwealth of Dominica.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {genres.map((genre, i) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/band-map?type=${genre.id}`}
                className="group block p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <span className="text-3xl md:text-4xl mb-4 block">{genre.emoji}</span>
                <h3 className="font-heading text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {genre.label}
                </h3>
                <p className="text-sm text-muted-foreground">{genre.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}