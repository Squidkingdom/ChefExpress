/***************************************************************************************************
 * Name of code artifact: HeroSection.tsx
 * Brief description of what the code does:
 *   This file defines a HeroSection component that displays a visually striking, animated hero 
 *   area with a heading, subtitle, and a call-to-action button. As the user scrolls, the hero section 
 *   smoothly scales, fades, and moves, giving a dynamic feel. The "Start Learning" button triggers 
 *   a callback to begin the learning process.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/2/24
 * Dates the code was revised: 11/9/24
 * Brief description of each revision & author:
 *   11/9/24 - Brady Holland: Improved animations, added a glowing gradient effect, and refined the 
 *   scaling and opacity transitions tied to scroll.
 * Preconditions:
 *   - React environment must be set up.
 *   - framer-motion and react-icons libraries must be installed.
 * Acceptable input values or types:
 *   - `onStartLearning`: A function that initiates the learning process when the button is clicked.
 * Unacceptable input values or types:
 *   - `onStartLearning` not being a function would break the intended functionality.
 * Postconditions:
 *   - Renders a hero section with animated elements and a call-to-action button that invokes 
 *     `onStartLearning`.
 * Return values or types:
 *   - Returns a React functional component (JSX.Element).
 * Error and exception condition values or types:
 *   - If framer-motion or react-icons are not installed, the component won't render as intended.
 * Side effects:
 *   - Animations occur based on scroll position; no data side effects.
 * Invariants:
 *   - The structure of the hero section remains the same: a headline, subheadline, and button.
 * Any known faults:
 *   - If scroll position values are changed drastically, animations may appear off or abrupt.
 * Comments summarizing major blocks of code:
 *   - Hooks and transforms: Uses useScroll, useTransform, and useSpring from framer-motion to 
 *     animate hero section based on scroll.
 *   - Animated heading and subheading: Fade-in and slide-up animations.
 *   - Animated button: Scales and pulses on hover, with an arrow that subtly wiggles.
 * Comments on every line are provided below.
 ***************************************************************************************************/


import React from "react"; // Importing React
import { motion, useScroll, useTransform, useSpring } from "framer-motion"; // Importing motion and hooks from framer-motion for animations
import { FaArrowRight } from "react-icons/fa"; // Importing an arrow icon

interface HeroSectionProps {
  onStartLearning: () => void; // A function prop to handle the start learning action
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartLearning }) => {
  // Hook to track scroll position
  const { scrollY } = useScroll();
  
  // Transform the scrollY value into different motion values for y-position, opacity, and scale
  const y = useTransform(scrollY, [0, 500], [0, 200]); // As the user scrolls down, translate the element down
  const opacity = useTransform(scrollY, [0, 300], [1, 0]); // Fade out as the user scrolls
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]); // Scale down as the user scrolls
  
  // Use a spring animation for smooth vertical motion
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  return (
    // Main container for the hero section, using motion.div for scroll-based transformations
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothY, opacity, scale }} // Apply the animated styles
    >
      {/* Inner content container */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}  // Start slightly hidden and below
        animate={{ opacity: 1, y: 0 }}   // Fade in and rise into place
        transition={{ duration: 1.2, type: "spring", damping: 20 }} // Controlled animation
      >
        {/* Main heading */}
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 relative"
          initial={{ opacity: 0, y: 20 }}   // Start hidden and below
          animate={{ opacity: 1, y: 0 }}    // Animate to visible and aligned
          transition={{ delay: 0.3 }}       // Delay to create a staggered effect
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
            Discover{" "}
          </span>
          <br />
          <span className="text-white">Culinary Skills</span>
        </motion.h1>

        {/* Subheading / description */}
        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }} // Start hidden and below
          animate={{ opacity: 1, y: 0 }}  // Fade in and rise up
          transition={{ delay: 0.6 }}     // Slightly longer delay for a staggered reveal
        >
          Learn from curated tutorials
          <br />
          <span className="text-teal-400">tailored just for you</span>
        </motion.p>

        {/* Call-to-action button */}
        <motion.button
          onClick={onStartLearning} // Handle click by calling onStartLearning
          className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                     font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                     hover:shadow-teal-500/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }}  // Slightly enlarge on hover
          whileTap={{ scale: 0.95 }}    // Slightly shrink on tap for a pressed effect
          initial={{ opacity: 0, y: 20 }} // Start hidden and below
          animate={{ opacity: 1, y: 0 }}  // Animate to visible and aligned
          transition={{ delay: 0.9 }}      // Delay so it appears after the headings
        >
          {/* Button label and icon */}
          <span className="relative z-10 flex items-center gap-2">
            Start Learning
            <motion.span
              animate={{ x: [0, 5, 0] }} // A subtle side-to-side animation for the arrow
              transition={{ repeat: Infinity, duration: 1.5 }} // Infinite loop to grab attention
            >
              <FaArrowRight className="w-6 h-6" />
            </motion.span>
          </span>
          
          {/* Background gradient that appears on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                          opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
