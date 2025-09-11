import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    deliveryMethod: "Delivery",
    paymentMethod: "COD",
    specialInstructions: "",
  });

  // Load cart or direct order
  useEffect(() => {
    if (state?.directOrder) {
      setCartItems([
        { ...state.directOrder.item, quantity: state.directOrder.quantity },
      ]);
    } else {
      fetchCart();
    }
  }, [state]);

  const fetchCart = async () => {
    const { data, error } = await supabase.from("cart").select(`
        id,
        quantity,
        menu_items (
          id,
          name,
          price,
          image_url
        )
      `);
    if (!error && data) {
      setCartItems(
        data.map((c: any) => ({
          ...c.menu_items,
          quantity: c.quantity,
        }))
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems = cartItems.map((item) => ({
      item_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const { error } = await supabase.from("orders").insert([
      {
        ...formData,
        items: orderItems, // JSON column recommended in Supabase
        total,
        status: formData.paymentMethod === "COD" ? "pending" : "paid",
      },
    ]);

    if (error) {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (!state?.directOrder) {
      await supabase.from("cart").delete().neq("id", 0);
    }

    navigate("/order-confirmation", { state: { orderTotal: total } });
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="email">Email (for receipt)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pincode">Pin Code</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="deliveryMethod">Delivery Method</Label>
              <select
                id="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryMethod: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="Delivery">Home Delivery</option>
                <option value="Takeaway">Takeaway</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {["COD", "Card", "UPI", "NetBanking", "Wallet"].map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={
                    formData.paymentMethod === method ? "default" : "outline"
                  }
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: method })
                  }
                >
                  {method === "COD" ? "Cash on Delivery" : method}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="specialInstructions">
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Eg: No onions, ring the doorbell once"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-card p-4 rounded-lg shadow-sm space-y-2">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                Rs.{" "}
                {cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full text-lg py-3">
            Confirm Order
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
