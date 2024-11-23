// src/components/MealPlanner.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTimes,
  FaUtensils,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Recipe } from "../types";

interface MealPlannerProps {
  recipes: Recipe[];
  onBack: () => void;
}

type MealType = "breakfast" | "lunch" | "dinner";

interface MealPlan {
  [date: string]: {
    breakfast: Recipe | null;
    lunch: Recipe | null;
    dinner: Recipe | null;
  };
}

const MealPlanner: React.FC<MealPlannerProps> = ({ recipes, onBack }) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);

  // Initialize current week
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    setCurrentWeek(weekDates);
  }, []);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => {
      const firstDay = new Date(prev[0]);
      const offset = direction === "prev" ? -7 : 7;
      firstDay.setDate(firstDay.getDate() + offset);

      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + i);
        return date;
      });
    });
  };

  const handleMealSlotClick = (date: string, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowRecipeSelector(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (selectedDate && selectedMealType) {
      setMealPlan((prev) => ({
        ...prev,
        [selectedDate]: {
          ...(prev[selectedDate] || {
            breakfast: null,
            lunch: null,
            dinner: null,
          }),
          [selectedMealType]: recipe,
        },
      }));
      setShowRecipeSelector(false);
      setSelectedDate(null);
      setSelectedMealType(null);
      toast.success(`Added ${recipe.title} to ${selectedMealType}`);
    }
  };

  const handleMealDelete = (date: string, mealType: MealType) => {
    setMealPlan((prev) => {
      const dayPlan = prev[date];
      if (dayPlan) {
        return {
          ...prev,
          [date]: {
            ...dayPlan,
            [mealType]: null,
          },
        };
      }
      return prev;
    });
    toast.info(`Removed ${mealType} from ${date}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <div className="relative backdrop-blur-lg bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-2xl blur-xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Meal Planner
              </span>
            </h2>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateWeek("prev")}
                className="p-2 bg-gray-700/50 rounded-xl hover:bg-gray-600/50
                      transition-colors duration-300"
              >
                <FaChevronLeft className="text-teal-400" />
              </motion.button>

              <div className="text-lg font-medium text-gray-300">
                {currentWeek[0]?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {currentWeek[6]?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateWeek("next")}
                className="p-2 bg-gray-700/50 rounded-xl hover:bg-gray-600/50
                      transition-colors duration-300"
              >
                <FaChevronRight className="text-teal-400" />
              </motion.button>
            </div>
          </div>

          {/* Weekly Grid */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-gray-900/30 rounded-tl-xl text-teal-400 font-bold text-left">
                    Day
                  </th>
                  {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                    <th
                      key={meal}
                      className="py-4 px-6 bg-gray-900/30 text-teal-400 font-bold text-left"
                    >
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-gray-700/50 last:border-none"
                    >
                      <td className="py-4 px-6 bg-gray-900/30">
                        <div className="flex flex-col">
                          <span className="text-teal-400 font-medium">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                          <span className="text-sm text-gray-400">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {(["breakfast", "lunch", "dinner"] as MealType[]).map(
                        (mealType) => (
                          <td
                            key={mealType}
                            className="py-4 px-6 bg-gray-900/30"
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer"
                            >
                              {meals[mealType] ? (
                                <div
                                  className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-xl
                                    hover:bg-gray-700/50 transition-colors duration-300 group"
                                >
                                  {meals[mealType]?.image && (
                                    <img
                                      src={meals[mealType]?.image!}
                                      alt={meals[mealType]?.title}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-teal-400 font-medium truncate">
                                      {meals[mealType]?.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                      <FaClock className="text-xs" />
                                      <span>{meals[mealType]?.cookTime}</span>
                                    </div>
                                  </div>
                                  <motion.div
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() =>
                                      handleMealDelete(dateString, mealType)
                                    }
                                  >
                                    <FaTimes className="text-red-400" />
                                  </motion.div>
                                </div>
                              ) : (
                                <div
                                  className="flex items-center gap-2 p-4 bg-gray-800/50 rounded-xl
                                    hover:bg-gray-700/50 transition-colors duration-300"
                                  onClick={() =>
                                    handleMealSlotClick(dateString, mealType)
                                  }
                                >
                                  <FaPlus className="text-teal-400" />
                                  <span className="text-gray-400">
                                    Add {mealType}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          </td>
                        )
                      )}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Recipe Selector Modal */}
          <AnimatePresence>
            {showRecipeSelector && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => setShowRecipeSelector(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-2xl mx-4 p-8 bg-gray-800 rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold mb-6 text-teal-400">
                    Select a Recipe
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {recipes.map((recipe) => (
                      <motion.div
                        key={recipe.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer bg-gray-700/50 rounded-xl p-4 hover:bg-gray-600/50
                              transition-colors duration-300"
                        onClick={() => handleRecipeSelect(recipe)}
                      >
                        <div className="flex items-center gap-4">
                          {recipe.image && (
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-teal-400 mb-1">
                              {recipe.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <FaClock className="text-xs" />
                                {recipe.cookTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUtensils className="text-xs" />
                                {recipe.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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

export default MealPlanner;
