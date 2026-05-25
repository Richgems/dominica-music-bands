import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import QRCodePanel from "@/components/map/QRCodePanel";
import { Dialog } from "@/components/ui/dialog";

const adminLinks = [
  { label: "Home", path: "/" },
  { label: "Bands", path: "/bands" },
  { label: "Band Map", path: "/band-map" },
  { label: "WCMF", path: "/wcmf" },
  { label: "Band Editor", path: "/band-editor" },
  { label: "Fieldwork", path: "/fieldwork" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const mapUrl = typeof window !== "undefined" ? window.location.origin + "/map" : "";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-background/95 backdrop-blur-xl border-b border-border/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src="https://media.base44.com/images/public/6a05fd8a195c73dd9ac99e06/2026ff286_ProjectLogo-png.png"
                alt="Logo"
                className="w-8 h-8 group-hover:scale-110 transition-transform"
              />
              <div>
                <span className="font-heading text-base font-bold tracking-tight">Richards</span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-primary font-semibold -mt-0.5">
                  Admin
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setShowQR(true)}
                className="ml-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <ExternalLink className="w-3 h-3" />
                Share
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border"
            >
              <div className="px-6 py-4 space-y-1">
                {adminLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => { setShowQR(true); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-primary bg-primary/10 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Share Map
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* QR Share dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <QRCodePanel url={mapUrl} />
      </Dialog>
    </>
  );
}