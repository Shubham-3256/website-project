import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Failed to load orders",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setOrders(data || []);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="text-lg">You haven’t placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card shadow-md rounded-xl p-6 border border-border hover:shadow-lg transition"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Order Info */}
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Total:</strong>{" "}
                    <span className="font-semibold text-lg">
                      ₹{order.total}
                    </span>
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod}
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

export default MyOrders;
