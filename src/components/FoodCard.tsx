import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  description,
}) => {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const { error } = await supabase.from("cart").insert([
      {
        item_id: id,
        quantity: 1,
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
        description: `${name} added to your cart.`,
      });
    }
  };

  return (
    <div className="food-card group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary">Rs. {price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {originalPrice}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-lg mb-2">{name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="restaurant-button-primary flex-1" asChild>
            <Link to={`/order/${id}`}>View Details</Link>
          </Button>
          <Button
            variant="outline"
            className="restaurant-button-secondary"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
