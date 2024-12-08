import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tool, Utensils, Flame } from "lucide-react";
import { staggerContainer, fadeInUp } from "../utils/animations";

interface CategoryFiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = [
    { id: "all", name: "All", icon: ShoppingCart },
    { id: "Tools", name: "Tools", icon: Tool },
    { id: "Utensils", name: "Utensils", icon: Utensils },
    { id: "Cookware", name: "Cookware", icon: Flame },
  ];

  return (
    <motion.div
      className="flex flex-wrap gap-4 justify-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected =
          selectedCategory === null
            ? category.id === "all"
            : selectedCategory === category.name;

        return (
          <motion.button
            key={category.id}
            onClick={() =>
              setSelectedCategory(category.id === "all" ? null : category.name)
            }
            className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 
              ${
                isSelected
                  ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 
                          blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 text-lg">
              <Icon className="w-5 h-5" />
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};