import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FoodCard from "@/components/FoodCard";
import { supabase } from "@/lib/supabaseClient";

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .limit(4);

      if (error) {
        console.error("Error fetching featured items:", error);
      } else {
        setFeaturedItems(data || []);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        // unique category list
        const unique = Array.from(new Set(data.map((d) => d.category)));
        setCategories(unique);
      }
    };

    fetchFeaturedItems();
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wider">
            FAST FOOD RESTAURANT
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            DELICIOUS FAST FOOD
            <br />
            FOR TODAY
          </h1>
          <div className="flex justify-center mb-8">
            <div className="text-6xl md:text-8xl font-bold text-primary">
              MILLETS
            </div>
          </div>
          <Button
            className="restaurant-button-primary text-lg px-8 py-3"
            asChild
          >
            <Link to="/menu">Explore Menu</Link>
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold mb-2 uppercase tracking-wider">
              OUR FAST FOOD
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              OUR DELICIOUS FAST FOODS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/menu/${category}`}
                className="group text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
                  {category}
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>

          {/* Featured Food Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <FoodCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image_url}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts (still static for now) */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Latest Post
          </h2>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Three steps how to make a special cup of tea!
            </h3>
            <Button variant="outline">Read more</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
