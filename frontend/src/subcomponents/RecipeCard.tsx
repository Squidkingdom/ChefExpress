import React from "react";
import { motion } from "framer-motion";

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string | null;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void; // Optional click handler, e.g., for navigation or selection
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-2xl font-bold text-teal-400 mb-2">{recipe.title}</h2>
      <p className="text-gray-300 mb-4">{recipe.description}</p>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">Ingredients</h3>
      <ul className="list-disc list-inside mb-4 text-gray-300">
        {recipe.ingredients.map((ingredient, idx) => (
          <li key={idx}>
            {ingredient.quantity} of {ingredient.name}
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">Instructions</h3>
      <p className="text-gray-300 whitespace-pre-line">{recipe.instructions}</p>
    </motion.div>
  );
};

export default RecipeCard;
