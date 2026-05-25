import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, MapPin, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            About This Study
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            History of Music & Bands<br />in the Commonwealth of Dominica
          </h1>
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-widest font-medium">1930s – 2000s</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 space-y-6 text-lg text-foreground/80 leading-relaxed"
        >
          <p>
            This study documents the full history of musical bands in the Commonwealth of Dominica
            from the 1930s to the 2000s — the first comprehensive ethnomusicological treatment of
            its kind. It covers bands across twelve parishes and the Dominican diaspora, documenting
            their formation, musical traditions, key personnel, cultural context, and, where
            applicable, the reasons for their dissolution.
          </p>
          <p>
            The chapter in the study moves from the colonial brass band era through calypso, the
            dance band generation, cadence-lypso, the structural collapse of the 1980s, the
            emergence of bouyon, and the digital era. It draws on oral history, archival sources,
            documentary records, journalistic testimony, and the author's own direct experience as
            a lifelong participant in Dominican musical life.
          </p>
          <p>
            The author wishes to acknowledge the musicians, bandsmen, cultural officers, historians,
            and community members whose knowledge, memories, and generosity made this work possible.
            Any errors or omissions are the author's own.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: BookOpen, title: "Oral History", desc: "Drawing on interviews with musicians, bandsmen, and cultural officers across Dominica and the diaspora." },
            { icon: MapPin, title: "All Parishes", desc: "Coverage across all ten parishes of the Commonwealth of Dominica and beyond." },
            { icon: Music, title: "Seven Decades", desc: "From the 1930s colonial brass band era through to the digital music age of the 2000s." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-6">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-heading font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center rounded-3xl bg-primary/5 border border-primary/10 p-12"
        >
          <h2 className="font-heading text-3xl font-bold mb-4">Contribute to the Research</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Have memories, photographs, recordings, or documents related to Dominican bands? We welcome contributions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/questionnaire">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 rounded-xl gap-2 group">
                Submit Information
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="px-8 rounded-xl">
                Contact the Author
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}