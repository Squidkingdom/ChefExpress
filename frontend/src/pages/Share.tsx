import React, { useState, ChangeEvent } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecipeCard, { Recipe, Ingredient } from "../subcomponents/RecipeCard";
import { useQuery } from "@tanstack/react-query";
import { Recipes } from "../components/Recipes";

/**
 * Share Page
 * Allows users to share their culinary creations and interact with others.
 * Updated to work with the guided tour.
 * @returns {React.JSX.Element} - The Share page component.
 */
const Share: React.FC = () => {

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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle input change for recipe details
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding an ingredient
  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient],
      });
      setNewIngredient({ name: "", quantity: ""});
    } else {
      toast.error("Please complete all ingredient fields.");
    }
  };

  // Handle new ingredient input
  const handleIngredientInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
  };

  // Handle sharing a recipe
  const handleShareRecipe = () => {
    // if (
    //   formData.title &&
    //   formData.description &&
    //   formData.ingredients.length > 0 &&
    //   formData.instructions &&
    //   selectedImage
    // ) {
    //   const newRecipe: Recipe = {
    //     ...formData,
    //     id: sharedRecipes.length + 1,
    //     image: URL.createObjectURL(selectedImage),
    //   };
    //   setSharedRecipes([newRecipe, ...sharedRecipes]);
    //   setFormData({
    //     id: 0,
    //     title: "",
    //     description: "",
    //     ingredients: [],
    //     instructions: "",
    //     image: null,
    //   });
    //   setSelectedImage(null);
    //   toast.success("Your recipe has been shared!");
    // } else {
    //   toast.error("Please fill in all the fields and upload an image.");
    // }
  };

  return (
    <div className="share-page min-h-screen bg-gray-900 text-gray-100 py-10">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <header
        className="text-center py-24 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/share-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold text-teal-400 mb-4">
            Share Your Culinary Creations!
          </h1>
          <p className="text-xl text-gray-200">
            Upload your recipes and inspire the community.
          </p>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Upload Recipe Section */}
        <section className="w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md mb-16">
          <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">
            Share a Recipe
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Recipe Title"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            ></textarea>
            <div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  name="name"
                  value={newIngredient.name}
                  onChange={handleIngredientInput}
                  placeholder="Ingredient"
                  className="flex-grow px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
                <input
                  type="text"
                  name="quantity"
                  value={newIngredient.quantity}
                  onChange={handleIngredientInput}
                  placeholder="Quantity"
                  className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
                />
                
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-teal-500 text-gray-900 rounded-md hover:bg-teal-400"
                >
                  Add Ingredient
                </button>
              </div>
              <ul className="list-disc list-inside mt-2 text-gray-300">
                {formData.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Instructions"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={4}
            ></textarea>
            <div className="flex items-center">
              <label className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-400">
                <FaPlus className="text-2xl text-gray-900" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="ml-4 text-gray-300">
                {selectedImage ? selectedImage.name : "Upload an image"}
              </p>
            </div>
            <button
              onClick={handleShareRecipe}
              className="w-full bg-teal-500 text-gray-900 py-3 rounded-full hover:bg-teal-400"
            >
              Share Recipe
            </button>
          </div>
        </section>

        {/* Shared Recipes Section */}
        <section>
          <h2 className="text-4xl font-bold text-center text-teal-400 mb-12">
            Community Recipes
          </h2>
          <Recipes/>
        </section>
      </div>
    </div>
  );
};

export default Share;
