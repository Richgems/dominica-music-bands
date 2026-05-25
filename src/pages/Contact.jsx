import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const CONTACT_TYPES = [
  { value: "data_correction", label: "Data Correction" },
  { value: "data_addition", label: "Add Missing Band/Info" },
  { value: "photo_audio", label: "Photo or Audio Submission" },
  { value: "enquiry", label: "Research Enquiry" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "data_correction",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke("contactFormHandler", data),
    onSuccess: () => {
      toast.success("Message sent! Thank you for your contribution.");
      setFormData({ name: "", email: "", phone: "", subject: "", type: "data_correction", message: "" });
    },
    onError: (err) => {
      toast.error("Failed to send message. Please try again or email directly.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    contactMutation.mutate(formData);
  };

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            Get in Touch
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Submit corrections, add missing bands, share photos, or ask research questions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border/60 p-8"
          >
            <h2 className="font-heading text-xl font-bold mb-6">Submit Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="h-10"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="h-10"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone (optional)</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Type of Submission *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {CONTACT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Subject (optional)</label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Steel Drums Band Update"
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the band, correction, or submission…"
                  className="h-32 resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full gap-2 h-10"
              >
                <Send className="w-4 h-4" />
                {contactMutation.isPending ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card border border-border/60 p-8">
              <div className="mb-6">
                <h2 className="font-heading text-xl font-bold mb-1">Francis Richards</h2>
                <p className="text-sm text-muted-foreground">Researcher & Author</p>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:francis.richards2011@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                    <p className="font-medium group-hover:text-primary transition-colors text-sm">
                      francis.richards2011@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+17672754587"
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Dominica</p>
                    <p className="font-medium group-hover:text-primary transition-colors text-sm">1-767-275-4587</p>
                  </div>
                </a>

                <a
                  href="tel:+12103860779"
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">USA</p>
                    <p className="font-medium group-hover:text-primary transition-colors text-sm">210-386-0779</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-medium text-sm">Commonwealth of Dominica</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>All submissions are reviewed carefully.</strong> We'll respond via email with any clarifications needed. Thank you for helping preserve Dominican music heritage!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}