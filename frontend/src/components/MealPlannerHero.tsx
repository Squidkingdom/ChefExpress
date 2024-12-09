/***************************************************************************************************
 * Name of code artifact: HeroSection.tsx
 * Brief description of what the code does:
 *   This file defines a HeroSection component, which renders a visually appealing, animated hero 
 *   section for planning meals. It responds to scroll events by adjusting the scale, opacity, 
 *   and position of its elements. It also provides a call-to-action button that, when clicked, 
 *   triggers a callback function to start the meal planning process.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/1/24
 * Dates the code was revised: 11/8/24
 * Brief description of each revision & author:
 *   11/8/24 - Brady Holland: Updated headings and button text to emphasize meal planning. Improved 
 *   animations for a smoother visual experience and integrated gradients.
 * Preconditions:
 *   - Must run within a React environment.
 *   - Dependencies (Framer Motion, React Icons) must be installed.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `onStartPlanning`: A function prop, required. Should be a valid callback that initiates 
 *     the meal planning process. Any other type (null, undefined, non-function) is unacceptable.
 * Postconditions:
 *   - When rendered, the hero section appears at the top of the page.
 *   - On scroll, the hero section gracefully adjusts its scale, opacity, and vertical position.
 *   - Clicking the "Start Planning" button invokes the `onStartPlanning` callback.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If `onStartPlanning` is missing or not a function, the button will not function as intended.
 * Side effects:
 *   - Animations triggered by scroll and hover have no side effects beyond visual changes.
 * Invariants:
 *   - The hero layout and text remain consistent. Only visual transformations and animations vary.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - Hooks and Motion: Uses `useScroll`, `useTransform`, and `useSpring` from Framer Motion to 
 *     create smooth scroll-based animations.
 *   - Headings and Paragraph: Introduce the concept of planning meals and discovering recipes.
 *   - Button: Animated call-to-action that, when clicked, runs `onStartPlanning`.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// HeroSection.tsx
import React from "react";                                    // Import React for component creation
import { motion, useScroll, useTransform, useSpring } from "framer-motion"; // Framer Motion hooks for animation
import { FaArrowRight } from "react-icons/fa";                // Arrow icon for the call-to-action button

// Interface specifying expected props: a callback to start planning meals
interface HeroSectionProps {
  onStartPlanning: () => void; // Invoked when the "Start Planning" button is clicked
}

// HeroSection component:
// Displays a hero banner that animates based on scroll and includes a "Start Planning" button.
const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning }) => {
  // useScroll provides scrollY motion value for the page
  const { scrollY } = useScroll();

  // useTransform maps the scrollY range to various transformations for the hero section
  const y = useTransform(scrollY, [0, 500], [0, 200]);   // Moves hero downward as user scrolls
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);  // Fades out on scroll
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);  // Scales down on scroll
  
  // useSpring adds a spring animation to y for smoother motion
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  // The main container of the hero section
  return (
    // motion.div applying transformations from scroll to create parallax-like effect
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothY, opacity, scale }}
    >
      {/* Inner container holding text and call-to-action, fades in from below */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}   // Start hidden and shifted down
        animate={{ opacity: 1, y: 0 }}    // Animate to visible and centered
        transition={{ duration: 1.2, type: "spring", damping: 20 }} // Smooth transition
      >
        {/* Background gradient glow effect behind the text, gently pulsating in scale and opacity */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
        />

        {/* Main heading: multi-line to emphasize meal planning theme, fades in slightly delayed */}
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 relative"
          initial={{ opacity: 0, y: 20 }}     // Start hidden and shifted down
          animate={{ opacity: 1, y: 0 }}      // Fade in and slide up
          transition={{ delay: 0.3 }}          // Stagger appearance after container
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
            Plan Your
          </span>
          <br />
          <span className="text-white">Culinary Week</span>
        </motion.h1>

        {/* Subtitle / supporting text: introduce personalized meal plans and recipe exploration */}
        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}    // Start hidden and shifted down
          animate={{ opacity: 1, y: 0 }}     // Fade in and slide up
          transition={{ delay: 0.6 }}         // Further delay for staggered visual effect
        >
          Create your personalized meal plans
          <br />
          <span className="text-teal-400">and explore new recipes</span>
        </motion.p>

        {/* Call-to-Action Button: Animates in, scales on hover, and triggers onStartPlanning when clicked */}
        <motion.button
          onClick={onStartPlanning} // Invoke the provided callback on click
          className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                     font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                     hover:shadow-teal-500/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }} // Slightly enlarge on hover
          whileTap={{ scale: 0.95 }}    // Slight compress on click
          initial={{ opacity: 0, y: 20 }} // Button starts hidden and slightly down
          animate={{ opacity: 1, y: 0 }}  // Fade in and slide up
          transition={{ delay: 0.9 }}      // Appear last to complete the visual sequence
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Planning
            {/* Arrow icon that subtly moves side-to-side to draw attention */}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight className="w-6 h-6" />
            </motion.span>
          </span>
          {/* Glow effect on button hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                          opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Export HeroSection for use in other parts of the application
export default HeroSection;
