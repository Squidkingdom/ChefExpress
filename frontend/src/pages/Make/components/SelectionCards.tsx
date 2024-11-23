import React from 'react';
import { motion } from 'framer-motion';
import {
  FaPencilAlt, FaCalendarAlt, FaBook, FaArrowRight,
  FaUtensils, FaClock, FaHeart, FaBookmark,
  FaClipboardList, FaShare, FaMagic, FaRegLightbulb,
  FaGlobe, FaCompass, FaFire, FaStar
} from 'react-icons/fa';
import type { SelectionOption } from '../types';

interface SelectionCardsProps {
  onSelect: (view: string) => void;
  recipesCount: number;
  publicRecipesCount?: number;
}

const SelectionCards: React.FC<SelectionCardsProps> = ({ 
  onSelect, 
  recipesCount,
  publicRecipesCount = 0 
}) => {
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
      stats: null
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
      stats: publicRecipesCount ? [
        { icon: FaFire, label: "Trending", value: publicRecipesCount },
        { icon: FaStar, label: "Most Liked", value: Math.floor(publicRecipesCount * 0.7) }
      ] : null
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
      stats: null
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
      stats: recipesCount > 0 ? [
        { icon: FaUtensils, label: "Total", value: recipesCount },
        { icon: FaShare, label: "Shared", value: Math.floor(recipesCount * 0.3) }
      ] : null
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 mb-16"
    >
      {options.map((option, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={option.action}
          className="group relative overflow-hidden rounded-2xl focus:outline-none text-left"
        >
          {/* Background Effects */}
          <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} 
            opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />

          {/* Card Content */}
          <div className="relative z-10 backdrop-blur-sm bg-gray-800/60 border 
            border-gray-700/50 p-6 h-full rounded-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} 
                    blur-xl opacity-50 rounded-full`} />
                  <div className="relative p-3 bg-gray-800/80 rounded-full">
                    <option.icon className={`text-2xl ${option.color}`} />
                  </div>
                </div>
                {option.secondaryIcon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2 bg-gray-800/80 rounded-full"
                  >
                    <option.secondaryIcon className={`text-xl ${option.color}`} />
                  </motion.div>
                )}
              </div>

              {/* Stats Badge */}
              {option.stats && (
                <div className="flex gap-4">
                  {option.stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 bg-gray-800/80 px-3 py-1 
                        rounded-full text-sm"
                    >
                      <stat.icon className={option.color} />
                      <span className="text-gray-300">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="mb-6">
              <h3 className={`text-xl font-bold ${option.color} mb-2`}>
                {option.title}
              </h3>
              <p className="text-gray-300">
                {option.description}
              </p>
            </div>

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
                  <FaRegLightbulb className={`text-sm ${option.color}`} />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
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
    </motion.div>
  );
};

export default SelectionCards;