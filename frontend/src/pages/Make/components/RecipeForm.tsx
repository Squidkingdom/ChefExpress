// src/components/RecipeForm.tsx

import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaCamera,
  FaClock,
  FaUtensils,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Recipe, RecipeFormProps, Ingredient } from "../types";

const RecipeForm: React.FC<RecipeFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<Recipe>(
    initialData || {
      id: 0,
      title: "",
      description: "",
      ingredients: [],
      instructions: "",
      image: "",
      prepTime: "",
      cookTime: "",
      difficulty: "Easy",
      servings: 2,
      isPublic: false,
      created: new Date().toISOString(),
    }
  );

  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: "",
    unit: "",
  });

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient],
      });
      setNewIngredient({ name: "", quantity: "", unit: "" });
      toast.success("Ingredient added");
    } else {
      toast.error("Please fill in the required ingredient fields");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.instructions ||
      formData.ingredients.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 mb-16"
    >
      <div className="relative backdrop-blur-lg bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-2xl blur-xl" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          {/* Recipe Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-4 col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-teal-400 font-medium">
                Recipe Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                placeholder="Enter your recipe name..."
              />
            </motion.div>

            {/* Time and Difficulty Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-teal-400 font-medium">
                  Prep Time
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    placeholder="e.g., 15 mins"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-teal-400 font-medium">
                  Cook Time
                </label>
                <div className="relative">
                  <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    placeholder="e.g., 30 mins"
                  />
                </div>
              </div>
            </div>

            {/* Difficulty and Servings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-teal-400 font-medium">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-teal-400 font-medium">
                  Servings
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <label className="block text-teal-400 font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                placeholder="Describe your recipe..."
              />
            </div>

            {/* Ingredients Section */}
            <div className="col-span-2 space-y-4">
              <label className="block text-teal-400 font-medium">
                Ingredients
              </label>

              {/* Ingredient Input Group */}
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  name="name"
                  value={newIngredient.name}
                  onChange={handleIngredientChange}
                  placeholder="Ingredient name"
                  className="flex-grow min-w-[200px] px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <input
                  type="text"
                  name="quantity"
                  value={newIngredient.quantity}
                  onChange={handleIngredientChange}
                  placeholder="Amount"
                  className="w-24 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <input
                  type="text"
                  name="unit"
                  value={newIngredient.unit}
                  onChange={handleIngredientChange}
                  placeholder="Unit"
                  className="w-24 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <motion.button
                  type="button"
                  onClick={handleAddIngredient}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900
                        rounded-xl font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40
                        flex items-center gap-2"
                >
                  <FaPlus /> Add
                </motion.button>
              </div>

              {/* Ingredients List */}
              {formData.ingredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gray-900/50 rounded-xl p-4 space-y-2"
                >
                  {formData.ingredients.map((ingredient, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <span className="text-gray-300">
                        {ingredient.quantity} {ingredient.unit}{" "}
                        {ingredient.name}
                      </span>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            ingredients: formData.ingredients.filter(
                              (_, i) => i !== idx
                            ),
                          });
                          toast.success("Ingredient removed");
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Instructions */}
            <div className="col-span-2 space-y-2">
              <label className="block text-teal-400 font-medium">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                placeholder="Enter step-by-step instructions..."
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2 space-y-2">
              <label className="block text-teal-400 font-medium">
                Recipe Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-teal-500/50
                        text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                        file:bg-teal-500 file:text-gray-900 file:font-medium
                        hover:file:bg-teal-400"
                />
                <FaCamera className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            </div>

            {/* Share Option */}
            <div className="col-span-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-teal-500"
                />
                <span className="ml-2 text-teal-400 font-medium">
                  Share this recipe publicly
                </span>
              </label>
              <p className="text-gray-400 text-sm">
                By checking this option, your recipe will be visible to the
                community.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-cyan-400
                    text-gray-900 rounded-xl font-semibold text-lg shadow-lg
                    shadow-teal-500/25 hover:shadow-teal-500/40 flex items-center justify-center gap-2"
            >
              <FaPlus /> Save Recipe
            </motion.button>

            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-8 bg-gray-700 text-gray-200 rounded-xl font-semibold
                    hover:bg-gray-600 flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancel
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RecipeForm;
