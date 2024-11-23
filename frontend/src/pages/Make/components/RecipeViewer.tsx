import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaUtensils, FaClock, FaUsers, FaHeart, FaShareAlt,
  FaSearch, FaFilter, FaGlobe, FaLock, FaTags, FaStar,
  FaChevronDown, FaEdit, FaPrint
} from "react-icons/fa";
import type { Recipe } from "../types";
import ShareModal from "./ShareModal";

interface RecipeViewerProps {
  recipes: Recipe[];
  onBack: () => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onUpdateRecipe: (updatedRecipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
}

const RecipeViewer: React.FC<RecipeViewerProps> = ({
  recipes,
  onBack,
  onDelete,
  onToggleFavorite,
  onUpdateRecipe,
  onEdit
}) => {
  // State
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'public' | 'private' | 'favorites'>('all');
  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' ||
        (selectedFilter === 'public' && recipe.isPublic) ||
        (selectedFilter === 'private' && !recipe.isPublic) ||
        (selectedFilter === 'favorites' && recipe.favorite);
      
      return matchesSearch && matchesFilter;
    });
  }, [recipes, searchQuery, selectedFilter]);

  // Sort recipes by date
  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => 
      new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }, [filteredRecipes]);

  // Handlers
  const handleShareClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsShareModalOpen(true);
  };

  const handleShare = (updatedRecipe: Recipe) => {
    onUpdateRecipe(updatedRecipe);
  };

  const handlePrint = (recipe: Recipe) => {
    window.print();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Filter Section Component
  const FilterSection = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden mb-8"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: 'all', label: 'All Recipes', icon: FaUtensils },
          { value: 'favorites', label: 'Favorites', icon: FaHeart },
          { value: 'public', label: 'Public', icon: FaGlobe },
          { value: 'private', label: 'Private', icon: FaLock }
        ].map(filter => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedFilter(filter.value as any)}
            className={`p-4 rounded-xl backdrop-blur-sm border transition-all
              ${selectedFilter === filter.value
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/50'
                : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/30'
              }
            `}
          >
            <filter.icon className={`text-2xl mb-2 ${
              selectedFilter === filter.value ? 'text-pink-400' : 'text-gray-400'
            }`} />
            <span className={selectedFilter === filter.value ? 'text-white' : 'text-gray-300'}>
              {filter.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  // Recipe Card Component
  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const isExpanded = expandedRecipeId === recipe.id;
    
    return (
      <motion.div
        variants={itemVariants}
        layoutId={`recipe-${recipe.id}`}
        className="group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 
          rounded-2xl blur-xl transform group-hover:scale-105 transition-all duration-300" />

        <div className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 
          rounded-2xl overflow-hidden">
          {/* Recipe Header */}
          <div className="flex items-stretch">
            {recipe.image && (
              <div className="relative w-1/3">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
              </div>
            )}

            <div className="flex-1 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-300 
                    bg-clip-text text-transparent mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-300 line-clamp-2">{recipe.description}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {recipe.isPublic && (
                    <FaGlobe className="text-pink-400" title="Public Recipe" />
                  )}
                  {recipe.favorite && (
                    <FaHeart className="text-pink-400" title="Favorite Recipe" />
                  )}
                </div>
              </div>

              {/* Recipe Meta */}
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
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
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-gray-700/50"
              >
                <div className="p-6 space-y-6">
                  {/* Ingredients */}
                  <div>
                    <h4 className="text-lg font-semibold text-pink-400 mb-3">Ingredients</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300">
                          <span className="w-2 h-2 rounded-full bg-pink-400" />
                          {ingredient.quantity} {ingredient.unit} {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="text-lg font-semibold text-pink-400 mb-3">Instructions</h4>
                    <div className="text-gray-300 whitespace-pre-line">
                      {recipe.instructions}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleFavorite(recipe.id)}
                      className="px-4 py-2 rounded-full font-medium flex items-center gap-2
                        bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-colors"
                    >
                      <FaHeart className={recipe.favorite ? 'text-pink-400' : ''} />
                      {recipe.favorite ? 'Unfavorite' : 'Favorite'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareClick(recipe)}
                      className="px-4 py-2 rounded-full font-medium flex items-center gap-2
                        bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-colors"
                    >
                      <FaShareAlt />
                      Share
                    </motion.button>

                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(recipe)}
                        className="px-4 py-2 rounded-full font-medium flex items-center gap-2
                          bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-colors"
                      >
                        <FaEdit />
                        Edit
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePrint(recipe)}
                      className="px-4 py-2 rounded-full font-medium flex items-center gap-2
                        bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-colors"
                    >
                      <FaPrint />
                      Print
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(recipe.id)}
                      className="px-4 py-2 rounded-full font-medium flex items-center gap-2
                        bg-red-500/50 text-white hover:bg-red-600/50 transition-colors ml-auto"
                    >
                      <FaTimes />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Toggle */}
          <button
            onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
            className="w-full p-2 bg-gray-700/30 hover:bg-gray-700/50 
              transition-colors flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronDown className="text-gray-400" />
            </motion.div>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-300 
          bg-clip-text text-transparent mb-6">
          Your Recipe Collection
        </h2>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 
                rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                transition-all duration-300"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2
              transition-colors ${showFilters
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
          >
            <FaFilter /> Filters
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && <FilterSection />}
      </AnimatePresence>

      {/* Recipes Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {sortedRecipes.length > 0 ? (
          sortedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 
              border border-gray-700/50">
            <div className="max-w-md mx-auto space-y-4">
              <FaUtensils className="text-5xl text-pink-400 mx-auto" />
              {searchQuery ? (
                <>
                  <h3 className="text-xl font-semibold text-white">No matches found</h3>
                  <p className="text-gray-400">
                    No recipes match your search "{searchQuery}". Try different keywords or clear filters.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilter("all");
                    }}
                    className="px-6 py-2 bg-gray-700/50 rounded-full text-gray-300 
                      hover:bg-gray-600/50 transition-colors mt-4"
                  >
                    Clear Filters
                  </motion.button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white">
                    Your recipe collection is empty
                  </h3>
                  <p className="text-gray-400">
                    Start creating your culinary masterpieces! Click the button below to add your first recipe.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-400 
                      rounded-full text-white font-medium shadow-lg shadow-pink-500/25 
                      hover:shadow-pink-500/40 transition-all mt-4"
                  >
                    Create Recipe
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Stats */}
      {sortedRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
        >
          {[
            {
              icon: FaUtensils,
              label: 'Total Recipes',
              value: recipes.length
            },
            {
              icon: FaHeart,
              label: 'Favorites',
              value: recipes.filter(r => r.favorite).length
            },
            {
              icon: FaGlobe,
              label: 'Public',
              value: recipes.filter(r => r.isPublic).length
            },
            {
              icon: FaLock,
              label: 'Private',
              value: recipes.filter(r => !r.isPublic).length
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 
                rounded-xl p-4"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 
                rounded-xl blur-lg" />
              <div className="relative z-10">
                <stat.icon className="text-2xl text-pink-400 mb-2" />
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mt-8 w-full py-3 bg-gray-800/50 text-gray-300 rounded-xl 
          font-medium flex items-center justify-center gap-2 hover:bg-gray-700/50 
          transition-colors border border-gray-700/50 backdrop-blur-sm"
      >
        <FaTimes /> Back to Menu
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .recipe-print-content, 
          .recipe-print-content * {
            visibility: visible;
          }
          .recipe-print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .recipe-action-buttons {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default RecipeViewer;