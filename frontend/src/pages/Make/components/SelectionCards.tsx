// src/components/SelectionCards.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaPencilAlt, FaCalendarAlt, FaBook, FaArrowRight,
  FaUtensils, FaClock, FaHeart, FaBookmark,
  FaClipboardList, FaShareAlt, FaMagic, FaRegLightbulb,
  FaGlobe, FaCompass
} from 'react-icons/fa';
import type { SelectionOption } from '../types';

interface SelectionCardsProps {
  onSelect: (view: string) => void;
  recipesCount: number;
}

const SelectionCards: React.FC<SelectionCardsProps> = ({ onSelect, recipesCount }) => {
  const options: SelectionOption[] = [
    {
      icon: FaPencilAlt,
      secondaryIcon: FaMagic,
      title: "Create Recipe",
      description: "Design and document your culinary creations",
      action: () => onSelect("create"),
      gradient: "from-teal-500 to-emerald-400",
      features: [
        "Step-by-step instructions",
        "Ingredient management",
        "Share options",
        "Privacy controls"
      ],
      color: "text-teal-400",
    },
    {
      icon: FaCompass,
      secondaryIcon: FaGlobe,
      title: "Explore Recipes",
      description: "Discover amazing recipes from the community",
      action: () => onSelect("explore"),
      gradient: "from-violet-500 to-purple-400",
      features: [
        "Community recipes",
        "Save favorites",
        "Interact & comment",
        "Share discoveries"
      ],
      color: "text-violet-400",
    },
    {
      icon: FaCalendarAlt,
      secondaryIcon: FaClock,
      title: "Meal Planner",
      description: "Organize your weekly meals efficiently",
      action: () => onSelect("planner"),
      gradient: "from-cyan-500 to-blue-400",
      features: [
        "Weekly planning",
        "Flexible scheduling",
        "Shopping lists",
        "Nutritional tracking"
      ],
      color: "text-cyan-400",
    },
    {
      icon: FaBook,
      secondaryIcon: FaBookmark,
      title: "Recipe Collection",
      description: "Browse and manage your saved recipes",
      action: () => onSelect("view"),
      gradient: "from-pink-500 to-rose-400",
      features: [
        "Private & public recipes",
        "Quick search",
        "Favorites",
        "Share options"
      ],
      color: "text-pink-400",
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mb-16"
    >
      {options.map((option, index) => (
        <motion.button
          key={index}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={option.action}
          className="group relative overflow-hidden rounded-2xl focus:outline-none"
          aria-label={option.title}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
          />

          {/* Card Content */}
          <div className="relative z-10 backdrop-blur-sm bg-gray-800/60 border border-gray-700/50 p-6 h-full rounded-2xl flex flex-col">
            {/* Icon and Title */}
            <div className="flex items-center mb-4">
              <div className="relative mr-4">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.gradient} blur-xl opacity-50 rounded-full`}
                />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-800">
                  <option.icon
                    className={`text-2xl ${option.color}`}
                  />
                </div>
              </div>
              <h3
                className={`text-xl font-bold ${option.color}`}
              >
                {option.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4 flex-grow">{option.description}</p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {option.features?.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <FaRegLightbulb className="text-sm text-gray-300" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              {option.title === "Recipe Collection" && recipesCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-700/50 px-3 py-1 rounded-full text-sm text-gray-300"
                >
                  {recipesCount} recipes
                </motion.div>
              )}
              <motion.div
                className="flex items-center gap-2 text-gray-300 ml-auto"
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
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SelectionCards;
