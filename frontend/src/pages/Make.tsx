import React, { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { 
  Plus, X, Download, Save, ChevronLeft, ChevronRight,
  Search, Clock, Users, Utensils, Calendar, Trash2
} from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, addDays, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

interface HeroSectionProps {
  onStartPlanning: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

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
          {/* <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-teal-500/25 to-cyan-500/25 blur-3xl transform -translate-y-1/2"
          /> */}

          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.3
              }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter"
            >
              <div className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Plan Your
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.4
              }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white"
            >
              Culinary Week
            </motion.div>
          </div>

          <motion.p
            className="text-2xl md:text-4xl text-gray-300 mb-12 mt-8 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0.6 
            }}
          >
            Create your personalized meal plans
            <br />
            <span className="text-teal-400">and explore new recipes</span>
          </motion.p>

          <motion.button
            onClick={onStartPlanning}
            className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                     font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                     hover:shadow-teal-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0.9 
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Planning
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

          {/* Decorative Elements */}
          <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          <div className="fixed top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-teal-500/50 to-transparent" />
          <div className="fixed top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Types
interface Ingredient {
  name: string; // Name of the ingredient
  quantity: string; // Quantity of the ingredient
}
interface Recipe {
  id: number; // Unique identifier for the recipe
  name: string; // Title of the recipe
  description: string; // Short description of the recipe
  ingredients: Ingredient[]; // List of ingredients
  instructions: string; // Instructions for preparing the recipe
  image: string | null; // URL of the recipe image, if available
}

interface Meal {
  owner_id: string;
  date_saved: string; //yyyy-MM-DD
  type: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe;
}

interface SavedMealPlan {
  id: string;
  name: string;
  startDate: string;
  meals: Meal[];
  createdAt: string;
}

// Fetch functions (adjust endpoints as necessary)
const fetchSavedRecipes = async () => {
  const token = localStorage.getItem("token"); // Assuming token needed
  const response = await fetch(`http://localhost:3000/api/saveRecipe?userId=${token}`);
  if (!response.ok) {
    throw new Error("Failed to fetch saved recipes");
  }
  const items = await response.json();
  console.log(items);
  return items;
};

const fetchOwnedRecipes = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3000/api/recipe?owner_id_ref=${token}`);
  if (!response.ok) {
    throw new Error("Failed to fetch owned recipes");
  }
  const items = await response.json();
  ///rename 'title' to 'name'
  items.map((item: any) => {
    item.name = item.title;
    delete item.title;
    return item;
  });
  console.log(items);
  return items;
};

// Main MealPlanner Component
const MealPlanner: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'hero' | 'planner'>('hero');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | null>(null);
  const [mealPlan, setMealPlan] = useState<{ meals: Meal[] }>({ meals: [] });
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [planName, setPlanName] = useState("");


    // Load user's meals on mount
  useEffect(() => {
      const loadMeals = async () => {
        try {
          const userMeals = await fetchMeals();
          setMealPlan({ meals: userMeals });
        } catch (error) {
          console.error("Error loading meals:", error);
          toast.error("Failed to load meals. Please try again.");
        }
      };
  
      loadMeals();
    }, []);
    
  // Queries for recipes
  const { data: savedRecipes = [] } = useQuery<Recipe[], Error>({
    queryKey: ["savedRecipes"],
    queryFn: fetchSavedRecipes
  });

  const { data: ownedRecipes = [] } = useQuery<Recipe[], Error>({
    queryKey: ["ownedRecipes"],
    queryFn: fetchOwnedRecipes
  });

  const getWeekDays = (startDate: Date) => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const getMealForDate = useCallback((date: Date, type: "breakfast" | "lunch" | "dinner"): Meal | null => {
    return mealPlan.meals.find(
      meal => meal.date_saved === formatDate(date) && meal.type === type
    ) || null;
  }, [mealPlan.meals]);

  // Handlers
  const handleAddMeal = (date: Date, type: "breakfast" | "lunch" | "dinner") => {
    setSelectedDate(date);
    setSelectedMealType(type);
    setShowRecipeModal(true);
  };

  const handleRemoveMeal = (date: Date, type: "breakfast" | "lunch" | "dinner") => {
    setMealPlan(prev => ({
      ...prev,
      meals: prev.meals.filter(
        meal => !(meal.date_saved === formatDate(date) && meal.type === type)
      ),
    }));
  };
  

  const handleSelectRecipe = (recipe: Recipe) => {
    if (selectedDate && selectedMealType) {
      const newMeal: Meal = {
        //get token from cookies
        owner_id: localStorage.getItem("token") || "",
        date_saved: formatDate(selectedDate),
        type: selectedMealType,
        recipe,
      };

      setMealPlan(prev => ({
        ...prev,
        meals: [...prev.meals.filter(
          meal => !(meal.date_saved === newMeal.date_saved && meal.type === newMeal.type)
        ), newMeal],
      }));

      setShowRecipeModal(false);
      setSelectedDate(null);
      setSelectedMealType(null);
    }
  };

  async function postMeals(meals: Meal[]): Promise<void> {
    const endpoint = 'http://localhost:3000/api/calendar';
  
    // Transform meals into the required format
    const formattedMeals = meals.map((meal) => ({
      owner_id: meal.owner_id,
      date_saved: meal.date_saved,
      type: meal.type,
      recipe_id: meal.recipe.id,
    }));
    console.log(formattedMeals);
    // Post each meal to the endpoint
    try {
      const postRequests = formattedMeals.map(async (meal) =>
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meal),
        })
      );
      await Promise.all(postRequests);
      console.log('All meals posted successfully.');
    } catch (error) {
      console.error('Error posting meals:', error);
    }
  }

  const handleSavePlan = () => {
    console.log(mealPlan.meals)
    postMeals(mealPlan.meals);
    toast.success('Meal plan saved successfully!');
  };

  const handleDeletePlan = (planId: string) => {
    setSavedMealPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const fetchMeals = async (): Promise<Meal[]> => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return [];
    }

    const response = await fetch(`http://localhost:3000/api/calendar?owner_id=${token}`);
    if (!response.ok) {
      throw new Error("Failed to fetch saved meal plans");
    }
    const meals: Meal[] = await response.json();
    return meals;
  };

  const handleLoadPlan = (plan: SavedMealPlan) => {
    fetchMeals().then((meals) => {
      setMealPlan({ meals });
    });
    setCurrentWeek(parseISO(plan.startDate));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const weekDays = getWeekDays(currentWeek);
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const addPageHeader = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(40, 116, 166); // Teal color
      doc.text(title, pageWidth / 2, 15, { align: "center" });
      doc.setDrawColor(200, 200, 200); // Light gray
      doc.line(10, 20, pageWidth - 10, 20);
      doc.setFontSize(12);
      doc.setTextColor(0);
    };
  
    const addSectionTitle = (title: string, yOffset: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(40, 116, 166);
      doc.text(title, 20, yOffset);
      doc.setTextColor(0);
      return yOffset + 10;
    };
  
    // Add Header
    addPageHeader(`Meal Plan: Week of ${format(currentWeek, "MMMM d, yyyy")}`);
    let yOffset = 30;
  
    // Weekly Schedule Section
    weekDays.forEach((date) => {
      const dateStr = formatDate(date);
      const dayMeals = mealPlan.meals.filter((meal) => meal.date_saved === dateStr);
  
      // Day Header
      yOffset = addSectionTitle(format(date, "EEEE, MMMM d"), yOffset);
  
      ["breakfast", "lunch", "dinner"].forEach((mealType) => {
        const meal = dayMeals.find((m) => m.type === mealType);
        if (meal) {
          doc.setFontSize(12);
          doc.text(
            `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${
              meal.recipe.name
            }`,
            30,
            yOffset
          );
          yOffset += 7;
        }
      });
      yOffset += 10;
  
      if (yOffset > 250) {
        doc.addPage();
        addPageHeader(`Meal Plan: Week of ${format(currentWeek, "MMMM d, yyyy")}`);
        yOffset = 30;
      }
    });
  
    // Add Recipes Section
    doc.addPage();
    addPageHeader("Recipes");
    yOffset = 30;
  
    mealPlan.meals.forEach((meal) => {
      const { recipe } = meal;
    
      // Recipe Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(40, 116, 166);
      doc.text(recipe.name, 20, yOffset);
      doc.setTextColor(0);
      yOffset += 10;
    
      // Recipe Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Description: ${recipe.description}`, 20, yOffset);
      yOffset += 10;
    
      // Ingredients Section
      yOffset = addSectionTitle("Ingredients:", yOffset);
      recipe.ingredients.forEach((ingredient) => {
      doc.setFont("helvetica", "normal");
      doc.text(`- ${ingredient.quantity} ${ingredient.name}`, 30, yOffset);
      yOffset += 7;
      });
    
      // Instructions Section
      yOffset = addSectionTitle("Instructions:", yOffset);
      const instructions = recipe.instructions.split('\n');
      instructions.forEach((instruction, index) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${index + 1}. ${instruction}`, 30, yOffset);
      yOffset += 7;
    
      if (yOffset > 250) {
        doc.addPage();
        addPageHeader("Recipes");
        yOffset = 30;
      }
      });
    
      yOffset += 10;
    
      if (yOffset > 250) {
      doc.addPage();
      addPageHeader("Recipes");
      yOffset = 30;
      }
    });
  
    // Save the PDF
    doc.save(`meal-plan-${format(currentWeek, "yyyy-MM-dd")}.pdf`);
  };
  
  // Recipe Modal Component
  const RecipeModal = () => {
    const [searchQuery, setSearchQuery] = useState("");
  
    const allRecipes = [...savedRecipes, ...ownedRecipes];
    const filteredRecipes = allRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start justify-center pt-32 p-4 z-50 overflow-y-auto"
        >
          <div className="relative w-full max-h-[90vh]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl border border-gray-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-2xl font-semibold text-white">Select Recipe</h2>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="p-6 border-b border-gray-800">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 border border-gray-700 hover:border-gray-600 transition-colors"
                  />
                </div>
              </div>
  
              {/* Recipe Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(70vh-16rem)] pr-2">
                  {filteredRecipes.map((recipe) => (
                    <button
                    key={recipe.id}
                    className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 text-left group border border-gray-700 hover:border-teal-500/50 flex items-start gap-4"
                    onClick={() => handleSelectRecipe(recipe)}
                  >
                    {/* Image on the left */}
                    <img
                      src={recipe.image || "https://via.placeholder.com/150"}
                      alt={recipe.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  
                    {/* Content on the right */}
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white group-hover:text-teal-400 transition-colors break-words">
                        {recipe.name}
                      </h4>
                      <p className="text-sm text-gray-400 break-words line-clamp-2 mt-1">
                        {recipe.description}
                      </p>
                  
                      <div className="flex items-center gap-6 text-sm text-gray-400 mt-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-gray-500" />
                          <span>{recipe.ingredients.length} ingredients</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  ))}
                  
                  {filteredRecipes.length === 0 && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">
                        No recipes found
                      </h3>
                      <p className="text-gray-400">
                        Try adjusting your search terms
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Save Modal Component
  const SaveModal: React.FC = () => (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-gray-800/90 rounded-lg p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-teal-400 mb-4">Save Meal Plan</h3>
          <input
            type="text"
            placeholder="Enter plan name..."
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600 
                     text-white mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowSaveModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePlan}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!planName.trim()}
            >
              Save Plan
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Planner Component
  const Planner: React.FC = () => (
    <div className="pt-24 p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/40 rounded-2xl border border-gray-700 shadow-xl p-12"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('hero')}
                className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 
                         hover:text-teal-400 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 
                           to-cyan-400 bg-clip-text text-transparent">
                Meal Planner
              </h1>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={generatePDF}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-700 
                         rounded-lg text-gray-200 hover:bg-gray-800 transition-colors 
                         flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button 
                onClick={() => handleSavePlan()}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r 
                         from-teal-500 to-cyan-400 text-gray-900 rounded-lg 
                         hover:opacity-90 transition-opacity flex items-center 
                         justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Plan
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              className="p-2 text-gray-400 hover:text-teal-400 transition-colors 
                       hover:bg-gray-700/50 rounded-lg"
              onClick={() => setCurrentWeek(prev => subWeeks(prev, 1))}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-medium text-teal-400">
              Week of {format(currentWeek, "MMMM d, yyyy")}
            </h2>
            
            <button
              className="p-2 text-gray-400 hover:text-teal-400 transition-colors 
                       hover:bg-gray-700/50 rounded-lg"
              onClick={() => setCurrentWeek(prev => addWeeks(prev, 1))}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left text-gray-400 w-28 text-sm sticky left-0 bg-gray-800/40 backdrop-blur-sm">
                    Time
                  </th>
                  {getWeekDays(currentWeek).map((date) => (
                    <th key={date.toISOString()} className="p-4 min-w-[200px] 
                                                         border-l border-gray-700 bg-gray-800/40 backdrop-blur-sm">
                      <div className="text-teal-400 font-medium">
                        {format(date, "EEEE")}
                      </div>
                      <div className="text-gray-400 text-sm mt-0.5">
                        {format(date, "MMMM d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["breakfast", "lunch", "dinner"].map((mealType, idx) => (
                  <tr key={mealType} className={idx !== 2 ? "border-b border-gray-700" : ""}>
                    <td className="p-4 text-left text-gray-400 capitalize font-medium 
                               text-sm sticky left-0 bg-gray-800/40 backdrop-blur-sm">
                      {mealType}
                    </td>
                    {getWeekDays(currentWeek).map((date, dayIdx) => (
                      <td key={`${date.toISOString()}-${mealType}`} 
                          className={`p-4 ${dayIdx !== 0 ? "border-l border-gray-700 bg-gray-800/40 backdrop-blur-sm" : "bg-gray-800/40 backdrop-blur-sm"}`}>
                        <MealSlot
                          date={date}
                          type={mealType as "breakfast" | "lunch" | "dinner"}
                          meal={getMealForDate(date, mealType as "breakfast" | "lunch" | "dinner")}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Saved Plans Section */}
      <SavedPlans />
    </div>
  );

  // Saved Plans Component
  const SavedPlans: React.FC = () => (
    <div className="mt-12 space-y-6 px-12">
      <h2 className="text-2xl font-bold text-teal-400">Saved Meal Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedMealPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-200">{plan.name}</h3>
                <p className="text-sm text-gray-400 mt-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(parseISO(plan.startDate), "MMMM d, yyyy")}
                </p>
              </div>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              {plan.meals.length} meals planned
            </div>
            <button
              onClick={() => handleLoadPlan(plan)}
              className="w-full px-4 py-2.5 bg-gray-700 text-teal-400 rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Load Plan
            </button>
          </motion.div>
        ))}

        {savedMealPlans.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400 bg-gray-800/20 rounded-xl border border-gray-800">
            No saved meal plans yet. Create and save your first plan!
          </div>
        )}
      </div>
    </div>
  );

  // Meal Slot Component
  const MealSlot: React.FC<{ 
    date: Date; 
    type: "breakfast" | "lunch" | "dinner"; 
    meal: Meal | null 
  }> = ({ date, type, meal }) => (
    <div className="min-h-[4.5rem] bg-gray-800/40 hover:bg-gray-800/60 transition-colors 
                   border border-gray-700 rounded-lg overflow-hidden group">
      {meal ? (
        <div className="p-4 h-full flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-200 break-words">
              {meal.recipe.name}
            </h4>
          </div>
          <button
            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 transition-all rounded-lg hover:bg-gray-700/50"
            onClick={() => handleRemoveMeal(date, type)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          className="w-full h-full flex items-center justify-center p-4 text-gray-400 
                     hover:text-teal-400 transition-colors flex-col"
          onClick={() => handleAddMeal(date, type)}
        >
          <Plus className="w-5 h-5 mb-1" />
          <span className="text-xs">Add</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Conditional Rendering: HeroSection or Planner */}
      {currentPage === 'hero' && <HeroSection onStartPlanning={() => setCurrentPage('planner')} />}
      {currentPage === 'planner' && <Planner />}

      {/* Recipe Modal */}
      <AnimatePresence>
        {showRecipeModal && <RecipeModal />}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && <SaveModal />}
      </AnimatePresence>
    </div>
  );
};

export default MealPlanner;


