import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // ✅ Check login and fetch cart
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate("/auth", { state: { from: "/cart" } });
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
      .eq("user_id", userId)
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

  // ✅ Total calculation
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.menu_items.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-muted-foreground mt-6">
            Your cart is empty. Start adding delicious dishes!
          </p>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  {/* Left side - Image + Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.menu_items.image_url}
                      alt={item.menu_items.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {item.menu_items.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Rs. {item.menu_items.price}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
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

                    {/* Price */}
                    <p className="font-bold text-primary">
                      Rs. {item.menu_items.price * item.quantity}
                    </p>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary + Checkout */}
            <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-lg font-medium">
                Total:{" "}
                <span className="text-2xl font-bold text-primary">
                  Rs. {cartTotal}
                </span>
              </p>
              <Button onClick={handleCheckout} className="px-10 py-3 text-lg">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
