// src/components/Explore.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaSearch, FaTimes } from "react-icons/fa";
import type { Recipe } from "../types";

interface ExploreProps {
  recipes?: Recipe[];
  onBack: () => void;
}

const Explore: React.FC<ExploreProps> = ({ recipes = [], onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Ensure recipes is an array and filter public recipes
  const publicRecipes = recipes.filter((recipe) => recipe.isPublic);

  // Filter recipes based on search query, handling undefined fields
  const filteredRecipes = publicRecipes.filter((recipe) => {
    const titleMatch = recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const descriptionMatch = recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    return titleMatch || descriptionMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <div className="relative backdrop-blur-lg bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl blur-xl" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              Explore Recipes
            </span>
          </h2>

          {/* Search Bar */}
          <div className="relative group mb-8">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 
                group-hover:text-violet-400 transition-colors duration-300"
            />
            <input
              type="search"
              placeholder="Search public recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-full
                focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300
                backdrop-blur-sm text-gray-100 placeholder-gray-400
                group-hover:border-violet-500/50"
            />
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl 
                      transform group-hover:scale-105 transition-transform duration-300"
                  />

                  <div
                    className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden"
                  >
                    {recipe.image && (
                      <div className="relative h-48">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-violet-400 mb-2">
                        {recipe.title}
                      </h3>

                      <p className="text-gray-300 mb-4">{recipe.description}</p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-full font-medium flex items-center gap-2
                            bg-violet-500 text-gray-900
                            transition-colors duration-300"
                        >
                          <FaHeart /> Like
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <p className="text-xl text-gray-300 mb-6">
                No public recipes found. Try adjusting your search.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mt-6 w-full py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold
          flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors duration-300"
      >
        <FaTimes /> Back to Menu
      </motion.button>
    </div>
  );
};

export default Explore;
