import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaFilter, FaClock, FaUtensils, 
  FaHeart, FaComment, FaShare, FaBookmark,
  FaTimes, FaTags, FaStar, FaFire, FaChevronDown,
  FaRegLightbulb
} from 'react-icons/fa';
import { Recipe } from '../types';
import { toast } from 'react-toastify';

interface ExploreViewProps {
  onBack: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
  onLike: (recipeId: number) => void;
  currentUser?: { id: string; name: string };
  sharedRecipes?: Recipe[];
}

const ExploreView: React.FC<ExploreViewProps> = ({
  onBack,
  onSaveRecipe,
  onLike,
  currentUser,
  sharedRecipes = []
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'popular'>('trending');
  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);

  // Config
  const categories = [
    'all', 'breakfast', 'lunch', 'dinner', 'dessert', 
    'snacks', 'vegetarian', 'vegan', 'gluten-free'
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: FaFire },
    { value: 'recent', label: 'Recent', icon: FaClock },
    { value: 'popular', label: 'Most Liked', icon: FaStar }
  ];

  // Filtered & Sorted Recipes
  const filteredRecipes = useMemo(() => {
    let filtered = sharedRecipes;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return ((b.views || 0) * 0.4 + (b.likes || 0) * 0.6) - 
                 ((a.views || 0) * 0.4 + (a.likes || 0) * 0.6);
        case 'recent':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  }, [sharedRecipes, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Recipe Card Component
  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const isExpanded = expandedRecipeId === recipe.id;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 
          rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        <div className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 
          rounded-2xl overflow-hidden">
          {/* Image Section */}
          <div className="relative h-48">
            <img
              src={recipe.image || '/placeholder-recipe.jpg'}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-300
                group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
            
            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(recipe.id);
                  toast.success('Recipe liked!');
                }}
                className="p-2 bg-gray-900/50 backdrop-blur-sm rounded-full 
                  text-gray-300 hover:text-violet-400 transition-colors"
              >
                <FaHeart className={recipe.likedBy?.includes(currentUser?.id || '') ? 'text-violet-400' : ''} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveRecipe(recipe);
                  toast.success('Recipe saved to your collection!');
                }}
                className="p-2 bg-gray-900/50 backdrop-blur-sm rounded-full 
                  text-gray-300 hover:text-violet-400 transition-colors"
              >
                <FaBookmark className={recipe.savedBy?.includes(currentUser?.id || '') ? 'text-violet-400' : ''} />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Recipe Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <FaClock className="text-violet-400" />
                {recipe.cookTime}
              </span>
              <span className="flex items-center gap-1">
                <FaUtensils className="text-violet-400" />
                {recipe.difficulty}
              </span>
              {recipe.servings && (
                <span className="flex items-center gap-1">
                  <FaRegLightbulb className="text-violet-400" />
                  {recipe.servings} servings
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
              {recipe.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>

            {/* Author & Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {recipe.author?.avatar ? (
                  <img
                    src={recipe.author.avatar}
                    alt={recipe.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <span className="text-violet-400 text-xs">
                      {recipe.author?.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-gray-300">{recipe.author?.name}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="flex items-center gap-1" title="Likes">
                  <FaHeart className="text-xs" /> {recipe.likes || 0}
                </span>
                <span className="flex items-center gap-1" title="Comments">
                  <FaComment className="text-xs" /> {recipe.comments?.length || 0}
                </span>
                <span className="flex items-center gap-1" title="Shares">
                  <FaShare className="text-xs" /> {recipe.shares || 0}
                </span>
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
              className="mt-4 w-full flex items-center justify-center gap-2 text-gray-400 
                hover:text-violet-400 transition-colors"
            >
              <span>{isExpanded ? 'Show less' : 'Show more'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown />
              </motion.div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 border-t border-gray-700/50"
                >
                  {/* Ingredients Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-violet-400 mb-2">Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300"
                        >
                          {ing.name}
                        </span>
                      ))}
                      {recipe.ingredients.length > 5 && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
                          +{recipe.ingredients.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveRecipe(recipe);
                      }}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-violet-500 to-purple-400 
                        rounded-xl text-white font-medium text-sm"
                    >
                      Save Recipe
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="py-2 px-4 bg-gray-800/50 rounded-xl text-gray-300 text-sm"
                    >
                      View Full Recipe
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  // Filter Section Component
  const FilterSection = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden mb-8"
    >
      <div className="space-y-6 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-violet-400 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-violet-500 to-purple-400 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h3 className="text-sm font-medium text-violet-400 mb-3">Difficulty</h3>
          <div className="flex gap-2">
            {difficulties.map(difficulty => (
              <motion.button
                key={difficulty}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedDifficulty === difficulty
                    ? 'bg-gradient-to-r from-violet-500 to-purple-400 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
              >
                {difficulty}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="space-y-8 mb-12">
        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center"
        >
          <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            Discover Community Recipes
          </span>
        </motion.h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FaUtensils, label: "Recipes", value: filteredRecipes.length },
            { icon: FaBookmark, label: "Saved", value: filteredRecipes.filter(r => r.savedBy?.includes(currentUser?.id || '')).length },
            { icon: FaHeart, label: "Liked", value: filteredRecipes.filter(r => r.likedBy?.includes(currentUser?.id || '')).length }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-xl blur-lg" />
              <div className="relative z-10 flex items-center gap-3">
                <stat.icon className="text-2xl text-violet-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 
              group-hover:text-violet-400 transition-colors" />
            <div className="relative group">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search public recipes..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50
                  group-hover:border-violet-500/50 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                    hover:text-violet-400 transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Sort & Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Sort Options */}
            {sortOptions.map(option => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(option.value as any)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2
                  ${sortBy === option.value
                    ? 'bg-gradient-to-r from-violet-500 to-purple-400 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  } transition-colors`}
              >
                <option.icon />
                <span className="hidden sm:inline">{option.label}</span>
              </motion.button>
            ))}

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors
                ${showFilters 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-400 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
            >
              {showFilters ? <FaTimes /> : <FaFilter />}
              <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Filters'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-400">Active filters:</span>
          {selectedCategory !== 'all' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedCategory('all')}
              className="px-3 py-1 bg-violet-500/20 rounded-full text-sm text-violet-400 
                flex items-center gap-2"
            >
              {selectedCategory}
              <FaTimes className="text-xs" />
            </motion.button>
          )}
          {selectedDifficulty !== 'all' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedDifficulty('all')}
              className="px-3 py-1 bg-violet-500/20 rounded-full text-sm text-violet-400 
                flex items-center gap-2"
            >
              {selectedDifficulty}
              <FaTimes className="text-xs" />
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Clear all
          </motion.button>
        </div>
      )}

      {/* Filters */}
      <AnimatePresence>
        {showFilters && <FilterSection />}
      </AnimatePresence>

      {/* Recipe Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FaSearch className="text-5xl text-violet-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
          <p className="text-gray-400">
            {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? "Try adjusting your filters or search terms"
              : "Be the first to share a recipe with the community!"}
          </p>
          {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 px-6 py-2 bg-violet-500/20 rounded-full text-violet-400
                hover:bg-violet-500/30 transition-colors"
            >
              Clear all filters
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mt-12 px-6 py-3 mx-auto flex items-center gap-2 
          bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 
          transition-colors border border-gray-700/50"
      >
        <FaTimes /> Back to Menu
      </motion.button>
    </div>
  );
};

export default ExploreView;