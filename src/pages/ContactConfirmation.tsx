import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactConfirmation = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get("status") || "success";
  const message = params.get("message") || "";

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-card p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {isSuccess ? "Message Sent!" : "Message Failed"}
        </h2>
        <p className="text-muted-foreground mb-8">
          {isSuccess
            ? "Thanks for reaching out. We’ll get back to you soon."
            : message || "Something went wrong. Please try again."}
        </p>

        <div className="space-y-3">
          <Button className="restaurant-button-primary w-full" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          {!isSuccess && (
            <Button variant="outline" className="w-full" asChild>
              <Link to="/contact">Try Again</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactConfirmation;
