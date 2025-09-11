import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import restaurantImage from "@/assets/veg-pasta.jpg";

const BookingPage = () => {
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occasion: "",
    tablePreference: "",
    confirmationMethod: "email",
    specialRequests: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGuestChange = (change: number) => {
    setGuests(Math.max(1, guests + change));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests,
        date: selectedDate,
        time: selectedTime,
        occasion: formData.occasion, // if you added extra fields
        table_preference: formData.tablePreference,
        special_requests: formData.specialRequests,
        status: "pending",
      },
    ]);

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Table Booked Successfully!",
      description: `Your table for ${guests} guests on ${selectedDate} at ${selectedTime} is confirmed.`,
    });
    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative py-32 px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${restaurantImage})`,
        }}
      >
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Booking</h1>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleBookingSubmit}
            className="bg-card p-8 rounded-lg shadow-lg space-y-8"
          >
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Date, Time, Guests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Guests</Label>
                <div className="flex items-center gap-4 py-3">
                  <Button type="button" onClick={() => handleGuestChange(-1)}>
                    -
                  </Button>
                  <span>{guests}</span>
                  <Button type="button" onClick={() => handleGuestChange(1)}>
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Occasion & Table Preference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  id="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  placeholder="Birthday, Anniversary, Business Meeting..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tablePreference">Table Preference</Label>
                <Input
                  id="tablePreference"
                  value={formData.tablePreference}
                  onChange={handleInputChange}
                  placeholder="Indoor, Outdoor, Window seat..."
                />
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any dietary restrictions, celebration notes, etc."
              />
            </div>

            {/* Confirmation Method */}
            <div className="space-y-2">
              <Label>Preferred Confirmation</Label>
              <Select
                value={formData.confirmationMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, confirmationMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="restaurant-button-primary px-12 py-3 text-lg"
              >
                Book a table now
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
