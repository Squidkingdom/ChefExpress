/***************************************************************************************************
 * Name of code artifact: HeroSection.tsx
 * Brief description of what the code does:
 *   This file defines a HeroSection component that renders a visually stunning hero area 
 *   for a kitchen tools e-commerce site. The hero section includes dynamic animations based on 
 *   scroll position, a heading, a subheading, and a call-to-action button to start shopping. 
 *   As the user scrolls, the hero smoothly scales, fades, and moves, adding a parallax-like effect.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/14/24
 * Dates the code was revised: 12/2/24
 * Brief description of each revision & author:
 *   12/2/24 - Darshil Patel: Updated the hero text to focus on kitchen tools, improved 
 *   animations for a smoother visual experience, and integrated a "Start Shopping" call-to-action.
 * Preconditions:
 *   - React environment must be set up.
 *   - framer-motion and react-icons must be installed.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `onStartShopping`: A function prop. Must be a valid callback that initiates 
 *     the shopping experience. Null or non-function values are not acceptable.
 * Postconditions:
 *   - Renders a hero section that responds to scroll and provides a visually engaging entry 
 *     point to the website.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If `onStartShopping` is not provided or is not a function, the button won't function 
 *     as intended.
 * Side effects:
 *   - Animations triggered by scroll events.
 * Invariants:
 *   - The hero layout and text remain consistent, only animations and scrolling effects change.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - useScroll, useTransform, and useSpring from framer-motion: create smooth 
 *     scroll-based animations for the hero section.
 *   - Headings and paragraphs emphasize premium kitchen tools.
 *   - Animated call-to-action button encourages users to start shopping.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and framer-motion hooks
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// Import icon from react-icons
import { FaArrowRight } from "react-icons/fa";

// Props interface for HeroSection
interface HeroSectionProps {
  onStartShopping: () => void; // Callback to begin shopping
}

/**
 * HeroSection component:
 * Renders an animated hero banner that visually responds to scrolling, showing a large title,
 * a supporting subtitle, and a button to initiate the shopping flow.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onStartShopping }) => {
  // Use scroll hooks for dynamic animations based on scrollY
  const { scrollY } = useScroll();
  // Translate scrollY values into y, opacity, scale transforms
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  return (
    // Outer container applying transforms for parallax-like effect
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothY, opacity, scale }}
    >
      {/* Inner content container with fade-in/slide-up initial animation */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", damping: 20 }}
      >
        {/* Subtle glowing gradient background animation behind text */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
        />

        {/* Main heading with gradient text */}
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
            Professional{" "}
          </span>
          <br />
          <span className="text-white">Kitchen Tools</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Equip your kitchen with premium quality tools
          <br />
          <span className="text-teal-400">crafted for perfection</span>
        </motion.p>

        {/* Call-to-action button */}
        <motion.button
          onClick={onStartShopping}
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
            Start Shopping
            {/* Arrow icon with subtle horizontal wiggle */}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight className="w-6 h-6" />
            </motion.span>
          </span>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                        opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
