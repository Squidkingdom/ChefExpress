// src/pages/Make.tsx

import React, { useState, useEffect, ChangeEvent } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import RecipeCard from "../subcomponents/RecipeCard";
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from "@tanstack/react-query";
import { Recipes } from "../components/Recipes";

interface Ingredient {
  name: string;
  quantity: string;
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

/**
 * Make Page
 * Includes recipe maker, saved recipes, meal planner, and meal selector.
 * Updated to work with the guided tour.
 * @returns {React.JSX.Element} - Make Page with full functionality.
 */
const Make: React.FC = () => {
  //Get Recipes from API


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
  });

  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  // Initialize current week dates
  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
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
  // Handle ingredient input
  const handleIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
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
    // if (formData.title && formData.instructions) {
    //   setRecipes([{ ...formData, id: recipes.length + 1 }, ...recipes]);
    //   setFormData({
    //     id: 0,
    //     title: "",
    //     description: "",
    //     ingredients: [],
    //     instructions: "",
    //     image: null,
    //   });
    //   toast.success("Recipe saved successfully!");
    // } else {
    //   toast.error("Please fill in all required fields.");
    // }
  };

  // Meal planner functions
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">(
    "breakfast"
  );
  const [showMealSelector, setShowMealSelector] = useState(false);

  const handleMealSlotClick = (
    date: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    setSelectedDate(date);
    setMealType(meal);
    setShowMealSelector(true);
  };

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

  const renderMealPlanner = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="py-4 px-6 bg-gray-800 text-teal-400 font-bold">Day</th>
              <th className="py-4 px-6 bg-gray-800 text-teal-400 font-bold">
                Breakfast
              </th>
              <th className="py-4 px-6 bg-gray-800 text-teal-400 font-bold">Lunch</th>
              <th className="py-4 px-6 bg-gray-800 text-teal-400 font-bold">Dinner</th>
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
                <tr key={dateString} className="border-b border-gray-700">
                  <td className="py-4 px-6 bg-gray-800 text-gray-200 font-semibold">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                    <td
                      key={meal}
                      className="py-4 px-6 bg-gray-800 cursor-pointer hover:bg-gray-700"
                      onClick={() => handleMealSlotClick(dateString, meal)}
                    >
                      {meals[meal] ? (
                        <div className="flex items-center">
                          {meals[meal]?.image && (
                            <img
                              src={meals[meal]?.image}
                              alt={meals[meal]?.title}
                              className="w-10 h-10 object-cover rounded-full mr-3"
                            />
                          )}
                          <span className="text-teal-400">
                            {meals[meal]?.title}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <FaPlus className="mr-2" /> Add
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="make-recipe-builder min-h-screen bg-gray-900 text-gray-100 py-10">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <header
        className="text-center py-16 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/make-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold text-teal-400 mb-4">
            Create and Share Your Recipes!
          </h1>
          <p className="text-xl text-gray-200">
            Build your personalized meal plans and inspire others.
          </p>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Recipe Maker Section */}
        <div
          className="recipe-maker w-full max-w-6xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg mb-16"
          id="make-recipe-maker" // Added ID for Guided Tour targeting
        >
          <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">
            New Recipe
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Grid Layout for Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Recipe Title */}
                <div>
                  <label className="block text-gray-300 mb-2">Recipe Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-gray-300 mb-2">Ingredients</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <input
                      type="text"
                      name="name"
                      value={newIngredient.name}
                      onChange={handleIngredientChange}
                      placeholder="Ingredient Name"
                      className="flex-grow min-w-[150px] px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      name="quantity"
                      value={newIngredient.quantity}
                      onChange={handleIngredientChange}
                      placeholder="Quantity"
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {/* <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="bg-teal-500 text-gray-900 px-4 py-2 rounded-md hover:bg-teal-400 transition duration-200 flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add
                    </button> */}
                  </div>
                  {formData.ingredients.length > 0 && (
                    <ul className="list-disc list-inside text-gray-300 max-h-40 overflow-y-auto border border-gray-700 rounded-md p-4 bg-gray-900">
                      {formData.ingredients.map((ingredient, idx) => (
                        <li key={idx}>
                          {ingredient.quantity} of {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-gray-300 mb-2">Recipe Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-gray-300 px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Recipe"
                      className="w-full h-64 object-cover rounded-md mt-4"
                    />
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-gray-300 mb-2">Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveRecipe}
              className="w-full bg-teal-500 text-gray-900 py-4 rounded-md font-semibold text-xl hover:bg-teal-400 transition duration-200 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Save Recipe
            </button>
          </form>
        </div>

        {/* Meal Planner Section */}
        <div
          className="meal-planner w-full max-w-7xl mx-auto mb-16"
          id="make-meal-planner"
        >
          <h2 className="text-4xl font-bold text-center text-teal-400 mb-12">
            Weekly Meal Planner
          </h2>
          {renderMealPlanner()}
        </div>

        {/* Meal Selector Modal */}
        {showMealSelector && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full relative">
              <h3 className="text-2xl font-bold text-teal-400 mb-6">
                Select a Recipe for {mealType.charAt(0).toUpperCase() + mealType.slice(1)} on{" "}
                {new Date(selectedDate!).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => setShowMealSelector(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
                aria-label="Close meal selector"
              >
                <FaTimes />
              </button>
              {recipes.length > 0 ? (
                <ul className="space-y-4 max-h-80 overflow-y-auto">
                  {recipes.map((recipe) => (
                    <li key={recipe.id}>
                      <button
                        onClick={() => handleSelectMeal(recipe)}
                        className="w-full text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-md flex items-center"
                      >
                        {recipe.image && (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                        )}
                        <span className="text-teal-400 text-xl font-semibold">
                          {recipe.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">
                  No recipes available. Please add recipes first.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Displaying Saved Recipes */}
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-teal-400 mb-12">
            Your Recipes
          </h2>
          <Recipes />
        </div>
      </div>
    </div>
  );
};

export default Make;
