import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FoodCard from "@/components/FoodCard";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

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
      <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-semibold mb-3 sm:mb-4 uppercase tracking-wider text-sm sm:text-base"
          >
            FAST FOOD RESTAURANT
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 sm:mb-6 leading-snug"
          >
            DELICIOUS FAST FOOD <br className="hidden sm:block" /> FOR TODAY
          </motion.h1>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-primary drop-shadow-lg">
              MILLETS
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-shadow"
              asChild
            >
              <Link to="/menu">Explore Menu</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-primary font-semibold mb-2 uppercase tracking-wider text-sm sm:text-base">
              OUR FAST FOOD
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
              OUR DELICIOUS FAST FOODS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-16 sm:mb-20">
            {categories.map((category, i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/menu/${category}`}
                  className="group text-center block"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-base sm:text-lg shadow-md group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {category}
                  </div>
                  <h3 className="font-medium sm:font-semibold group-hover:text-primary transition-colors text-sm sm:text-base">
                    {category}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Featured Food Items */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {featuredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <FoodCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image_url}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center mb-8 sm:mb-12">
            Latest Post
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md sm:max-w-xl mx-auto bg-white shadow-md rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Three steps how to make a special cup of tea!
            </h3>
            <Button variant="outline" className="w-full sm:w-auto">
              Read more
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
