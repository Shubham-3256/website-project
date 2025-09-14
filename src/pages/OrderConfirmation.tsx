import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="bg-card shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4 animate-bounce">
          🎉 Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. Your food will be delivered in ~30 minutes.
        </p>

        {state?.orderTotal && (
          <p className="text-2xl font-bold text-green-600 mb-6">
            Total Paid: ₹{state.orderTotal}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/menu">🍴 Back to Menu</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/my-orders">📦 View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
