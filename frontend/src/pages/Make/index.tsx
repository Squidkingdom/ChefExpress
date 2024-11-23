// src/pages/make/index.tsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RecipeForm from "./components/RecipeForm";
import MealPlanner from "./components/MealPlanner";
import RecipeViewer from "./components/RecipeViewer";
import SelectionCards from "./components/SelectionCards";
import Explore from "./components/Explore";
import { Recipe, ViewType } from "./types";

import {
  FaSearch,
  FaUtensils,
  FaCalendarAlt,
  FaHeart,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

const Make: React.FC = () => {
  // State Management
  const [currentView, setCurrentView] = useState<ViewType>("hero"); // Start with 'hero' view
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem("recipes");
      const parsed = saved ? JSON.parse(saved) : [];
      // Validate and sanitize parsed data
      if (Array.isArray(parsed)) {
        return parsed.map((recipe: any) => ({
          id: recipe.id || Date.now(),
          title: recipe.title || "Untitled",
          description: recipe.description || "",
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          created: recipe.created || new Date().toISOString(),
          favorite: recipe.favorite || false,
          planned: recipe.planned || false,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading recipes:", error);
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeStats, setRecipeStats] = useState({
    totalRecipes: 0,
    plannedMeals: 0,
    favoriteRecipes: 0,
  });

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && currentView === "view") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"]'
        );
        searchInput?.focus();
      }
      if (e.key === "Escape" && currentView !== "select") {
        setCurrentView("select");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentView]);

  // Save recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("recipes", JSON.stringify(recipes));
      setRecipeStats({
        totalRecipes: recipes.length,
        plannedMeals: recipes.filter((r) => r.planned).length,
        favoriteRecipes: recipes.filter((r) => r.favorite).length,
      });
    } catch (error) {
      console.error("Error saving recipes:", error);
      toast.error("Failed to save recipes");
    }
  }, [recipes]);

  // Scroll Animation
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  // For triggering animations when in view
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Handlers
  const handleSaveRecipe = useCallback((recipe: Recipe) => {
    try {
      setRecipes((prev) => [
        {
          ...recipe,
          id: Date.now(),
          created: new Date().toISOString(),
          favorite: false,
          planned: false,
        },
        ...prev,
      ]);
      setCurrentView("view");
      toast.success("Recipe saved successfully!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe");
    }
  }, []);

  const handleDeleteRecipe = useCallback((id: number) => {
    try {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      toast.success("Recipe deleted successfully");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  }, []);

  const handleToggleFavorite = useCallback((id: number) => {
    try {
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
        )
      );
      toast.success("Recipe updated");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    }
  }, []);

  const handleUpdateRecipe = useCallback((updatedRecipe: Recipe) => {
    try {
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        )
      );
      toast.success("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    }
  }, []);

  // Filtered Recipes
  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [recipes, searchQuery]
  );

  // Quick Stats Component
  const QuickStats = () => (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {[
        {
          icon: FaUtensils,
          label: "Total Recipes",
          value: recipeStats.totalRecipes,
        },
        {
          icon: FaCalendarAlt,
          label: "Planned Meals",
          value: recipeStats.plannedMeals,
        },
        {
          icon: FaHeart,
          label: "Favorites",
          value: recipeStats.favoriteRecipes,
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform scale-110`}
          />
          <div className="relative z-10 flex items-center gap-4">
            <stat.icon className="text-3xl text-teal-400" />
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Search Component
  const SearchBar = () => (
    <div className="mb-12">
      <div className="relative group">
        <FaSearch
          className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 
                                group-hover:text-teal-400 transition-colors duration-300"
        />
        <input
          type="search"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-20 py-4 bg-gray-800/50 border border-gray-700/50 rounded-full
                                focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300
                                backdrop-blur-sm text-gray-100 placeholder-gray-400
                                group-hover:border-teal-500/50"
        />
        <kbd
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400
                                bg-gray-700/50 px-2 py-0.5 rounded text-sm"
        >
          /
        </kbd>
      </div>
    </div>
  );

  // Floating elements for background
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-teal-500/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  // Container variants for animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Item variants for animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden relative">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
        </div>
      </div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-gray-800 text-gray-100"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        {currentView === "hero" && (
          <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: smoothY, opacity, scale }}
              className="relative z-10 max-w-6xl mx-auto px-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl transform -translate-y-1/2" />

                <h1 className="text-6xl md:text-8xl font-extrabold mb-8 relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                    Recipe{" "}
                  </span>
                  <div className="inline-block">
                    <span className="text-white">Studio</span>
                  </div>
                </h1>

                <p className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed">
                  Create, organize, and share your culinary masterpieces.
                </p>

                <motion.button
                  onClick={() => setCurrentView("select")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Cooking
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            </motion.div>
          </header>
        )}

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Add top margin when not on hero section */}
          {currentView !== "hero" && <div className="mt-24" />} {/* Adjusted top margin */}

          {/* Quick Stats */}
          {recipes.length > 0 && currentView !== "hero" && <QuickStats />}

          {/* Search Bar */}
          {(currentView === "view" || currentView === "explore") && (
            <SearchBar />
          )}

          {/* Page Content */}
          <AnimatePresence mode="wait">
            {currentView === "select" && (
              <SelectionCards
                onSelect={(view) => setCurrentView(view)}
                recipesCount={recipes.length}
                key="select"
              />
            )}

            {currentView === "create" && (
              <RecipeForm
                onSave={handleSaveRecipe}
                onCancel={() => setCurrentView("select")}
                key="create"
              />
            )}

            {currentView === "planner" && (
              <MealPlanner
                recipes={filteredRecipes}
                onBack={() => setCurrentView("select")}
                key="planner"
              />
            )}

            {currentView === "view" && (
              <RecipeViewer
                recipes={filteredRecipes}
                onBack={() => setCurrentView("select")}
                onDelete={handleDeleteRecipe}
                onToggleFavorite={handleToggleFavorite}
                onUpdateRecipe={handleUpdateRecipe}
                key="view"
              />
            )}

            {currentView === "explore" && (
              <Explore
                recipes={recipes}
                onBack={() => setCurrentView("select")}
                key="explore"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Make;
