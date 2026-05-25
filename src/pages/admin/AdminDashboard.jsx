import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, CalendarCheck, Clock, CheckCircle2, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: bands = [] } = useQuery({
    queryKey: ["admin-bands"],
    queryFn: () => base44.entities.Band.list(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => base44.entities.BookingRequest.list("-created_date"),
  });

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  const stats = [
    { label: "Total Bands", value: bands.length, icon: Music, color: "text-primary" },
    { label: "Total Bookings", value: bookings.length, icon: CalendarCheck, color: "text-blue-500" },
    { label: "Pending", value: pendingBookings.length, icon: Clock, color: "text-amber-500" },
    { label: "Confirmed", value: confirmedBookings.length, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-heading text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Recent Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No booking requests yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <p className="font-medium">{booking.client_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.band_name} · {booking.event_type?.replace(/_/g, " ")} · {booking.event_date}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      booking.status === "confirmed" ? "border-green-500/30 text-green-600" :
                      booking.status === "pending" ? "border-amber-500/30 text-amber-600" :
                      booking.status === "declined" ? "border-red-500/30 text-red-600" :
                      "border-border"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credits */}
      <Card className="mt-8 border-primary/20 bg-accent/30">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2 text-lg">
            <Heart className="w-4 h-4 text-secondary" />
            Project Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Research & Documentation</p>
              <p className="text-muted-foreground">Francis Richards</p>
              <p className="text-xs text-muted-foreground mt-0.5">Principal Researcher · Roseau, Commonwealth of Dominica</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Contact</p>
              <p className="text-muted-foreground">francis.richards2011@gmail.com</p>
              <p className="text-xs text-muted-foreground mt-0.5">1-767-275-4587 · 210-386-0779</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Scope</p>
              <p className="text-muted-foreground">Musical bands of the Commonwealth of Dominica, 1930s–2000s. Covers all ten parishes and diaspora communities.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Methodology</p>
              <p className="text-muted-foreground">Oral histories, archival research, field recordings, community interviews, and participant testimony.</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Richards Music Archive · All rights reserved · Dominica Music Archives Project
          </div>
        </CardContent>
      </Card>
    </div>
  );
}