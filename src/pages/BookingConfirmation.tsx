import React from "react";
import { Link } from "react-router-dom";

const BookingConfirmation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        🎉 Booking Confirmed!
      </h1>
      <p className="text-lg mb-6">
        Thank you for your reservation. We look forward to seeing you!
      </p>
      <Link
        to="/menu"
        className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
      >
        Back to Menu
      </Link>
    </div>
  );
};

export default BookingConfirmation;
