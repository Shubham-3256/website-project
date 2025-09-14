import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import contactBg from "@/assets/veg-pasta.jpg"; // reuse a nice background or add a contact one

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("contacts").insert([formData]);

    if (error) {
      navigate(
        `/contact-confirmation?status=error&message=${encodeURIComponent(
          error.message
        )}`
      );
      return;
    }

    navigate("/contact-confirmation?status=success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Hero */}
      <section
        className="relative py-32 px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${contactBg})`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold drop-shadow-lg">
            Contact Us
          </h1>
          <p className="mt-4 text-lg opacity-90">
            We’d love to hear from you. Reach out for any queries or feedback.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Booking query, feedback, etc."
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="min-h-[150px] focus:ring-2 focus:ring-primary"
                placeholder="Type your message here..."
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 text-lg restaurant-button-primary"
            >
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
