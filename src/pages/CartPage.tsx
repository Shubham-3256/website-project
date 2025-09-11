import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Check login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate("/auth", { state: { from: "/cart" } }); // 👈 redirect if not logged in
        return;
      }
      setUser(data.user);
      fetchCart(data.user.id);
    };
    checkUser();
  }, [navigate]);

  const fetchCart = async (userId: string) => {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        id,
        quantity,
        menu_items (
          id,
          name,
          price,
          image_url
        )
      `
      )
      .eq("user_id", userId) // ✅ only current user's cart
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCartItems(data || []);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Failed to update quantity",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemove = async (id: string) => {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.menu_items.image_url}
                      alt={item.menu_items.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.menu_items.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Rs. {item.menu_items.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="font-bold text-primary">
                      Rs. {item.menu_items.price * item.quantity}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleCheckout} className="w-full">
              Checkout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
