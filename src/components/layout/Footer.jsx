import React from "react";
import { Link } from "react-router-dom";
import { Music, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading text-xl font-bold">Richards Music</span>
                <span className="block text-[10px] uppercase tracking-[0.25em] opacity-60">Commonwealth of Dominica</span>
              </div>
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-sm">
              Documenting and celebrating the rich musical heritage of the Commonwealth of Dominica —
              from jing ping and bélé to steelband and bouyon across all ten parishes.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Questionnaire", path: "/questionnaire" },
                { label: "About", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm opacity-60">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>1-767-275-4587</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-60">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>210-386-0779</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-60">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>francis.richards2011@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-60">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Roseau, Commonwealth of Dominica</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center space-y-2">
          <p className="text-xs opacity-40">
            © {new Date().getFullYear()} Richards Music. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}