/***************************************************************************************************
 * Name of code artifact: animations.ts
 * Brief description of what the code does:
 *   This file exports common framer-motion animation variants used throughout the application. 
 *   These animation variants can be applied to motion components to create smooth page transitions, 
 *   staggered child animations, and fade-in-up effects for UI elements.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Refined durations, easings, and delays for smoother, more natural 
 *   entrance and exit animations.
 * Preconditions:
 *   - framer-motion must be installed.
 *   - These variants must be used with motion components from framer-motion.
 * Acceptable and unacceptable input values or types:
 *   - No direct inputs; these are predefined animation variants.
 * Postconditions:
 *   - Provides reusable animation configurations that can be referenced in various components 
 *     to achieve consistent animation behavior.
 * Return values or types:
 *   - Returns objects defining `hidden`, `visible`, and `exit` states for animations.
 * Error and exception condition values or types:
 *   - None known; these are static definitions.
 * Side effects:
 *   - None, as they are pure configuration objects.
 * Invariants:
 *   - The structure of each variant remains consistent: `hidden` for initial state, `visible` 
 *     for animated-in state, and sometimes `exit` for fade-out transitions.
 * Any known faults:
 *   - None known.
 * Comments summarizing major blocks of code:
 *   - pageTransition: Used for entire page transitions, fading and sliding content in/out.
 *   - staggerContainer: Applies staggered animation to child elements, delaying each child's 
 *     animation start.
 *   - fadeInUp: Fades and moves an element upwards on entrance.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Transition for page-level animations (e.g., route transitions)
export const pageTransition = {
  hidden: { opacity: 0, y: 20 },          // Start state: transparent and slightly below
  visible: {
    opacity: 1, y: 0,
    transition: {
      duration: 0.6,                      // Takes 0.6s to fully appear
      ease: "easeOut",                    // Slows into final position for smooth ending
    },
  },
  exit: {
    opacity: 0, y: -20,
    transition: {
      duration: 0.3,                      // Slightly faster exit
    },
  },
};

// Stagger container: when applied to a parent element, its children animate in sequence
export const staggerContainer = {
  hidden: { opacity: 0 },                 // Initially invisible
  visible: {
    opacity: 1,                           // Become visible
    transition: {
      staggerChildren: 0.1,               // Each child starts 0.1s after the previous
      delayChildren: 0.2,                 // Delay before the first child starts
    },
  },
};

// fadeInUp: A single element variant for fading in and sliding up
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },          // Start transparent and below
  visible: {
    opacity: 1, y: 0,
    transition: {
      duration: 0.5,                      // Half second fade-in-up
      ease: "easeOut",                    // Smoothly eases into final position
    },
  },
};


// export const pageTransition = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//     exit: {
//       opacity: 0,
//       y: -20,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };
  
//   export const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };
  
//   export const fadeInUp = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     },
//   };