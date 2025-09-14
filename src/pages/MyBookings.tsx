import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Failed to load bookings",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setBookings(data || []);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-10">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="text-lg">You don’t have any bookings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card shadow-md rounded-xl p-6 border border-border hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{booking.name}</h2>
                  <span className="text-xs text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Date:</strong> {booking.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {booking.time}
                  </p>
                  <p>
                    <strong>Guests:</strong>{" "}
                    <span className="font-medium">{booking.guests}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
