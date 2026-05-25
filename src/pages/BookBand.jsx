import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const eventTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday Party" },
  { value: "corporate", label: "Corporate Event" },
  { value: "festival", label: "Festival" },
  { value: "private_party", label: "Private Party" },
  { value: "concert", label: "Concert" },
  { value: "other", label: "Other" },
];

export default function BookBand() {
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedBandId = urlParams.get("band") || "";
  const preselectedBandName = urlParams.get("band_name") || "";

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    band_id: preselectedBandId,
    band_name: preselectedBandName,
    client_name: "",
    client_email: "",
    client_phone: "",
    event_date: "",
    event_type: "",
    event_location: "",
    message: "",
    budget: "",
  });

  const { data: bands = [] } = useQuery({
    queryKey: ["bands-list"],
    queryFn: () => base44.entities.Band.list("name"),
  });

  const createBooking = useMutation({
    mutationFn: (data) => base44.entities.BookingRequest.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Booking request submitted!");
    },
  });

  const handleBandChange = (bandId) => {
    const selectedBand = bands.find((b) => b.id === bandId);
    setForm({ ...form, band_id: bandId, band_name: selectedBand?.name || "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking.mutate(form);
  };

  const updateField = (field, value) => setForm({ ...form, [field]: value });

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-4">Request Sent!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your booking request. We'll review it and get back to you within 24 hours.
          </p>
          <Button onClick={() => { setSubmitted(false); setForm({ band_id: "", band_name: "", client_name: "", client_email: "", client_phone: "", event_date: "", event_type: "", event_location: "", message: "", budget: "" }); }} variant="outline" className="rounded-xl">
            Submit Another Request
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CalendarCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wider uppercase">
                Booking Request
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Book a Band</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fill out the form below and we'll match you with the perfect band for your event.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8 space-y-6">
              <h3 className="font-heading text-lg font-semibold">Select a Band</h3>
              <Select value={form.band_id} onValueChange={handleBandChange}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Choose a band..." />
                </SelectTrigger>
                <SelectContent>
                  {bands.map((band) => (
                    <SelectItem key={band.id} value={band.id}>{band.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8 space-y-5">
              <h3 className="font-heading text-lg font-semibold">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.client_name} onChange={(e) => updateField("client_name", e.target.value)} required className="h-12 rounded-xl" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={form.client_email} onChange={(e) => updateField("client_email", e.target.value)} required className="h-12 rounded-xl" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.client_phone} onChange={(e) => updateField("client_phone", e.target.value)} className="h-12 rounded-xl" placeholder="+1 (809) ..." />
                </div>
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input value={form.budget} onChange={(e) => updateField("budget", e.target.value)} className="h-12 rounded-xl" placeholder="e.g. $500 - $1,000" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8 space-y-5">
              <h3 className="font-heading text-lg font-semibold">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Event Date *</Label>
                  <Input type="date" value={form.event_date} onChange={(e) => updateField("event_date", e.target.value)} required className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Event Type *</Label>
                  <Select value={form.event_type} onValueChange={(v) => updateField("event_type", v)}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Event Location</Label>
                <Input value={form.event_location} onChange={(e) => updateField("event_location", e.target.value)} className="h-12 rounded-xl" placeholder="Venue name or address" />
              </div>
              <div className="space-y-2">
                <Label>Additional Details</Label>
                <Textarea value={form.message} onChange={(e) => updateField("message", e.target.value)} className="rounded-xl min-h-[120px]" placeholder="Tell us about your event..." />
              </div>
            </div>

            <Button
              type="submit"
              disabled={createBooking.isPending}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 text-base font-semibold"
            >
              {createBooking.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Booking Request
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}