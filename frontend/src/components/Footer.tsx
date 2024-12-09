/***************************************************************************************************
 * Name of code artifact: Footer.tsx
 * Brief description of what the code does:
 *   This file defines the Footer component for the ChefExpress application. The Footer component 
 *   renders a visually appealing, responsive footer section that includes brand information, 
 *   social media links, quick navigation links, support resources, and app download links. It 
 *   also displays copyright and legal links.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Updated styling, improved animations, and refined section layouts.
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

// Importing React for component creation
import React from "react"; // React import is necessary to define a functional component

// Importing motion from Framer Motion for animations
import { motion } from "framer-motion"; // Enables animations for various elements

// Importing social media icons from React Icons library
import {
  FaFacebookF,  // Facebook icon
  FaTwitter,    // Twitter icon
  FaInstagram,  // Instagram icon
  FaYoutube,    // YouTube icon
} from "react-icons/fa"; // Provides scalable vector icons

// Define the Footer component as a React Functional Component
const Footer: React.FC = () => {
  // socialIcons object maps string keys to respective JSX icon elements
  const socialIcons: { [key: string]: JSX.Element } = {
    facebook: <FaFacebookF />, // Facebook icon element
    twitter: <FaTwitter />,    // Twitter icon element
    instagram: <FaInstagram />,// Instagram icon element
    youtube: <FaYoutube />,    // YouTube icon element
  };

  // Return the JSX structure of the footer section
  return (
    // footer element forms the main container for the entire footer section
    <footer className="relative bg-gray-900 text-gray-100 w-full">
      {/* Absolute-positioned gradient overlay for subtle background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none" />

      {/* Content wrapper with padding and positioning */}
      <div className="py-12 px-6 relative">
        {/* motion.div for animating the appearance of the entire footer content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Initial animation state: hidden and slightly shifted down
          whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible and aligned
          viewport={{ once: true }} // Trigger animation once when it enters the viewport
          className="relative max-w-6xl mx-auto" // Centered and max width for layout
        >
          {/* Grid structure for main footer content: brand, links, support, get the app */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column: Contains brand name, description, and social icons */}
            <div className="space-y-4 relative">
              {/* Container for brand heading and decorative floating elements */}
              <div className="relative inline-block">
                {/* Brand name with gradient text for a stylish look */}
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  ChefExpress
                </h3>

                {/* Decorative floating elements above the brand text */}
                <div className="absolute inset-x-0 top-[-2rem] pointer-events-none flex justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    // motion.div representing each floating bubble
                    <motion.div
                      key={i} // Key for React mapping
                      className="w-2 h-2 bg-teal-500/20 rounded-full mx-2" // Small semi-transparent circle
                      initial={{
                        y: 0,
                        opacity: 0.5,
                      }} // Starts slightly visible at the original position
                      animate={{
                        y: [0, -20, 0], // Moves up and down repeatedly
                        opacity: [0.5, 1, 0.5], // Fades in and out
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2, // Randomized duration for variety
                        repeat: Infinity, // Infinite looping
                        delay: Math.random() * 2, // Random start delay for staggering effects
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Brand description text explaining the purpose */}
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing the way you cook with AI-powered recipes and a vibrant community.
              </p>

              {/* Social icons row for quick access to social media platforms */}
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  // Each social link is an animated anchor for user interaction
                  <motion.a
                    key={social} // Unique key for mapping
                    href={`#${social}`} // Hashed link (placeholder)
                    whileHover={{ scale: 1.1, y: -2 }} // Hover animation to enlarge and lift icon
                    whileTap={{ scale: 0.9 }} // Tap animation to slightly shrink
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group transition-colors duration-300 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-400"
                    aria-label={social} // Accessible label for screen readers
                    target="_blank" // Opens link in a new tab/window
                    rel="noopener noreferrer" // Security measure for external links
                  >
                    <span className="text-gray-300 group-hover:text-white">
                      {socialIcons[social]} {/* Renders the appropriate icon based on the key */}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links Section: Provides user with easy navigation to main sections */}
            <div className="space-y-4">
              {/* Section heading for quick links */}
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              {/* Unordered list of navigational links */}
              <ul className="space-y-2">
                {["About Us", "Recipes", "Premium", "Blog"].map((link) => (
                  <motion.li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "")}`} // Hash link with normalized text
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300" // Hover color transition
                    >
                      {link} {/* Display link text */}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Support Section: Provides help resources and community links */}
            <div className="space-y-4">
              {/* Section heading for support links */}
              <h4 className="text-lg font-semibold text-white">Support</h4>
              {/* Unordered list of support-related links */}
              <ul className="space-y-2">
                {["Help Center", "Community", "Contact Us", "Privacy Policy"].map((link) => (
                  <motion.li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "")}`} // Normalized hash link
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                    >
                      {link} {/* Display link text */}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Get the App Section: Provides download links for mobile applications */}
            <div className="space-y-4">
              {/* Heading for app download section */}
              <h4 className="text-lg font-semibold text-white">Get the App</h4>
              {/* Container for app store links */}
              <div className="space-y-3">
                {/* App Store link with hover and tap animations */}
                <motion.a
                  href="#app-store"
                  whileHover={{ scale: 1.05 }} // Slight enlargement on hover
                  whileTap={{ scale: 0.95 }}   // Slight shrink on tap
                  className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
                >
                  <span className="text-white">App Store</span>
                </motion.a>

                {/* Play Store link with hover and tap animations */}
                <motion.a
                  href="#play-store"
                  whileHover={{ scale: 1.05 }} // Slight enlargement on hover
                  whileTap={{ scale: 0.95 }}   // Slight shrink on tap
                  className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
                >
                  <span className="text-white">Play Store</span>
                </motion.a>
              </div>
            </div>
          </div>

          {/* A horizontal divider line to separate sections */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

          {/* Bottom Footer: Contains copyright and legal links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
            {/* Display current year and brand name for copyright */}
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                ChefExpress
              </span>
              . All rights reserved.
            </p>
            {/* Legal/Policy links for terms, privacy, and cookies */}
            <div className="flex gap-6">
              {/* Terms link with hover effect */}
              <a
                href="#terms"
                className="hover:text-teal-400 transition-colors duration-300"
              >
                Terms
              </a>
              {/* Privacy link with hover effect */}
              <a
                href="#privacy"
                className="hover:text-teal-400 transition-colors duration-300"
              >
                Privacy
              </a>
              {/* Cookies link with hover effect */}
              <a
                href="#cookies"
                className="hover:text-teal-400 transition-colors duration-300"
              >
                Cookies
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Export the Footer component as default for use in other parts of the application
export default Footer;


// // src/components/Footer.tsx

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaYoutube,
// } from "react-icons/fa";

// const Footer: React.FC = () => {
//   const socialIcons: { [key: string]: JSX.Element } = {
//     facebook: <FaFacebookF />,
//     twitter: <FaTwitter />,
//     instagram: <FaInstagram />,
//     youtube: <FaYoutube />,
//   };

//   return (
//     <footer className="relative bg-gray-900 text-gray-100 w-full">
//       <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none" />

//       <div className="py-12 px-6 relative">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="relative max-w-6xl mx-auto"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//             {/* Brand Column */}
//             <div className="space-y-4 relative">
//               {/* Relative container for the brand heading */}
//               <div className="relative inline-block">
//                 <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
//                   ChefExpress
//                 </h3>

//                 {/* Floating elements above the text */}
//                 <div className="absolute inset-x-0 top-[-2rem] pointer-events-none flex justify-center">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <motion.div
//                       key={i}
//                       className="w-2 h-2 bg-teal-500/20 rounded-full mx-2"
//                       initial={{
//                         y: 0,
//                         opacity: 0.5,
//                       }}
//                       animate={{
//                         y: [0, -20, 0],
//                         opacity: [0.5, 1, 0.5],
//                       }}
//                       transition={{
//                         duration: 3 + Math.random() * 2,
//                         repeat: Infinity,
//                         delay: Math.random() * 2,
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <p className="text-gray-400 leading-relaxed">
//                 Revolutionizing the way you cook with AI-powered recipes and a vibrant community.
//               </p>
//               <div className="flex space-x-4">
//                 {["facebook", "twitter", "instagram", "youtube"].map((social) => (
//                   <motion.a
//                     key={social}
//                     href={`#${social}`}
//                     whileHover={{ scale: 1.1, y: -2 }}
//                     whileTap={{ scale: 0.9 }}
//                     className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group transition-colors duration-300 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-400"
//                     aria-label={social}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <span className="text-gray-300 group-hover:text-white">
//                       {socialIcons[social]}
//                     </span>
//                   </motion.a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div className="space-y-4">
//               <h4 className="text-lg font-semibold text-white">Quick Links</h4>
//               <ul className="space-y-2">
//                 {["About Us", "Recipes", "Premium", "Blog"].map((link) => (
//                   <motion.li key={link}>
//                     <a
//                       href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
//                       className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
//                     >
//                       {link}
//                     </a>
//                   </motion.li>
//                 ))}
//               </ul>
//             </div>

//             {/* Support */}
//             <div className="space-y-4">
//               <h4 className="text-lg font-semibold text-white">Support</h4>
//               <ul className="space-y-2">
//                 {["Help Center", "Community", "Contact Us", "Privacy Policy"].map((link) => (
//                   <motion.li key={link}>
//                     <a
//                       href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
//                       className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
//                     >
//                       {link}
//                     </a>
//                   </motion.li>
//                 ))}
//               </ul>
//             </div>

//             {/* Get the App */}
//             <div className="space-y-4">
//               <h4 className="text-lg font-semibold text-white">Get the App</h4>
//               <div className="space-y-3">
//                 <motion.a
//                   href="#app-store"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
//                 >
//                   <span className="text-white">App Store</span>
//                 </motion.a>
//                 <motion.a
//                   href="#play-store"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
//                 >
//                   <span className="text-white">Play Store</span>
//                 </motion.a>
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

//           {/* Bottom Footer */}
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
//             <p>
//               © {new Date().getFullYear()}{" "}
//               <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
//                 ChefExpress
//               </span>
//               . All rights reserved.
//             </p>
//             <div className="flex gap-6">
//               <a
//                 href="#terms"
//                 className="hover:text-teal-400 transition-colors duration-300"
//               >
//                 Terms
//               </a>
//               <a
//                 href="#privacy"
//                 className="hover:text-teal-400 transition-colors duration-300"
//               >
//                 Privacy
//               </a>
//               <a
//                 href="#cookies"
//                 className="hover:text-teal-400 transition-colors duration-300"
//               >
//                 Cookies
//               </a>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
