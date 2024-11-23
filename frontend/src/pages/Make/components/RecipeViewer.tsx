// src/components/RecipeViewer.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimes, FaUtensils, FaClock, FaUsers, FaHeart, FaShareAlt,
} from "react-icons/fa";
import type { Recipe } from "../types";
import ShareModal from "./ShareModal";

interface RecipeViewerProps {
  recipes: Recipe[];
  onBack: () => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onUpdateRecipe: (updatedRecipe: Recipe) => void;
}

const RecipeViewer: React.FC<RecipeViewerProps> = ({
  recipes, onBack, onDelete, onToggleFavorite, onUpdateRecipe,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsShareModalOpen(true);
  };

  const handleShare = (updatedRecipe: Recipe) => {
    onUpdateRecipe(updatedRecipe);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <div className="relative backdrop-blur-lg bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-2xl blur-xl" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">
              Your Recipes
            </span>
          </h2>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl blur-xl
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
                      <h3 className="text-2xl font-bold text-pink-400 mb-2">
                        {recipe.title}
                      </h3>

                      <p className="text-gray-300 mb-4">{recipe.description}</p>

                      <div className="flex items-center gap-6 mb-4 text-sm text-gray-400">
                        {recipe.cookTime && (
                          <div className="flex items-center gap-2">
                            <FaClock />
                            <span>{recipe.cookTime}</span>
                          </div>
                        )}
                        {recipe.difficulty && (
                          <div className="flex items-center gap-2">
                            <FaUtensils />
                            <span>{recipe.difficulty}</span>
                          </div>
                        )}
                        {recipe.servings && (
                          <div className="flex items-center gap-2">
                            <FaUsers />
                            <span>{recipe.servings} servings</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-200 mb-2">
                            Ingredients
                          </h4>
                          <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {recipe.ingredients.map((ingredient, idx) => (
                              <li key={idx}>
                                {ingredient.quantity} {ingredient.unit} {ingredient.name}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-200 mb-2">
                            Instructions
                          </h4>
                          <p className="text-gray-300 whitespace-pre-line">
                            {recipe.instructions}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleFavorite(recipe.id)}
                          className={`px-4 py-2 rounded-full font-medium flex items-center gap-2
                            ${
                              recipe.favorite
                                ? 'bg-pink-500 text-gray-900'
                                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            }
                            transition-colors duration-300`}
                        >
                          <FaHeart /> {recipe.favorite ? 'Unfavorite' : 'Favorite'}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShareClick(recipe)}
                          className={`px-4 py-2 rounded-full font-medium flex items-center gap-2
                            ${
                              recipe.isPublic
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-pink-500 text-gray-900'
                            }
                            transition-colors duration-300`}
                        >
                          <FaShareAlt /> {recipe.isPublic ? 'Unshare' : 'Share'}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDelete(recipe.id)}
                          className="px-4 py-2 bg-red-500 text-gray-900 rounded-full font-medium flex items-center gap-2
                            hover:bg-red-600 transition-colors duration-300"
                        >
                          <FaTimes /> Delete
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
              <FaUtensils className="text-5xl text-pink-400 mx-auto mb-4" />
              <p className="text-xl text-gray-300 mb-6">
                Your recipe collection is empty. Start creating your culinary masterpieces!
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

      {/* Share Modal */}
      {selectedRecipe && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedRecipe(null);
          }}
          recipe={selectedRecipe}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default RecipeViewer;
