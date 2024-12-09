/***************************************************************************************************
 * Name of code artifact: Footer.tsx
 * Brief description of what the code does:
 *   This file defines the Footer component for the ChefExpress application. The Footer component 
 *   renders a visually appealing, responsive footer section that includes brand information, 
 *   social media links, quick navigation links, support resources, and app download links. It 
 *   also displays copyright and legal links.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/1/24
 * Dates the code was revised: 11/14/24
 * Brief description of each revision & author:
 *   11/14/24 - Brady Holland: Updated styling, improved animations, and refined section layouts.
 * Preconditions:
 *   - Must be used within a React environment.
 *   - Dependencies on React, Framer Motion, and React Icons must be installed.
 * Acceptable input values or types:
 *   - This component does not take props and is self-contained.
 *   - Acceptable React environment and bundling with a proper tool (e.g., Webpack, Vite).
 * Unacceptable input values or types:
 *   - Invoking outside of a React environment.
 *   - Using without required dependencies installed.
 * Postconditions:
 *   - Returns a JSX element representing the footer.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If required dependencies (React, Framer Motion, React Icons) are missing, the build may fail.
 * Side effects:
 *   - Renders UI elements, attaches animations via Framer Motion.
 * Invariants:
 *   - The footer layout remains consistent regardless of screen size, though it is responsive.
 * Any known faults:
 *   - None known at this time.
 * Comments summarizing major blocks of code:
 *   - Imports: Bring in React, Framer Motion, and icon libraries.
 *   - socialIcons object: Maps social platform names to their respective icons.
 *   - Footer component return block: Structures the footer UI and adds animations.
 *   - Brand Column: Displays brand name, floating decorative elements, description, and social icons.
 *   - Quick Links, Support, and Get the App sections: Provide navigation and external resources.
 *   - Bottom Footer: Displays copyright and legal/terms links.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/components/Footer.tsx

import { motion } from "framer-motion"; // Import the motion component from framer-motion for animations

// Define the Footer component as a functional component
const Footer = () => {
  return (
    // Create a footer element with a dark background and padding
    <footer className="relative bg-gray-900 py-6 w-full">
      {/* A wrapper div for positioning and centering content */}
      <div className="relative inline-block w-full text-center">
        
        {/* Floating elements section to display small animated dots */}
        <div 
          className="absolute inset-x-0 top-[-1rem] pointer-events-none flex justify-center"
        >
          {/* Create an array of three elements and map through them to render three animated dots */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i} // Use the index as a unique key for each dot
              className="w-2 h-2 bg-teal-500/20 rounded-full mx-2" // Small teal dot with rounded shape and margin
              initial={{
                y: 0,        // Initial vertical position
                opacity: 0.5 // Initial opacity
              }}
              animate={{
                y: [0, -10, 0],      // Vertical animation going up and back to original position
                opacity: [0.5, 1, 0.5] // Opacity fluctuates to create a pulsing effect
              }}
              transition={{
                duration: 2 + Math.random() * 2, // Randomize duration for a more organic feel
                repeat: Infinity,                // Repeat animation indefinitely
                delay: Math.random() * 2         // Randomize delay so they don't animate in sync
              }}
            />
          ))}
        </div>

        {/* Brand name with animated fade-in effect */}
        <motion.h3
          className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}    // Start with zero opacity
          animate={{ opacity: 1 }}    // Animate to fully visible
          transition={{ duration: 0.5 }} // Half-second fade-in duration
        >
          ChefExpress
        </motion.h3>
      </div>
    </footer>
  );
};

// Export the Footer component as the default export
export default Footer;
