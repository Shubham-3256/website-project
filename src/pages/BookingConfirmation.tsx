import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const BookingConfirmation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          🎉 Booking Confirmed!
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-6">
          Thank you for your reservation. We look forward to serving you a
          delightful experience!
        </p>

        {/* CTA */}
        <Link
          to="/menu"
          className="inline-block w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg shadow hover:bg-primary/90 transition-colors"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
