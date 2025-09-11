import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import FoodCard from "@/components/FoodCard";

const Menu = () => {
  const { category } = useParams();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      let query = supabase.from("menu_items").select("*");
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) console.error(error);
      else setItems(data || []);
    };

    fetchMenu();
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default Menu;
