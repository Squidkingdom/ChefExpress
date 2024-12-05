import React from "react";
import { motion } from "framer-motion";

// Interface representing a single ingredient in a recipe
export interface Ingredient {
  name: string; // Name of the ingredient
  quantity: string; // Quantity of the ingredient
}

// Interface representing a recipe with its details
export interface Recipe {
  id: number; // Unique identifier for the recipe
  title: string; // Title of the recipe
  description: string; // Short description of the recipe
  ingredients: Ingredient[]; // List of ingredients
  instructions: string; // Instructions for preparing the recipe
  image: string | null; // URL of the recipe image, if available
}

// Props interface for the RecipeCard component
export interface RecipeCardProps {
  recipe: Recipe; // The recipe data to display
  onClick?: () => void; // Optional click handler, e.g., for navigation or selection
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {

  const getImageSrc = (image: string | null) => {
    // If the image is a byte array stored as a string in the database
    if (image) {
      return image; // Adjust image type as needed
    }
    return ""; // Return an empty string if no image is available
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
      whileHover={{ scale: 1.02 }} // Animation on hover
      onClick={onClick} // Trigger the optional click handler if provided
    >
      {/* Display the recipe image if it exists */}
      {recipe.image && (
        <img
          src={getImageSrc(recipe.image)}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}
      {/* Recipe title */}
      <h2 className="text-2xl font-bold text-teal-400 mb-2">{recipe.title}</h2>
      {/* Recipe description */}
      <p className="text-gray-300 mb-4">{recipe.description}</p>
      {/* Ingredients section */}
      <h3 className="text-xl font-semibold text-gray-200 mb-2">Ingredients</h3>
      <ul className="list-disc list-inside mb-4 text-gray-300">
        {recipe.ingredients.map((ingredient, idx) => (
          <li key={idx}>
            {ingredient.quantity} of {ingredient.name}
          </li>
        ))}
      </ul>
      {/* Instructions section */}
      <h3 className="text-xl font-semibold text-gray-200 mb-2">Instructions</h3>
      <p className="text-gray-300 whitespace-pre-line">{recipe.instructions}</p>
    </motion.div>
  );
};

export default RecipeCard;
