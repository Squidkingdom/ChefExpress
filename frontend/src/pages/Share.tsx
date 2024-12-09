/***************************************************************************************************
 * Name of code artifact: Share.tsx
 * Brief description of what the code does:
 *   This file defines the Share component for the ChefExpress application. It provides a hero section 
 *   and a selection menu where users can either share their own recipes with the community or explore 
 *   community recipes. Users can create a new recipe by adding ingredients, instructions, and an image, 
 *   and then submit it to be saved to the backend. It also integrates a recipes explorer where users 
 *   can browse community recipes. Framer Motion animations, toast notifications, and transitions 
 *   enhance the user experience.
 * Programmer’s name: Brady, Darshil
 * Date the code was created: 11/14/24
 * Dates the code was revised: 12/8/24
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Integrated recipe creation, community recipe exploration, and improved 
 *   UI/UX with animations and toasts.
 * Preconditions:
 *   - React environment set up.
 *   - Backend endpoints for creating recipes (`http://localhost:3000/api/recipe`) and fetching recipes.
 *   - Framer Motion, React Query, react-toastify, and required dependencies installed.
 * Acceptable and unacceptable input values or types:
 *   - User must provide a recipe name, description, at least one ingredient, instructions, and an image to share a recipe.
 *   - For exploring recipes, no specific input is required, just browsing.
 * Postconditions:
 *   - Users can successfully submit a new recipe, which is saved to the backend.
 *   - Users can also navigate to explore community recipes.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If recipe creation fails, a toast error is shown.
 *   - If no recipes are found, descriptive messages are displayed.
 * Side effects:
 *   - Mutating the backend by creating a new recipe.
 *   - Invalidating React Query cache to refresh recipe lists.
 * Invariants:
 *   - The navigation between hero, selection, share form, and explore is consistent.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - ShareHeroSection: Initial hero section encouraging user to start contributing recipes.
 *   - SelectionView: Menu where users can choose to share a recipe or explore existing ones.
 *   - ShareForm: Form to create and submit a new recipe, including ingredient management and image upload.
 *   - Explore: Displays the community recipes using the Recipes component.
 *   - Main Share component: Manages view state and integrates all parts together.
 * Comments on every line are provided inline below.
 ***************************************************************************************************/

// Import necessary libraries and hooks
import React, { useState, ChangeEvent, KeyboardEvent, useRef } from "react";
import {
  FaPlus,
  FaImage,
  FaArrowLeft,
  FaCompass,
  FaPencilAlt,
  FaArrowRight,
} from "react-icons/fa";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Recipe, Ingredient } from "../subcomponents/RecipeCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipes } from "../components/Recipes";

// Define the different views within the Share component
type View = "hero" | "selection" | "share" | "explore";

// API function to create a new recipe
async function createRecipe(recipe: Recipe, image: File) {
  const formData = new FormData();
  formData.append("title", recipe.title);
  formData.append("description", recipe.description);
  formData.append("instructions", recipe.instructions);
  formData.append("ingredients", JSON.stringify(recipe.ingredients));
  formData.append("image", image);

  const response = await fetch("http://localhost:3000/api/recipe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error creating recipe");
  }

  return response.json();
}

// Hero section encouraging user to start sharing recipes
interface ShareHeroSectionProps {
  onStartSharing: () => void;
}
const ShareHeroSection: React.FC<ShareHeroSectionProps> = ({ onStartSharing }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothY, opacity, scale }}
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", damping: 20 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
        />

        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
            Share Your
          </span>
          <br />
          <span className="text-white">Culinary Magic</span>
        </motion.h1>

        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Inspire others with your recipes
          <br />
          <span className="text-teal-400">and explore our community recipes</span>
        </motion.p>

        <motion.button
          onClick={onStartSharing}
          className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                   font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                   hover:shadow-teal-500/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Contributing
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight className="w-6 h-6" />
            </motion.span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                        opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Selection view to either explore recipes or share a new one
interface SelectionViewProps {
  onSelect: (view: View) => void;
}
const SelectionView: React.FC<SelectionViewProps> = ({ onSelect }) => {
  const options = [
    {
      icon: FaCompass,
      title: "Explore Recipes",
      description: "Discover amazing recipes from the community",
      gradient: "from-violet-500 to-purple-400",
      color: "text-violet-400",
      bgColor: "bg-violet-400",
      features: [
        "Browse community recipes",
        "Save your favorites",
        "Leave comments and ratings",
        "Share with friends",
      ],
      view: "explore" as const,
    },
    {
      icon: FaPencilAlt,
      title: "Share Recipe",
      description: "Share your culinary masterpiece with the world",
      gradient: "from-teal-500 to-emerald-400",
      color: "text-teal-400",
      bgColor: "bg-teal-400",
      features: [
        "Step-by-step instructions",
        "Ingredient management",
        "Upload photos",
        "Privacy controls",
      ],
      view: "share" as const,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.view)}
            className="group relative overflow-hidden rounded-2xl focus:outline-none text-left"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${option.gradient} 
                opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
            />
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm opacity-0 
              group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 backdrop-blur-sm bg-gray-800/60 border 
              border-gray-700/50 p-6 h-full rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.gradient} 
                      blur-xl opacity-50 rounded-full`}
                  />
                  <div className="relative p-3 bg-gray-800/80 rounded-full">
                    <option.icon
                      className={`text-2xl ${option.color}`}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`text-xl font-bold ${option.color} mb-2`}>
                  {option.title}
                </h3>
                <p className="text-gray-300">{option.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                {option.features?.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="flex items-center gap-2 text-gray-400"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${option.bgColor}`}
                    />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="flex items-center gap-2 text-gray-300"
                whileHover={{ x: 5 }}
              >
                <span className="font-medium text-sm">Get Started</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaArrowRight size={12} />
                </motion.div>
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ShareForm component for creating and sharing a new recipe
const ShareForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
  const queryClient = useQueryClient();
  const ingredientNameRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!selectedImage) {
        return Promise.reject(new Error("No image selected"));
      }
      return createRecipe(formData, selectedImage);
    },
    onSuccess: () => {
      toast.success("Recipe shared successfully!");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      resetForm();
      onBack();
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Failed to share recipe. Please try again.");
    },
  });

  const resetForm = () => {
    setFormData({
      id: 0,
      title: "",
      description: "",
      ingredients: [],
      instructions: "",
      image: null,
    });
    setSelectedImage(null);
    setNewIngredient({ name: "", quantity: "" });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient],
      });
      setNewIngredient({ name: "", quantity: "" });
      quantityRef.current?.focus();
    } else {
      toast.error("Please complete all ingredient fields.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: 'quantity' | 'name') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'quantity') {
        ingredientNameRef.current?.focus();
      } else if (field === 'name' && newIngredient.quantity && newIngredient.name) {
        handleAddIngredient();
      }
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleShareRecipe = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.instructions ||
      formData.ingredients.length === 0 ||
      !selectedImage
    ) {
      toast.error("Please complete all fields and upload an image.");
      return;
    }

    mutation.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-24"
    >
      <motion.section
        className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div className="mb-8 text-center">
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Share Your Recipe
          </motion.h2>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Fill in the details to share your culinary masterpiece
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          <div className="group">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Recipe Title"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
            />
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
              rows={3}
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-3">
              <input
                ref={quantityRef}
                type="text"
                name="quantity"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, 'quantity')}
                placeholder="Quantity (e.g., 1 diced)"
                className="w-48 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <input
                ref={ingredientNameRef}
                type="text"
                name="name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, 'name')}
                placeholder="Ingredient"
                className="flex-grow px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddIngredient}
                className="px-4 py-3 bg-teal-500 text-gray-900 rounded-xl hover:bg-teal-400 transition-colors duration-200"
              >
                <FaPlus className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.ul className="mt-3 space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 text-gray-300 bg-gray-800/30 px-4 py-2 rounded-lg"
                >
                  <span className="flex-grow">
                    {ingredient.quantity} {ingredient.name}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveIngredient(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-400 transition-all duration-200"
                  >
                    Remove
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Instructions"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-4">
            <motion.label
              className="flex-1 flex items-center gap-4 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-900/70 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaImage className="text-2xl text-teal-400" />
              <span className="text-gray-400">
                {selectedImage ? selectedImage.name : "Upload an image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </motion.label>
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareRecipe}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 rounded-xl hover:from-teal-400 hover:to-cyan-300 transition-all duration-200"
            >
              Share Recipe
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

// Explore component for browsing community recipes
const Explore: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-24"
    >
      <div className="relative mb-12">
        <motion.button
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors duration-200 leading-none"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Menu</span>
        </motion.button>

        <motion.h2
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
            Community Recipes
          </span>
        </motion.h2>
      </div>
      <Recipes />
    </motion.div>
  );
};

// Main Share component managing state and transitions
const Share: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("hero");

  const handleStartSharing = () => {
    setCurrentView("selection");
  };

  const handleSelect = (view: View) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView("selection");
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),transparent_60%)]" />
        </div>
      </div>

      <div className="relative z-10">
        <ToastContainer position="top-right" autoClose={3000} />

        <AnimatePresence mode="wait">
          {currentView === "hero" && (
            <ShareHeroSection onStartSharing={handleStartSharing} />
          )}
          {currentView === "selection" && (
            <SelectionView onSelect={handleSelect} />
          )}
          {currentView === "share" && <ShareForm onBack={handleBack} />}
          {currentView === "explore" && (
            <Explore onBack={() => setCurrentView("selection")} />
          )}
        </AnimatePresence>

        {/* Decorative lines */}
        <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
        <div className="fixed top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-teal-500/50 to-transparent" />
        <div className="fixed top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
      </div>
    </div>
  );
};

export default Share;
