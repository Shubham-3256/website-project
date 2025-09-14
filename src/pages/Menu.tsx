import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import FoodCard from "@/components/FoodCard";

const Menu = () => {
  const { category } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      let query = supabase.from("menu_items").select("*");
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) console.error(error);
      else setItems(data || []);
      setLoading(false);
    };

    fetchMenu();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600 text-lg">
            No items found in this category.
          </p>
        </div>
      ) : (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <FoodCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image_url}
                description={item.description}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Menu;
