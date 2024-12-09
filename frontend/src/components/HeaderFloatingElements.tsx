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

import React, { useEffect, useState } from 'react';               // Import React and hooks for state & effects
import { motion, AnimatePresence } from 'framer-motion';          // Import framer-motion for animations

// useScrollVisibility hook determines if the user is at the top of the page to show elements.
const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);              // Track if elements are visible

  useEffect(() => {
    // handleScroll updates visibility based on scroll position
    const handleScroll = () => {
      const scrollPosition = window.scrollY;                     // Current vertical scroll
      setIsVisible(scrollPosition <= 0);                         // Visible only if at the top (scrollY=0)
    };

    window.addEventListener('scroll', handleScroll);             // Listen for scroll events
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, []);

  return isVisible;                                              // Return visibility state
};

// HeaderFloatingElements: Animated floating circular particles at the top of the header.
const HeaderFloatingElements: React.FC = React.memo(() => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Store screen width and fixed height
  const isVisible = useScrollVisibility();                              // Determine if should be visible

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // updateDimensions sets new width and a fixed height of 100
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: 100
        });
      };

      updateDimensions();                                              // Set initial dimensions
      window.addEventListener('resize', updateDimensions);             // Update on window resize
      return () => window.removeEventListener('resize', updateDimensions); // Cleanup on unmount
    }
  }, []);

  // getGridPosition calculates a position for each element in a conceptual grid
  const getGridPosition = (index: number, total: number) => {
    const padding = 20;
    const safeWidth = dimensions.width - (padding * 2);          // Usable width after padding
    const safeHeight = dimensions.height - (padding * 2);        // Usable height after padding

    const columns = 5;                                           // Number of columns
    const rows = 3;                                              // Number of rows
    const cellWidth = safeWidth / columns;                       // Width of each grid cell
    const cellHeight = safeHeight / rows;                        // Height of each grid cell

    const column = index % columns;                              // Column of the cell
    const row = Math.floor(index / columns) % rows;              // Row of the cell

    // Random offsets within the cell
    const randomX = (Math.random() - 0.5) * cellWidth * 0.6;
    const randomY = (Math.random() - 0.5) * cellHeight * 0.6;

    // Position element near cell center plus some randomness
    return {
      x: padding + column * cellWidth + cellWidth / 2 + randomX,
      y: padding + row * cellHeight + cellHeight / 2 + randomY
    };
  };

  if (dimensions.width === 0) return null;                        // Don't render if width is not set

  return (
    <AnimatePresence>
      {isVisible && (                                           // Only render if isVisible is true
        <motion.div 
          className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}                              // Start invisible
          animate={{ opacity: 1 }}                              // Fade in
          exit={{ opacity: 0 }}                                 // Fade out on exit
          transition={{ duration: 0.3 }}
        >
          {Array.from({ length: 15 }).map((_, i) => {           // Create 15 floating elements
            const position = getGridPosition(i, 15);            // Get position for this element
            const size = i % 3 === 0 ? 'w-4 h-4' : 'w-3 h-3';   // Vary size every 3 elements
            const duration = 4 + Math.random() * 3;             // Random animation duration
            const maxMove = 15;                                 // Max vertical/horizontal movement

            return (
              <motion.div
                key={i}
                className={`absolute ${size} ${
                  i % 3 === 0
                    ? "border border-teal-500/40 bg-teal-500/10"
                    : "bg-teal-500/20"
                } rounded-full backdrop-blur-sm`}
                initial={{
                  x: position.x,
                  y: position.y,
                  scale: 0.8 + Math.random() * 0.4,
                }}
                animate={{
                  // Vertical and horizontal oscillation
                  y: [
                    position.y,
                    position.y - (10 + Math.random() * maxMove),
                    position.y
                  ],
                  x: [
                    position.x,
                    position.x + (Math.random() - 0.5) * maxMove * 2,
                    position.x
                  ],
                  // Rotation and scale pulsation
                  rotate: [0, 180 + Math.random() * 180],
                  scale: [1, 1.1 + Math.random() * 0.2, 1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * duration,
                }}
                style={{
                  // Add a subtle glow if it's every 3rd element
                  boxShadow: i % 3 === 0 ? '0 0 10px rgba(20, 184, 166, 0.2)' : 'none'
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// HeaderShapeBackground: Animated larger square/rectangular shapes floating at the top.
const HeaderShapeBackground: React.FC = React.memo(() => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Store dimensions
  const isVisible = useScrollVisibility();                              // Visibility based on scroll

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: 100
        });
      };

      updateDimensions();                                              // Set initial dimensions
      window.addEventListener('resize', updateDimensions);             // Update on resize
      return () => window.removeEventListener('resize', updateDimensions); // Cleanup
    }
  }, []);

  // Calculate grid positions similarly as above but for fewer/larger elements
  const getGridPosition = (index: number, total: number) => {
    const padding = 30;
    const safeWidth = dimensions.width - (padding * 2);
    const safeHeight = dimensions.height - (padding * 2);

    const columns = 4;                                           // Number of columns for shapes
    const rows = 2;                                              // Number of rows for shapes
    const cellWidth = safeWidth / columns;                       // Cell width
    const cellHeight = safeHeight / rows;                        // Cell height

    const column = index % columns;
    const row = Math.floor(index / columns) % rows;

    const randomX = (Math.random() - 0.5) * cellWidth * 0.4;
    const randomY = (Math.random() - 0.5) * cellHeight * 0.4;

    return {
      x: padding + column * cellWidth + cellWidth / 2 + randomX,
      y: padding + row * cellHeight + cellHeight / 2 + randomY
    };
  };

  if (dimensions.width === 0) return null;                        // Don't render if no width

  return (
    <AnimatePresence>
      {isVisible && (                                           // Show only if visible
        <motion.div 
          className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}                              // Start invisible
          animate={{ opacity: 1 }}                              // Fade in
          exit={{ opacity: 0 }}                                 // Fade out on exit
          transition={{ duration: 0.3 }}
        >
          {Array.from({ length: 8 }).map((_, i) => {            // 8 larger floating shapes
            const position = getGridPosition(i, 8);
            const duration = 10 + Math.random() * 5;            // Longer duration for larger shapes
            const maxMove = 20;                                 // Slightly larger movement

            return (
              <motion.div
                key={i}
                className={`absolute ${
                  i % 3 === 0
                    ? "w-12 h-12 border border-teal-500/40 bg-teal-500/5"
                    : i % 3 === 1
                    ? "w-10 h-10 bg-cyan-500/20"
                    : "w-8 h-8 bg-teal-500/20"
                } rounded-xl backdrop-blur-sm transform`}
                initial={{
                  x: position.x,
                  y: position.y,
                  rotate: Math.random() * 360,
                  scale: 0.8 + Math.random() * 0.4,
                }}
                animate={{
                  // Oscillate in both y and x directions
                  y: [
                    position.y,
                    position.y - (15 + Math.random() * maxMove),
                    position.y
                  ],
                  x: [
                    position.x,
                    position.x + (Math.random() - 0.5) * maxMove * 2,
                    position.x
                  ],
                  rotate: [0, 360],                             // Full rotation
                  scale: [1, 1.2 + Math.random() * 0.2, 1],      // Slight pulsation
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * duration,
                }}
                style={{
                  // Subtle glow around the shape
                  boxShadow: '0 0 15px rgba(20, 184, 166, 0.15)'
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

HeaderFloatingElements.displayName = 'HeaderFloatingElements';
HeaderShapeBackground.displayName = 'HeaderShapeBackground';

// Export both components for use in the application
export { HeaderFloatingElements, HeaderShapeBackground };
