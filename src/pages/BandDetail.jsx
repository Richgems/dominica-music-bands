import React from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, ArrowLeft, CalendarCheck, Phone, Mail, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const genreLabels = {
  merengue: "Merengue", bachata: "Bachata", salsa: "Salsa", dembow: "Dembow",
  reggaeton: "Reggaeton", son: "Son", jazz: "Jazz", rock: "Rock",
  fusion: "Fusion", traditional: "Traditional",
};

export default function BandDetail() {
  const { id } = useParams();

  const { data: band, isLoading } = useQuery({
    queryKey: ["band", id],
    queryFn: () => base44.entities.Band.get(id),
  });

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl mb-8" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!band) {
    return (
      <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Band not found</h2>
          <Link to="/bands">
            <Button variant="outline">Back to Bands</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link
            to="/bands"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bands
          </Link>

          {band.image_url && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10">
              <img src={band.image_url} alt={band.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {genreLabels[band.genre] || band.genre}
                </Badge>
                {band.available && (
                  <Badge variant="outline" className="border-green-500/30 text-green-600">
                    Available
                  </Badge>
                )}
                {band.featured && (
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                )}
              </div>

              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{band.name}</h1>

              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {band.description || "An amazing Dominican band ready to elevate your event with authentic Caribbean music and energy."}
              </p>

              {band.sample_songs?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading text-xl font-bold mb-4">Sample Tracks</h3>
                  <div className="space-y-3">
                    {band.sample_songs.map((song, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{i + 1}</span>
                        </div>
                        <span className="font-medium">{song.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-5">
                <h3 className="font-heading text-lg font-bold">Details</h3>

                {band.rating && (
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-medium">{band.rating} / 5 Rating</span>
                  </div>
                )}
                {band.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{band.location}</span>
                  </div>
                )}
                {band.members_count && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{band.members_count} members</span>
                  </div>
                )}
                {band.price_range && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{band.price_range}</span>
                  </div>
                )}
                {band.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{band.phone}</span>
                  </div>
                )}
                {band.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{band.email}</span>
                  </div>
                )}
              </div>


            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}