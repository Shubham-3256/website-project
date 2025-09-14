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

  // 👇 reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // fetch item
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

  // fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: false });

      if (!error) setReviews(data || []);
    };
    if (itemId) fetchReviews();
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

  // 👇 submit review
  const handlePostReview = async () => {
    if (!name || !message) {
      toast({ title: "Name and message are required" });
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        item_id: itemId,
        name,
        email,
        message,
      },
    ]);

    if (error) {
      toast({
        title: "Failed to post review",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Review added" });
      setReviews([
        { name, email, message, created_at: new Date().toISOString() },
        ...reviews,
      ]);
      setName("");
      setEmail("");
      setMessage("");
    }
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
      {/* Item Details */}
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

      {/* 👇 Customer Reviews Section */}
      {/* 👇 Customer Reviews Section */}
      <section className="py-20 px-4 bg-[#fdf8f4]">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <h2 className="text-5xl font-extrabold text-center text-orange-600 mb-16">
            Customer Review
          </h2>

          {/* Review List */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {reviews.length === 0 ? (
              <p className="text-center col-span-2 text-gray-500">
                No reviews yet. Be the first!
              </p>
            ) : (
              reviews.map((rev, i) => (
                <div
                  key={i}
                  className="bg-orange-50 rounded-xl shadow-md p-6 flex flex-col gap-3"
                >
                  {/* Profile + Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-lg">
                      {rev.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {rev.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 leading-relaxed">{rev.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-white shadow-lg rounded-xl p-10">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">
              Add a review
            </h3>

            <div className="space-y-6">
              {/* Message */}
              <Textarea
                placeholder="Write a Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-orange-400"
              />

              {/* Name & Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-lg p-4 focus:ring-2 focus:ring-orange-400"
                />
                <Input
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-lg p-4 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handlePostReview}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Post Review
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderFood;
