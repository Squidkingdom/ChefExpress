/***************************************************************************************************
 * Name of code artifact: CategoryFilters.tsx
 * Brief description of what the code does:
 *   This component renders a set of category filter buttons to allow users to filter products 
 *   or items by category. The categories are displayed as buttons with icons and transitions. 
 *   Selecting a category updates the currently selected category in the parent component.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added animations for hover and tap states, integrated icons, and 
 *   improved styling for a more intuitive UI.
 * Preconditions:
 *   - Must be used in a React environment.
 *   - Parent component must provide `selectedCategory` state and a `setSelectedCategory` method.
 * Acceptable and unacceptable input values or types:
 *   - `selectedCategory`: string or null. If null, "All" is considered selected.
 *   - `setSelectedCategory`: function that takes a string or null to update the category.
 * Postconditions:
 *   - Displays category buttons and updates the selected category state in the parent on click.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - None, as long as `selectedCategory` and `setSelectedCategory` are provided correctly.
 * Side effects:
 *   - Clicking a button calls `setSelectedCategory` to change state in parent.
 * Invariants:
 *   - Category list remains constant: All, Tools, Utensils, Cookware.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - categories array: Defines category data including icons.
 *   - Mapping over categories: Creates a button for each category.
 *   - Conditional styling: Changes button appearance if selected.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and motion for animations
import React from "react";
import { motion } from "framer-motion";
// Import icons for categories
import { ShoppingCart, Tool, Utensils, Flame } from "lucide-react";
// Import animation variants for staggered, fade-up animations
import { staggerContainer, fadeInUp } from "../utils/animations";

interface CategoryFiltersProps {
  selectedCategory: string | null; // Currently selected category or null for "All"
  setSelectedCategory: (category: string | null) => void; // Setter function for selected category
}

/**
 * CategoryFilters component:
 * Displays a row of buttons for filtering items by category. 
 * Each button shows an icon and category name. The "All" category is considered selected if 
 * `selectedCategory` is null. Animations and gradient effects enhance interactivity.
 */
export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  // Define available categories including "All"
  const categories = [
    { id: "all", name: "All", icon: ShoppingCart },
    { id: "Tools", name: "Tools", icon: Tool },
    { id: "Utensils", name: "Utensils", icon: Utensils },
    { id: "Cookware", name: "Cookware", icon: Flame },
  ];

  return (
    // Container with staggered animation for child elements
    <motion.div
      className="flex flex-wrap gap-4 justify-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => {
        const Icon = category.icon;
        // Determine if this category is currently selected
        const isSelected =
          selectedCategory === null
            ? category.id === "all"
            : selectedCategory === category.name;

        return (
          <motion.button
            key={category.id}
            // On click, set category to null if "All" is clicked, otherwise set chosen category
            onClick={() =>
              setSelectedCategory(category.id === "all" ? null : category.name)
            }
            className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 
              ${
                isSelected
                  ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}   // Slight scale on hover
            whileTap={{ scale: 0.95 }}     // Slight shrink on tap
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 
                          blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 text-lg">
              {/* Category icon */}
              <Icon className="w-5 h-5" />
              {/* Category name */}
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};


// import React from "react";
// import { motion } from "framer-motion";
// import { ShoppingCart, Tool, Utensils, Flame } from "lucide-react";
// import { staggerContainer, fadeInUp } from "../utils/animations";

// interface CategoryFiltersProps {
//   selectedCategory: string | null;
//   setSelectedCategory: (category: string | null) => void;
// }

// export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
//   selectedCategory,
//   setSelectedCategory,
// }) => {
//   const categories = [
//     { id: "all", name: "All", icon: ShoppingCart },
//     { id: "Tools", name: "Tools", icon: Tool },
//     { id: "Utensils", name: "Utensils", icon: Utensils },
//     { id: "Cookware", name: "Cookware", icon: Flame },
//   ];

//   return (
//     <motion.div
//       className="flex flex-wrap gap-4 justify-center"
//       variants={staggerContainer}
//       initial="hidden"
//       animate="visible"
//     >
//       {categories.map((category) => {
//         const Icon = category.icon;
//         const isSelected =
//           selectedCategory === null
//             ? category.id === "all"
//             : selectedCategory === category.name;

//         return (
//           <motion.button
//             key={category.id}
//             onClick={() =>
//               setSelectedCategory(category.id === "all" ? null : category.name)
//             }
//             className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 
//               ${
//                 isSelected
//                   ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
//                   : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
//               }`}
//             variants={fadeInUp}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 
//                           blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             <span className="relative flex items-center gap-2 text-lg">
//               <Icon className="w-5 h-5" />
//               {category.name}
//             </span>
//           </motion.button>
//         );
//       })}
//     </motion.div>
//   );
// };