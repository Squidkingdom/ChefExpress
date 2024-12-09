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

// Import React for creating the component
import React from "react";
// Import motion hooks from framer-motion for scroll-based animations
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// Import icon for call-to-action button
import { FaArrowRight } from "react-icons/fa";

// Interface defining the expected props for the HeroSection component
interface HeroSectionProps {
  onStartLearning: () => void; // Function to call when "Start Learning" button is clicked
}

// HeroSection component: a full-screen hero area with animated heading, subheading, and button.
export const HeroSection: React.FC<HeroSectionProps> = ({ onStartLearning }) => {
  // useScroll gives us the current scroll value
  const { scrollY } = useScroll();

  // useTransform maps scroll values to element properties for a parallax-like effect
  const y = useTransform(scrollY, [0, 500], [0, 200]);     // Move hero down as user scrolls
  const opacity = useTransform(scrollY, [0, 300], [1, 0]); // Fade out as user scrolls down
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]); // Scale down on scroll
  // useSpring adds spring physics to the y translation for smoother movement
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  // Return the hero section container
  return (
    // motion.div for the hero container, moves and fades based on scroll
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothY, opacity, scale }}
    >
      {/* Wrapper for heading and content, with initial slide-up and fade-in */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", damping: 20 }}
      >
        {/* Enhanced glow effect: animated background gradient behind text */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
        />

        {/* Main heading: large, bold, gradient text */}
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 relative"
          initial={{ opacity: 0, y: 20 }}    // Start hidden and slightly down
          animate={{ opacity: 1, y: 0 }}     // Fade in and move up
          transition={{ delay: 0.3 }}        // Slight delay to stagger animations
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
            Discover{" "}
          </span>
          <br />
          <span className="text-white">Culinary Skills</span>
        </motion.h1>

        {/* Subheading: descriptive text about the tutorials */}
        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}     // Fade up from below
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}         // Additional delay for staggered reveal
        >
          Learn from curated tutorials
          <br />
          <span className="text-teal-400">tailored just for you</span>
        </motion.p>

        {/* Call-to-action button: Scales on hover, includes a subtle animated arrow icon */}
        <motion.button
          onClick={onStartLearning}
          className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                     font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                     hover:shadow-teal-500/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }}  // Slight enlarge on hover
          whileTap={{ scale: 0.95 }}     // Slight shrink on tap
          initial={{ opacity: 0, y: 20 }} // Initially hidden and moved down
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}     // Delayed to appear last
        >
          {/* Button content with arrow that gently moves side-to-side */}
          <span className="relative z-10 flex items-center gap-2">
            Start Learning
            <motion.span
              animate={{ x: [0, 5, 0] }} // Subtle side-to-side motion for the arrow
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight className="w-6 h-6" />
            </motion.span>
          </span>
          {/* Hover effect: gradient glow on the button background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                          opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};


// import React from "react";
// import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// import { FaArrowRight } from "react-icons/fa";

// interface HeroSectionProps {
//   onStartLearning: () => void;
// }

// export const HeroSection: React.FC<HeroSectionProps> = ({ onStartLearning }) => {
//   const { scrollY } = useScroll();
//   const y = useTransform(scrollY, [0, 500], [0, 200]);
//   const opacity = useTransform(scrollY, [0, 300], [1, 0]);
//   const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
//   const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

//   return (
//     <motion.div
//       className="relative min-h-screen flex items-center justify-center overflow-hidden"
//       style={{ y: smoothY, opacity, scale }}
//     >
//       <motion.div
//         className="relative z-10 max-w-6xl mx-auto px-6 text-center"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1.2, type: "spring", damping: 20 }}
//       >
//         {/* Enhanced glow effect */}
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
//           transition={{ duration: 3, repeat: Infinity }}
//           className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
//         />

//         <motion.h1
//           className="text-6xl md:text-8xl font-extrabold mb-8 relative"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
//             Discover{" "}
//           </span>
//           <br />
//           <span className="text-white">Culinary Skills</span>
//         </motion.h1>

//         <motion.p
//           className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//         >
//           Learn from curated tutorials
//           <br />
//           <span className="text-teal-400">tailored just for you</span>
//         </motion.p>

//         <motion.button
//           onClick={onStartLearning}
//           className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
//                    font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
//                    hover:shadow-teal-500/40 transition-all duration-300"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.9 }}
//         >
//           <span className="relative z-10 flex items-center gap-2">
//             Start Learning
//             <motion.span
//               animate={{ x: [0, 5, 0] }}
//               transition={{ repeat: Infinity, duration: 1.5 }}
//             >
//               <FaArrowRight className="w-6 h-6" />
//             </motion.span>
//           </span>
//           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
//                         opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };
