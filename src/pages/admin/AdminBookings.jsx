import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Mail, Phone, MapPin, DollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  pending: { label: "Pending", className: "border-amber-500/30 text-amber-600 bg-amber-50" },
  confirmed: { label: "Confirmed", className: "border-green-500/30 text-green-600 bg-green-50" },
  declined: { label: "Declined", className: "border-red-500/30 text-red-600 bg-red-50" },
  completed: { label: "Completed", className: "border-blue-500/30 text-blue-600 bg-blue-50" },
};

export default function AdminBookings() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => base44.entities.BookingRequest.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BookingRequest.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }); toast.success("Status updated!"); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BookingRequest.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }); toast.success("Booking deleted."); },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Booking Requests</h1>

      {bookings.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No booking requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const sc = statusConfig[booking.status || "pending"];
            return (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold">{booking.client_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Band: <span className="font-medium text-foreground">{booking.band_name}</span>
                        {" · "}
                        <span className="capitalize">{booking.event_type?.replace(/_/g, " ")}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select
                        value={booking.status || "pending"}
                        onValueChange={(v) => updateMutation.mutate({ id: booking.id, data: { status: v } })}
                      >
                        <SelectTrigger className="w-36 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(booking.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {booking.event_date}
                    </div>
                    {booking.client_email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        {booking.client_email}
                      </div>
                    )}
                    {booking.client_phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        {booking.client_phone}
                      </div>
                    )}
                    {booking.event_location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {booking.event_location}
                      </div>
                    )}
                  </div>

                  {booking.message && (
                    <p className="text-sm text-muted-foreground mt-4 p-3 rounded-lg bg-muted/50">
                      {booking.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}