// src/pages/Make.tsx

import React, { useState, useEffect, ChangeEvent } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Recipes } from "../components/Recipes";
import { UploadRecipe } from "../components/UploadRecipe";

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
        <UploadRecipe />

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
        {/*showMealSelector && (
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
        )*/}

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
