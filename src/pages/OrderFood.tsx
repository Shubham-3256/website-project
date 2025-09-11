import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const OrderFood = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setItem(data);
      }
    };

    if (itemId) fetchItem();
  }, [itemId]);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    if (!item) return;

    const { error } = await supabase.from("cart").insert([
      {
        item_id: item.id,
        quantity,
      },
    ]);

    if (error) {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Added to cart",
        description: `${item.name} x${quantity} added.`,
      });
    }
  };

  const handleOrderNow = () => {
    navigate("/checkout", { state: { directOrder: { item, quantity } } });
  };

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Food item not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="hero-section py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
          {item.name}
        </h1>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={item.image_url}
              alt={item.name}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          <div className="space-y-6">
            <p className="text-muted-foreground mb-6">{item.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-primary">
                Rs. {item.price}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                className="w-12 h-12 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="w-12 h-12 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleOrderNow}
                className="restaurant-button-primary flex-1"
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderFood;
