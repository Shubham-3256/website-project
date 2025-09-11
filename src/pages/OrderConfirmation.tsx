import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background px-4">
      <h1 className="text-4xl font-bold text-primary mb-4">
        🎉 Order Confirmed!
      </h1>
      <p className="text-lg mb-6">
        Thank you for your order. Your food will be delivered in ~30 minutes.
      </p>
      {state?.orderTotal && (
        <p className="text-xl font-semibold mb-6">
          Total Paid: Rs. {state.orderTotal}
        </p>
      )}
      <Button asChild className="restaurant-button-primary">
        <Link to="/menu">Back to Menu</Link>
      </Button>
    </div>
  );
};

export default OrderConfirmation;
