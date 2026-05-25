import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
              <CalendarCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wider uppercase">
                Start Planning
              </span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl mx-auto leading-tight">
              Document the Music of
              <span className="text-primary"> Dominica</span>
            </h2>

            <p className="text-background/60 max-w-lg mx-auto mb-10 text-lg">
              Add bands to the database, explore them on the interactive parish map,
              or log field activities and research questions.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/band-editor">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 text-base font-semibold rounded-xl gap-2 group">
                  Add a Band
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/band-map">
                <Button size="lg" variant="outline" className="border-background/20 text-background hover:bg-background/10 px-8 h-14 text-base rounded-xl">
                  View Map
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}