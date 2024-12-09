/***************************************************************************************************
 * Name of code artifact: HeaderFloatingElements.tsx
 * Brief description of what the code does:
 *   This file provides two React memoized components, HeaderFloatingElements and HeaderShapeBackground,
 *   which display animated decorative shapes and particles at the top portion of the page header. 
 *   These elements fade out as the user scrolls down, creating a dynamic visual experience.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/1/24
 * Dates the code was revised: 11/18/24
 * Brief description of each revision & author:
 *   11/18/24 - Brady Holland: Adjusted animation parameters, varied shapes, and optimized layout 
 *   calculations for responsiveness.
 * Preconditions:
 *   - Must run in a React environment.
 *   - Framer Motion must be installed for animations.
 * Acceptable input values or types:
 *   - No direct inputs; components rely on window size, scroll position, and random calculations.
 * Unacceptable input values or types:
 *   - Running in a non-browser environment without window dimensions would break logic.
 * Postconditions:
 *   - Returns JSX elements representing animated floating shapes if conditions (scroll at top) are met.
 * Return values or types:
 *   - Both components return React functional components (JSX.Element | null).
 * Error and exception condition values or types:
 *   - If window is undefined (e.g., SSR), components may render null without error.
 * Side effects:
 *   - Attaches and removes event listeners on window scroll and resize.
 * Invariants:
 *   - The number and pattern of shapes remain constant, though their positions and animations vary.
 * Any known faults:
 *   - Heavy animation or large number of elements could affect performance on low-end devices.
 * Comments summarizing major blocks of code:
 *   - useScrollVisibility hook: Determines visibility based on scroll position.
 *   - HeaderFloatingElements: Renders small circles that float and jitter at the top.
 *   - HeaderShapeBackground: Renders larger squares/rectangles that float in a grid pattern.
 * Comments for each line are provided below.
 ***************************************************************************************************/


import React, { useEffect, useState } from "react"; // Importing React and related hooks
import { motion, AnimatePresence } from "framer-motion"; // Importing framer-motion for animations

// Custom hook to manage the visibility based on scroll position
const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true); // State to track visibility

  useEffect(() => {
    // Handler for scroll events
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // Current vertical scroll position
      setIsVisible(scrollPosition <= 0);     // Visible only when scrolled to top
    };

    // Listen to window scroll events
    window.addEventListener("scroll", handleScroll);
    // Cleanup event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible; // Return the current visibility state
};

// Component that displays floating elements at the header
const HeaderFloatingElements: React.FC = React.memo(() => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Track header dimensions
  const isVisible = useScrollVisibility(); // Check if elements should be visible based on scroll

  useEffect(() => {
    // Update dimensions when the window is resized
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth, // Current window width
          height: 100,              // Fixed height for the header area
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      // Cleanup listener on unmount
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  // Calculate a grid position for each floating element
  const getGridPosition = (index: number) => {
    const padding = 20; // Padding around the area
    const safeWidth = dimensions.width - padding * 2; // Usable width
    const safeHeight = dimensions.height - padding * 2; // Usable height

    const columns = 5; // Number of columns in the grid
    const rows = 3;    // Number of rows in the grid
    const cellWidth = safeWidth / columns;    // Cell width
    const cellHeight = safeHeight / rows;     // Cell height

    const column = index % columns;                 // Column index
    const row = Math.floor(index / columns) % rows; // Row index

    // Random offsets within each cell for natural placement
    const randomX = (Math.random() - 0.5) * cellWidth * 0.6;
    const randomY = (Math.random() - 0.5) * cellHeight * 0.6;

    return {
      x: padding + column * cellWidth + cellWidth / 2 + randomX,
      y: padding + row * cellHeight + cellHeight / 2 + randomY,
    };
  };

  // If width is not available yet, do not render
  if (dimensions.width === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}     // Start transparent
          animate={{ opacity: 1 }}     // Fade in
          exit={{ opacity: 0 }}        // Fade out when not visible
          transition={{ duration: 0.3 }} // Transition duration
        >
          {Array.from({ length: 15 }).map((_, i) => {
            // Compute position for each floating element
            const position = getGridPosition(i);
            // Vary size based on the index
            const size = i % 3 === 0 ? "w-4 h-4" : "w-3 h-3";
            // Randomize animation duration
            const duration = 4 + Math.random() * 3;
            // Maximum movement offset
            const maxMove = 15;

            return (
              <motion.div
                key={i} // Unique key for each element
                className={`absolute ${size} ${
                  i % 3 === 0
                    ? "border border-teal-500/20 bg-teal-500/5" // Larger circle with border
                    : "bg-teal-500/10"                         // Smaller circle
                } rounded-full backdrop-blur-sm`}
                initial={{
                  x: position.x,
                  y: position.y,
                  scale: 0.6 + Math.random() * 0.3, // Slight random variation in scale
                }}
                animate={{
                  // Vertical bobbing animation
                  y: [
                    position.y,
                    position.y - (5 + Math.random() * maxMove),
                    position.y,
                  ],
                  // Horizontal swaying animation
                  x: [
                    position.x,
                    position.x + (Math.random() - 0.5) * maxMove * 1.5,
                    position.x,
                  ],
                  // Rotation and subtle scale variation
                  rotate: [0, 90 + Math.random() * 90],
                  scale: [1, 1.05 + Math.random() * 0.1, 1],
                }}
                transition={{
                  duration: duration * 1.5, // Duration of one animation cycle
                  repeat: Infinity,         // Repeat forever
                  ease: "easeInOut",        // Smooth easing
                  delay: Math.random() * duration, // Random start delay for natural movement
                }}
                style={{
                  boxShadow:
                    i % 3 === 0 ? "0 0 5px rgba(20, 184, 166, 0.1)" : "none", // Add subtle glow for some elements
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Component that displays background shapes behind the header
const HeaderShapeBackground: React.FC = React.memo(() => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Track dimensions
  const isVisible = useScrollVisibility(); // Check if shapes should be visible

  useEffect(() => {
    // Update dimensions on window resize
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: 100,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      // Cleanup on unmount
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  // Calculate positions for larger background shapes
  const getGridPosition = (index: number) => {
    const padding = 30;
    const safeWidth = dimensions.width - padding * 2;
    const safeHeight = dimensions.height - padding * 2;

    const columns = 4; // Fewer columns for larger shapes
    const rows = 2;    // Fewer rows
    const cellWidth = safeWidth / columns;
    const cellHeight = safeHeight / rows;

    const column = index % columns;
    const row = Math.floor(index / columns) % rows;

    // Random offset inside each cell
    const randomX = (Math.random() - 0.5) * cellWidth * 0.4;
    const randomY = (Math.random() - 0.5) * cellHeight * 0.4;

    return {
      x: padding + column * cellWidth + cellWidth / 2 + randomX,
      y: padding + row * cellHeight + cellHeight / 2 + randomY,
    };
  };

  // If width is not determined yet, don't render
  if (dimensions.width === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}    // Start transparent
          animate={{ opacity: 1 }}    // Fade in
          exit={{ opacity: 0 }}       // Fade out when not visible
          transition={{ duration: 0.3 }} // Transition duration
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const position = getGridPosition(i);
            const duration = 10 + Math.random() * 5; // Longer duration for slower movement
            const maxMove = 20; // Larger movement amplitude

            return (
              <motion.div
                key={i} // Unique key
                className={`absolute ${
                  i % 3 === 0
                    ? "w-12 h-12 border border-teal-500/20 bg-teal-500/5" // Larger, bordered square
                    : i % 3 === 1
                    ? "w-10 h-10 bg-cyan-500/10" // Medium square with cyan tint
                    : "w-8 h-8 bg-teal-500/10"   // Smaller square
                } rounded-xl backdrop-blur-sm transform`}
                initial={{
                  x: position.x,
                  y: position.y,
                  rotate: Math.random() * 360,            // Random initial rotation
                  scale: 0.8 + Math.random() * 0.4,       // Random initial scale
                }}
                animate={{
                  // Vertical bobbing
                  y: [
                    position.y,
                    position.y - (15 + Math.random() * maxMove),
                    position.y,
                  ],
                  // Horizontal sway
                  x: [
                    position.x,
                    position.x + (Math.random() - 0.5) * maxMove * 2,
                    position.x,
                  ],
                  rotate: [0, 360], // Full rotation
                  scale: [1, 1.2 + Math.random() * 0.2, 1], // Slight scale variation
                }}
                transition={{
                  duration,            // Duration per cycle
                  repeat: Infinity,    // Loop indefinitely
                  ease: "easeInOut",   // Smooth easing
                  delay: Math.random() * duration, // Random start delay
                }}
                style={{
                  boxShadow: "0 0 15px rgba(20, 184, 166, 0.1)", // Subtle glow
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Set display names for these memoized components for debugging purposes
HeaderFloatingElements.displayName = "HeaderFloatingElements";
HeaderShapeBackground.displayName = "HeaderShapeBackground";

// Export the components
export { HeaderFloatingElements, HeaderShapeBackground };
