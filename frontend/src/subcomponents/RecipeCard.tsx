/**
 * Name: RecipeCard Component
 * Description:  
 * The RecipeCard component displays a styled recipe card with interactive elements such as hover 
 * animations and a modal trigger. It shows the recipe's title, description, image, cooking time, 
 * difficulty, servings, and visual cues for "favorite" and "public" statuses. The card opens a modal 
 * with more details when clicked.
 * 
 * Programmer's name: Brady, Darshil
 * Date the code was created: 11/24/24
 * Date the code was revised: 12/8/24
 * 
 * Preconditions:
 *   - A valid `recipe` object must be passed to the component as a prop.
 *   - The `recipe` object must include fields such as `title`, `description`, `image`, `cookTime`, 
 *     `difficulty`, `servings`, `isPublic`, and `favorite`. Optional fields may be missing.
 * 
 * Acceptable input values or types:
 *   - `recipe`: An object of type `Recipe` (defined elsewhere in the project).
 *   - `recipe.title`: String, the title of the recipe.
 *   - `recipe.description`: String, a description of the recipe.
 *   - `recipe.image`: Optional string URL of the recipe image.
 *   - `recipe.cookTime`: Optional string representing cooking time.
 *   - `recipe.difficulty`: Optional string indicating the recipe's difficulty level.
 *   - `recipe.servings`: Optional number of servings.
 *   - `recipe.isPublic`: Optional boolean indicating if the recipe is public.
 *   - `recipe.favorite`: Optional boolean indicating if the recipe is a favorite.
 * 
 * Postconditions:
 *   - When the card is clicked, the `isModalOpen` state is set to `true`, which triggers the modal to open.
 * 
 * Return values or types:
 *   - This component returns JSX for rendering the recipe card, with interactive elements and animations.
 * 
 * Error and exception condition values:
 *   - If the `recipe` object is missing required fields (e.g., `title` or `description`), the component
 *     may render incomplete or incorrect UI.
 * 
 * Side effects:
 *   - Clicking on the recipe card opens a modal that displays additional details about the recipe.
 *   - CSS classes and animation libraries are used to create hover effects and transitions.
 * 
 * Invariants:
 *   - The card layout and hover animation should display consistently when valid data is provided.
 * 
 * Known faults:
 *   - No known faults identified at this time.
 */


// src/components/RecipeCard/index.tsx

// Importing necessary dependencies from React, framer-motion, react-toastify, and react-query
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

// Types & Interfaces
// Defining the structure of an ingredient object with optional unit
export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
}

// Defining the structure of a recipe object, including optional properties for cook time, difficulty, servings, and favorite status
export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string | null;
  cookTime?: string;
  difficulty?: string;
  servings?: number;
  favorite?: boolean;
  isPublic?: boolean;
}

// Recipe Meta Item Component
// This component is used to display individual metadata items (like cook time, difficulty, and servings) in the modal
interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// MetaItem displays a small metadata item with an icon, label, and value (used in the RecipeModal)
const MetaItem: React.FC<MetaItemProps> = ({ icon, label, value }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm text-gray-200">{value}</div>
      </div>
    </div>
  </div>
);

// Async function to toggle the favorite status of a recipe
// If the user is not logged in, it will show an error
async function toggleFavorite(recipeId: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to favorite a recipe");
    return;
  }

  // Making a POST request to toggle the favorite status of a recipe on the server
  const response = await fetch(`http://localhost:3000/api/recipe/toggleFavorite?recipe_id=${recipeId}&owner_id_ref=${token}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle favorite");
  }

  return response.json();
}

// Recipe Modal Component
// This component displays a modal with detailed information about a recipe, including an option to toggle its favorite status
const RecipeModal: React.FC<{
  recipe: Recipe; // The recipe to display
  onClose: () => void; // Function to close the modal
}> = ({
  recipe,
  onClose,
}) => {
  // useQueryClient is used for refetching queries after the favorite state is toggled
  const queryClient = useQueryClient();

  // Handle the toggle favorite action
  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(recipe.id);
      toast.success(recipe.favorite ? "Recipe unfavorited!" : "Recipe favorited!");
      // Invalidate queries to refetch updated favorite state
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["u_recipes"] });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to toggle favorite. Please try again.");
    }
  };

  return (
    // Modal container with backdrop blur effect
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose} // Close the modal if the backdrop is clicked
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gray-900/90 backdrop-blur-xl w-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden border border-gray-700/50 flex"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside the modal
      >
        {/* Left Side - Image */}
        <div className="w-2/5 relative">
          {recipe.image ? (
            // Display recipe image if available
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            // Display a fallback color block if no image is available
            <div className="w-full h-full bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50" />
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 flex flex-col h-[80vh] overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                          bg-clip-text text-transparent mb-2">
              {recipe.title}
            </h2>
            <p className="text-gray-300">{recipe.description}</p>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose} // Trigger onClose function when the button is clicked
            aria-label="Close" // Accessibility label
            className="absolute top-4 right-4 p-2 bg-red-600 rounded-full 
                      text-white hover:bg-red-700 focus:outline-none focus:ring-2 
                      focus:ring-red-500 transition-colors duration-200"
          >
            {/* Close icon (X) */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Recipe Meta */}
            <div className="grid grid-cols-3 gap-3">
              {recipe.cookTime && (
                <MetaItem
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                    </svg>
                  }
                  label="Cook Time"
                  value={recipe.cookTime}
                />
              )}
              {recipe.difficulty && (
                <MetaItem
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                    </svg>
                  }
                  label="Difficulty"
                  value={recipe.difficulty || 'N/A'}
                />
              )}
              {recipe.servings && (
                <MetaItem
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  }
                  label="Servings"
                  value={`${recipe.servings} servings`}
                />
              )}
            </div>

            {/* Two Column Layout for Ingredients and Instructions */}
            <div className="grid grid-cols-2 gap-6">
              {/* Ingredients Column */}
              <div>
                <h3 className="text-lg font-semibold text-teal-400 mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm rounded-lg p-2 
                               border border-gray-700/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-teal-400" />
                      <span className="text-sm text-gray-300">
                        {ingredient.quantity} {ingredient.unit ? `${ingredient.unit} ` : ""}{ingredient.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Instructions Column */}
              <div>
                <h3 className="text-lg font-semibold text-teal-400 mb-3">Instructions</h3>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="text-sm text-gray-300 whitespace-pre-line">
                    {recipe.instructions}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700/50">
              {/* Button to toggle favorite status */}
              <motion.button
                onClick={handleToggleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl font-medium flex items-center gap-2
                          bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors
                          backdrop-blur-sm border border-teal-500/20"
              >
                {recipe.favorite ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Unfavorite
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                    Favorite
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main RecipeCard Component
interface RecipeCardProps {
  recipe: Recipe; // Recipe object passed as a prop
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, // Destructure recipe from props
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false); // State to manage modal visibility

  return (
    <>
      {/* Main card container with hover effects and gradient border */}
      <motion.div
        className="group relative w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                  rounded-2xl overflow-hidden cursor-pointer hover:bg-gray-800/70 transition-all duration-300"
        onClick={() => setIsModalOpen(true)} // Open modal on click
        whileHover={{ scale: 1.02 }} // Hover scale effect
        whileTap={{ scale: 0.98 }} // Tap scale effect
      >
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 p-[1px] rounded-2xl bg-gradient-to-br from-teal-500/30 
                      via-cyan-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-stretch h-48">
          {/* Image display section, shows recipe image if available */}
          {recipe.image && (
            <div className="relative w-48 flex-shrink-0 overflow-hidden">
              <img
                src={recipe.image} // Recipe image source
                alt={recipe.title} // Image alt text
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Image styling and hover scale effect
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/20" />
            </div>
          )}

          {/* Recipe details section */}
          <div className="flex-1 p-6 min-w-0">
            <div className="flex items-start justify-between gap-4">
              {/* Recipe title and description */}
              <div className="min-w-0">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                             bg-clip-text text-transparent mb-2 truncate">
                  {recipe.title} {/* Display recipe title */}
                </h3>
                <p className="text-gray-300 line-clamp-2">{recipe.description}</p> {/* Display description with line clamp */}
              </div>
              
              {/* Section for recipe's status (Public or Favorite) */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {recipe.isPublic && (
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </div>
                )}
                {recipe.favorite && (
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Meta information about the recipe (cook time, difficulty, servings) */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
              {recipe.cookTime && (
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-teal-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                    </svg>
                  </div>
                  <span>{recipe.cookTime}</span> {/* Display cook time */}
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-teal-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                    </svg>
                  </div>
                  <span>{recipe.difficulty}</span> {/* Display difficulty level */}
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-teal-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                  <span>{recipe.servings} servings</span> {/* Display servings */}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal for recipe details */}
      <AnimatePresence>
        {isModalOpen && (
          <RecipeModal
            recipe={recipe} // Pass recipe to modal
            onClose={() => setIsModalOpen(false)} // Close modal on close button click
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RecipeCard;
