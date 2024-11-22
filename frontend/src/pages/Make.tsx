// src/pages/Make.tsx

import React, { useState, useEffect, ChangeEvent } from "react";
import { 
  FaPlus, FaTimes, FaUtensils, FaTrash, FaClock, 
  FaCamera, FaListUl, FaPencilAlt, FaCalendarAlt, FaBook
} from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Interface Definitions
interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string | null;
}

interface Meal {
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
}

interface MealPlan {
  [date: string]: Meal;
}

// Main Make Page Component
const Make: React.FC = () => {
  // State Variables
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: "Spaghetti Bolognese",
      description: "A classic Italian pasta dish with rich meat sauce.",
      ingredients: [
        { name: "Spaghetti", quantity: "200", unit: "g" },
        { name: "Ground Beef", quantity: "250", unit: "g" },
        { name: "Tomato Sauce", quantity: "1", unit: "cup" },
        { name: "Onion", quantity: "1", unit: "medium" },
        { name: "Garlic", quantity: "2", unit: "cloves" },
        { name: "Olive Oil", quantity: "2", unit: "tbsp" },
        { name: "Salt", quantity: "to taste", unit: "" },
        { name: "Black Pepper", quantity: "to taste", unit: "" },
      ],
      instructions:
        "1. Cook spaghetti according to package instructions.\n" +
        "2. In a pan, heat olive oil over medium heat.\n" +
        "3. Sauté chopped onion and garlic until translucent.\n" +
        "4. Add ground beef and cook until browned.\n" +
        "5. Pour in tomato sauce and simmer for 15 minutes.\n" +
        "6. Season with salt and pepper.\n" +
        "7. Serve sauce over spaghetti.",
      image: "/images/spaghetti_bolognese.jpg",
    },
    {
      id: 2,
      title: "Chicken Caesar Salad",
      description: "A fresh salad with grilled chicken and creamy dressing.",
      ingredients: [
        { name: "Romaine Lettuce", quantity: "1", unit: "head" },
        { name: "Chicken Breast", quantity: "2", unit: "pieces" },
        { name: "Parmesan Cheese", quantity: "1/4", unit: "cup" },
        { name: "Croutons", quantity: "1", unit: "cup" },
        { name: "Caesar Dressing", quantity: "1/2", unit: "cup" },
        { name: "Olive Oil", quantity: "2", unit: "tbsp" },
        { name: "Salt", quantity: "to taste", unit: "" },
        { name: "Black Pepper", quantity: "to taste", unit: "" },
      ],
      instructions:
        "1. Season chicken with salt and pepper.\n" +
        "2. Grill chicken until cooked through and slice.\n" +
        "3. Chop romaine lettuce and place in a bowl.\n" +
        "4. Add sliced chicken, croutons, and Parmesan cheese.\n" +
        "5. Drizzle with Caesar dressing and toss to combine.",
      image: "/images/chicken_caesar_salad.jpg",
    },
  ]);

  const [formData, setFormData] = useState<Recipe>({
    id: 0,
    title: "",
    description: "",
    ingredients: [],
    instructions: "",
    image: null,
  });

  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: "",
    unit: "",
  });

  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">("breakfast");
  const [showMealSelector, setShowMealSelector] = useState(false);

  const [currentView, setCurrentView] = useState<"select" | "create" | "planner" | "view">("select");

  // Initialize current week dates
  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      return date;
    });
    setCurrentWeek(dates);
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle ingredient input changes
  const handleIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
  };

  // Handle ingredient addition
  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient],
      });
      setNewIngredient({ name: "", quantity: "", unit: "" });
      toast.success("Ingredient added");
    } else {
      toast.error("Please fill in all ingredient fields.");
    }
  };

  // Handle ingredient removal
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
    toast.success("Ingredient removed");
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Save recipe
  const handleSaveRecipe = () => {
    if (formData.title && formData.instructions) {
      setRecipes([{ ...formData, id: recipes.length + 1 }, ...recipes]);
      setFormData({
        id: 0,
        title: "",
        description: "",
        ingredients: [],
        instructions: "",
        image: null,
      });
      toast.success("Recipe saved successfully!");
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  // Handle meal slot click
  const handleMealSlotClick = (
    date: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    setSelectedDate(date);
    setMealType(meal);
    setShowMealSelector(true);
  };

  // Handle meal selection
  const handleSelectMeal = (recipe: Recipe) => {
    if (selectedDate) {
      setMealPlan({
        ...mealPlan,
        [selectedDate]: {
          ...(mealPlan[selectedDate] || {
            breakfast: null,
            lunch: null,
            dinner: null,
          }),
          [mealType]: recipe,
        },
      });
      setShowMealSelector(false);
      toast.success(`${recipe.title} added to your ${mealType}!`);
    }
  };

  // Animation Variants
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const smoothY = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle Week Navigation
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = currentWeek.map(date => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
      return newDate;
    });
    setCurrentWeek(newWeek);
  };

  // Sub-Components

  // Selection View
  const SelectView = () => (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {/* Create Recipe Card */}
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("create")}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors duration-300"
      >
        <FaPencilAlt className="text-5xl text-teal-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-200">Create a Recipe</h3>
        <p className="text-gray-400 mt-2 text-center">
          Share your unique recipes with the community.
        </p>
      </motion.div>

      {/* Meal Planner Card */}
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("planner")}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors duration-300"
      >
        <FaCalendarAlt className="text-5xl text-teal-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-200">Plan Meals</h3>
        <p className="text-gray-400 mt-2 text-center">
          Organize your weekly meals with our planner.
        </p>
      </motion.div>

      {/* View Recipes Card */}
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("view")}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors duration-300"
      >
        <FaBook className="text-5xl text-teal-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-200">View Recipes</h3>
        <p className="text-gray-400 mt-2 text-center">
          Browse and manage your saved culinary creations.
        </p>
      </motion.div>
    </motion.div>
  );

  // Create Recipe View
  const CreateRecipe = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative backdrop-blur-lg bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700/50 mb-16"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-2xl blur-xl" />
      
      <div className="relative z-10">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Create New Recipe
          </span>
        </motion.h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column */}
            <div className="space-y-6">
              {/* Recipe Title */}
              <motion.div variants={fadeIn} className="group">
                <label className="block text-gray-300 mb-2">Recipe Title</label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300
                      group-hover:border-teal-500/50"
                    placeholder="Enter recipe name..."
                    required
                  />
                  <FaPencilAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-teal-400 transition-colors duration-300" />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeIn} className="group">
                <label className="block text-gray-300 mb-2">Description</label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300
                      group-hover:border-teal-500/50"
                    placeholder="Describe your recipe..."
                  />
                  <FaPencilAlt className="absolute right-4 top-6 text-gray-500 group-hover:text-teal-400 transition-colors duration-300" />
                </div>
              </motion.div>

              {/* Ingredients */}
              <motion.div variants={fadeIn} className="space-y-4">
                <label className="block text-gray-300 mb-2">Ingredients</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  <input
                    type="text"
                    name="name"
                    value={newIngredient.name}
                    onChange={handleIngredientChange}
                    placeholder="Ingredient"
                    className="flex-grow min-w-[150px] px-4 py-3 bg-gray-900/50 backdrop-blur-sm 
                      border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 
                      focus:ring-teal-500/50 transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="quantity"
                    value={newIngredient.quantity}
                    onChange={handleIngredientChange}
                    placeholder="Amount"
                    className="w-24 px-4 py-3 bg-gray-900/50 backdrop-blur-sm 
                      border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 
                      focus:ring-teal-500/50 transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="unit"
                    value={newIngredient.unit}
                    onChange={handleIngredientChange}
                    placeholder="Unit"
                    className="w-24 px-4 py-3 bg-gray-900/50 backdrop-blur-sm 
                      border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 
                      focus:ring-teal-500/50 transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 
                      text-gray-900 rounded-xl font-semibold shadow-lg shadow-teal-500/25 
                      hover:shadow-teal-500/40 transition-all duration-300 flex items-center gap-2"
                  >
                    <FaPlus /> Add
                  </motion.button>
                </div>

                {/* Ingredients List */}
                <AnimatePresence>
                  {formData.ingredients.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 
                        rounded-xl p-4 max-h-[300px] overflow-y-auto custom-scrollbar"
                    >
                      {formData.ingredients.map((ingredient, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-2 hover:bg-gray-800/50 
                            rounded-lg transition-colors duration-200"
                        >
                          <span className="text-gray-300">
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveIngredient(idx)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            aria-label="Remove Ingredient"
                          >
                            <FaTrash />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Upload */}
              <motion.div variants={fadeIn} className="group">
                <label className="block text-gray-300 mb-2">Recipe Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 
                      rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300
                      file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-teal-500 
                      file:text-gray-900 file:font-semibold hover:file:bg-teal-400 file:transition-colors"
                  />
                  <FaCamera className="absolute right-4 top-1/2 transform -translate-y-1/2 
                    text-gray-500 group-hover:text-teal-400 transition-colors duration-300" />
                </div>
                {formData.image && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={formData.image}
                      alt="Recipe Preview"
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Instructions */}
              <motion.div variants={fadeIn} className="group">
                <label className="block text-gray-300 mb-2">Instructions</label>
                <div className="relative">
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 
                      rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all 
                      duration-300 group-hover:border-teal-500/50"
                    placeholder="Enter step-by-step instructions..."
                    required
                  />
                  <FaListUl className="absolute right-4 top-6 text-gray-500 
                    group-hover:text-teal-400 transition-colors duration-300" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSaveRecipe}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-400 
              text-gray-900 rounded-xl font-semibold text-xl shadow-lg 
              shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 
              flex items-center justify-center gap-2"
          >
            <FaPlus className="text-xl" /> Save Recipe
          </motion.button>

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView("select")}
            className="mt-4 w-full py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors duration-300"
          >
            <FaTimes /> Back to Menu
          </motion.button>
        </form>
      </div>
    </motion.div>
  );

  // Meal Planner View
  const MealPlanner = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto mb-16 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl blur-xl" />
      
      <div className="relative backdrop-blur-lg bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50">
        <h2 className="text-4xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Weekly Meal Planner
          </span>
        </h2>

        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 
              transition-colors duration-300 flex items-center gap-2"
            onClick={() => navigateWeek("prev")}
            aria-label="Previous Week"
          >
            ← Previous Week
          </motion.button>
          <h3 className="text-xl text-gray-300">
            {currentWeek[0]?.toLocaleDateString('en-US', { 
              month: 'long',
              day: 'numeric'
            })} - {currentWeek[6]?.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 
              transition-colors duration-300 flex items-center gap-2"
            onClick={() => navigateWeek("next")}
            aria-label="Next Week"
          >
            Next Week →
          </motion.button>
        </div>

        {/* Meal Planner Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="py-4 px-6 bg-gray-900/30 rounded-tl-xl text-teal-400 font-bold">
                  Day
                </th>
                {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                  <th key={meal} className="py-4 px-6 bg-gray-900/30 text-teal-400 font-bold">
                    {meal}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentWeek.map((date) => {
                const dateString = date.toDateString();
                const meals = mealPlan[dateString] || {
                  breakfast: null,
                  lunch: null,
                  dinner: null,
                };
                
                return (
                  <motion.tr 
                    key={dateString}
                    className="border-b border-gray-700/50 last:border-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-4 px-6 bg-gray-900/30 font-semibold">
                      <div className="flex flex-col">
                        <span className="text-teal-400">
                          {date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        <span className="text-sm text-gray-400">
                          {date.toLocaleDateString('en-US', { 
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                      <td
                        key={meal}
                        className="py-4 px-6 bg-gray-900/30"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer"
                          onClick={() => handleMealSlotClick(dateString, meal)}
                        >
                          {meals[meal] ? (
                            <div className="flex items-center gap-3 p-2 bg-gray-800/50 
                              rounded-xl hover:bg-gray-700/50 transition-colors duration-300">
                              {meals[meal]?.image && (
                                <img
                                  src={meals[meal]?.image!}
                                  alt={meals[meal]?.title}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="text-teal-400 font-medium">
                                  {meals[meal]?.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Click to change
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-4 bg-gray-800/50 
                              rounded-xl hover:bg-gray-700/50 transition-colors duration-300">
                              <FaPlus className="text-teal-400" />
                              <span className="text-gray-400">Add {meal}</span>
                            </div>
                          )}
                        </motion.div>
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("select")}
        className="mt-4 w-full py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors duration-300"
      >
        <FaTimes /> Back to Menu
      </motion.button>
    </motion.div>
  );

  // View Recipes Component
  const ViewRecipes = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto mb-16 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl blur-xl" />
      
      <div className="relative backdrop-blur-lg bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Your Recipe Collection
          </span>
        </h2>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 
                  rounded-2xl blur-xl transform group-hover:scale-105 transition-transform duration-300" />
                
                <div className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 
                  rounded-2xl overflow-hidden shadow-xl">
                  {recipe.image && (
                    <div className="relative h-64">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-teal-400 mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{recipe.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-200 mb-2 flex items-center gap-2">
                          <FaListUl className="text-teal-400" /> Ingredients
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
                        <h4 className="text-xl font-semibold text-gray-200 mb-2 flex items-center gap-2">
                          <FaUtensils className="text-teal-400" /> Instructions
                        </h4>
                        <p className="text-gray-300 whitespace-pre-line">
                          {recipe.instructions}
                        </p>
                      </div>
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
            <FaUtensils className="text-5xl text-teal-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300 mb-6">
              Your recipe collection is empty. Start creating your culinary masterpieces!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView("create")}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                text-gray-900 rounded-xl font-semibold shadow-lg 
                shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
            >
              Create Your First Recipe
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("select")}
        className="mt-4 w-full py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors duration-300"
      >
        <FaTimes /> Back to Menu
      </motion.button>
    </motion.div>
  );

  // Floating Elements for Background
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-teal-500/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden relative">
      {/* Animated Background Gradient */}
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

      {/* Hero Section */}
      <motion.header
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-[40vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-sm" />
        
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Recipe Studio
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Create, plan, and share your culinary masterpieces
          </p>
        </motion.div>
      </motion.header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {currentView === "select" && <SelectView key="select" />}
          {currentView === "create" && <CreateRecipe key="create" />}
          {currentView === "planner" && <MealPlanner key="planner" />}
          {currentView === "view" && <ViewRecipes key="view" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Make;
