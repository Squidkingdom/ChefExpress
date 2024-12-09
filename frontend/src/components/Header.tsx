/***************************************************************************************************
 * Name of code artifact: Header.tsx
 * Brief description of what the code does:
 *   This file defines the Header component for the ChefExpress application. It provides a responsive 
 *   top navigation bar with branding, navigation links, login button, and a mobile-responsive menu 
 *   that toggles. It also includes animated background elements and visual transitions as the user 
 *   scrolls.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added mobile menu animations, integrated login modal trigger, and 
 *   improved styling and hover effects.
 * Preconditions:
 *   - React environment is set up.
 *   - Dependencies include React Router (for Link, useLocation), Framer Motion for animations, and 
 *     React Icons.
 *   - The `setIsLoginOpen` function must be provided to open the login modal.
 * Acceptable input values or types:
 *   - `setIsLoginOpen`: A function that accepts a boolean to open/close the login modal.
 * Unacceptable input values or types:
 *   - `setIsLoginOpen` set to null or non-function type.
 * Postconditions:
 *   - Returns a JSX element representing a fully responsive, animated header/navigation bar.
 * Return values or types:
 *   - Returns a React functional component (JSX.Element).
 * Error and exception condition values or types:
 *   - If `setIsLoginOpen` is not provided, the login button will not function as intended.
 * Side effects:
 *   - Alters page scroll perception by adding/removing shadows and backgrounds on scroll.
 *   - Triggers the login modal when the login button is clicked.
 * Invariants:
 *   - Header remains at the top (fixed positioning).
 * Any known faults:
 *   - If styling classes or DOM structure is changed, animation or conditional rendering may 
 *     become misaligned.
 * Comments summarizing major blocks of code:
 *   - Imports and interfaces: Import React, hooks, routing, animation libraries, and icons. Define 
 *     type interfaces for props.
 *   - NavButton component: Renders individual navigation buttons (links or actions) with animation 
 *     and active state styling.
 *   - NavButtons component: Renders a set of navigation buttons, providing main navigation links 
 *     and a login button with animations.
 *   - Header component: Combines background elements, a brand logo, navigation (desktop & mobile), 
 *     scroll detection, and a toggleable mobile menu.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and necessary hooks
import React, { useState, useEffect, useCallback } from "react";
// Import routing hooks and components
import { Link, useLocation } from "react-router-dom";
// Import Framer Motion components for animations
import { motion, AnimatePresence } from "framer-motion";
// Import icons for menu toggling and login
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";
// Import custom floating elements backgrounds for the header
import { HeaderFloatingElements, HeaderShapeBackground } from "./HeaderFloatingElements";

// NavButtonProps defines the shape of props for the NavButton component
interface NavButtonProps {
  to?: string;             // Optional route the button links to
  onClick?: () => void;    // Optional click handler for button interactions
  className?: string;      // Additional CSS classes
  children: React.ReactNode; // Button content (text, icons)
}

// NavButton component handles rendering either a Link (if `to` is provided) or a button element
// and applies hover/tap animations along with active state styling.
const NavButton: React.FC<NavButtonProps> = ({
  to,
  onClick,
  className = "",
  children,
}) => {
  // Use location to determine if current route matches `to`, marking it as active
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  // Combine classes based on active state
  const combinedClasses = `
    relative transition-transform duration-300 
    px-4 py-2 rounded-full overflow-hidden
    ${className} 
    ${isActive 
      ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 shadow-lg" 
      : "text-gray-200 hover:text-white hover:bg-gray-800/50"
    }`;

  // content wraps children with motion.div to handle hover and tap scale animations
  const content = (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
      }}
      className={combinedClasses}
    >
      {children}
    </motion.div>
  );

  // If a `to` prop is provided, render a Link, otherwise render a button
  return to ? (
    <Link to={to}>{content}</Link>
  ) : (
    <button onClick={onClick} className="focus:outline-none">{content}</button>
  );
};

// NavButtonsProps defines the shape of props for the NavButtons component
interface NavButtonsProps {
  onLoginClick: () => void; // Handler for when the login button is clicked
  isMobile?: boolean;       // If true, render nav items in a mobile-friendly layout
}

// NavButtons component renders a row or column of navigation buttons depending on `isMobile`.
// It includes main navigation links (Home, Learn, Plan, Share, Order) and a login button.
const NavButtons: React.FC<NavButtonsProps> = ({ onLoginClick, isMobile }) => {
  // containerVariants and itemVariants define staggered animations for menu items
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Render motion.div container for nav items, animate them in sequence
  return (
    <motion.div
      className={`flex items-center ${isMobile ? "flex-col space-y-4" : "space-x-6"}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Each nav item is wrapped in a motion.div to handle staggered animations */}
      <motion.div variants={itemVariants}>
        <NavButton to="/">Home</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        <NavButton to="/learn">Learn</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        <NavButton to="/make">Plan</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        <NavButton to="/share">Share</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        <NavButton to="/order">Order</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        {/* Login button with a fun hover effect (rotate and scale) */}
        <motion.button
          onClick={onLoginClick}
          className="bg-gradient-to-r from-teal-500 to-cyan-400 p-2 rounded-full text-gray-900 
                   focus:outline-none focus:ring-2 focus:ring-teal-500/50
                   hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            transition: {
              rotate: {
                duration: 0.5,
                ease: "easeInOut",
              },
            },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <RiLoginBoxLine size={24} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// HeaderProps defines required props for the Header component
interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void; // Function to control login modal state
}

// Header component provides a fixed-position navigation bar at the top of the page.
// It includes brand name, desktop nav, mobile nav toggle, and animated backgrounds.
const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false); // Track mobile menu open/close state
  const [scrolled, setScrolled] = useState(false); // Track if user has scrolled

  // useEffect to add a scroll listener that updates `scrolled` state to show/hide shadow & background
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // handleLoginClick opens the login modal and closes the mobile menu if open
  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true);
    setMenuOpen(false);
  }, [setIsLoginOpen]);

  // The header is initially animated into view from above using Framer Motion
  return (
    <motion.header
      className="fixed w-full top-0 z-50" // Always visible at top of window
      initial={{ y: -100 }} // Start off-screen
      animate={{ y: 0 }}    // Animate into view
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Background shapes and floating elements for visual interest */}
      <HeaderShapeBackground />
      <HeaderFloatingElements />

      {/* Main header bar, changes style on scroll */}
      <motion.div
        className={`relative w-full transition-all duration-300 ease-in-out
          ${scrolled
            ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20 border-b border-gray-700/20 py-3"
            : "bg-transparent py-4 border-b border-transparent"}`}
        layout
      >
        {/* Container for brand logo and navigation */}
        <motion.div
          className="container mx-auto flex justify-between items-center px-6"
          layout
        >
          {/* Brand link - clicking takes user home */}
          <Link to="/" className="group relative">
            <motion.span
              className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ChefExpress
            </motion.span>
          </Link>

          {/* Desktop navigation displayed only on md and larger screens */}
          <nav className="hidden md:flex" role="navigation">
            <NavButtons onLoginClick={handleLoginClick} />
          </nav>

          {/* Mobile menu toggle button, shown only on smaller screens */}
          <motion.button
            className="md:hidden text-gray-100 focus:outline-none relative"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {/* AnimatePresence and motion.div handle menu icon transition between open/close */}
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile navigation menu, conditionally rendered and animated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
            initial={{ height: 0, opacity: 0 }}         // Start hidden and collapsed
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            role="navigation"
          >
            {/* Mobile nav buttons are stacked vertically */}
            <div className="container mx-auto py-4 px-6">
              <NavButtons onLoginClick={handleLoginClick} isMobile />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Export the Header component for use in other parts of the application
export default Header;


// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
// import { RiLoginBoxLine } from "react-icons/ri";
// import { HeaderFloatingElements, HeaderShapeBackground } from "./HeaderFloatingElements";

// interface NavButtonProps {
//   to?: string;
//   onClick?: () => void;
//   className?: string;
//   children: React.ReactNode;
// }

// const NavButton: React.FC<NavButtonProps> = ({
//   to,
//   onClick,
//   className = "",
//   children,
// }) => {
//   const location = useLocation();
//   const isActive = to ? location.pathname === to : false;

//   const combinedClasses = `
//     relative transition-transform duration-300 
//     px-4 py-2 rounded-full overflow-hidden
//     ${className} 
//     ${isActive 
//       ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 shadow-lg" 
//       : "text-gray-200 hover:text-white hover:bg-gray-800/50"
//     }`;

//   const content = (
//     <motion.div
//       initial="initial"
//       whileHover="hover"
//       whileTap="tap"
//       variants={{
//         initial: { scale: 1 },
//         hover: { scale: 1.05 },
//         tap: { scale: 0.95 },
//       }}
//       className={combinedClasses}
//     >
//       {children}
//     </motion.div>
//   );

//   return to ? (
//     <Link to={to}>{content}</Link>
//   ) : (
//     <button onClick={onClick} className="focus:outline-none">{content}</button>
//   );
// };

// interface NavButtonsProps {
//   onLoginClick: () => void;
//   isMobile?: boolean;
// }

// const NavButtons: React.FC<NavButtonsProps> = ({ onLoginClick, isMobile }) => {
//   const containerVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//       },
//     },
//   };

//   return (
//     <motion.div
//       className={`flex items-center ${isMobile ? "flex-col space-y-4" : "space-x-6"}`}
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <motion.div variants={itemVariants}>
//         <NavButton to="/">Home</NavButton>
//       </motion.div>
//       <motion.div variants={itemVariants}>
//         <NavButton to="/learn">Learn</NavButton>
//       </motion.div>
//       <motion.div variants={itemVariants}>
//         <NavButton to="/make">Plan</NavButton>
//       </motion.div>
//       <motion.div variants={itemVariants}>
//         <NavButton to="/share">Share</NavButton>
//       </motion.div>
//       <motion.div variants={itemVariants}>
//         <NavButton to="/order">Order</NavButton>
//       </motion.div>
//       <motion.div variants={itemVariants}>
//         <motion.button
//           onClick={onLoginClick}
//           className="bg-gradient-to-r from-teal-500 to-cyan-400 p-2 rounded-full text-gray-900 
//                    focus:outline-none focus:ring-2 focus:ring-teal-500/50
//                    hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
//           whileHover={{
//             scale: 1.1,
//             rotate: [0, -10, 10, 0],
//             transition: {
//               rotate: {
//                 duration: 0.5,
//                 ease: "easeInOut",
//               },
//             },
//           }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <RiLoginBoxLine size={24} />
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };

// interface HeaderProps {
//   setIsLoginOpen: (isOpen: boolean) => void;
// }

// const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       requestAnimationFrame(() => setScrolled(window.scrollY > 20));
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLoginClick = useCallback(() => {
//     setIsLoginOpen(true);
//     setMenuOpen(false);
//   }, [setIsLoginOpen]);

//   return (
//     <motion.header
//       className="fixed w-full top-0 z-50"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{
//         type: "spring",
//         stiffness: 260,
//         damping: 20,
//       }}
//     >
//       <HeaderShapeBackground />
//       <HeaderFloatingElements />

//       <motion.div
//         className={`relative w-full transition-all duration-300 ease-in-out
//           ${scrolled
//             ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20 border-b border-gray-700/20 py-3"
//             : "bg-transparent py-4 border-b border-transparent"}`}
//         layout
//       >
//         <motion.div
//           className="container mx-auto flex justify-between items-center px-6"
//           layout
//         >
//           <Link to="/" className="group relative">
//             <motion.span
//               className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
//               whileHover={{ scale: 1.05 }}
//               transition={{ type: "spring", stiffness: 400, damping: 10 }}
//             >
//               ChefExpress
//             </motion.span>
//           </Link>

//           <nav className="hidden md:flex" role="navigation">
//             <NavButtons onLoginClick={handleLoginClick} />
//           </nav>

//           <motion.button
//             className="md:hidden text-gray-100 focus:outline-none relative"
//             onClick={() => setMenuOpen(!menuOpen)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             aria-label="Toggle menu"
//           >
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={menuOpen ? "close" : "menu"}
//                 initial={{ opacity: 0, rotate: -180 }}
//                 animate={{ opacity: 1, rotate: 0 }}
//                 exit={{ opacity: 0, rotate: 180 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {menuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
//               </motion.div>
//             </AnimatePresence>
//           </motion.button>
//         </motion.div>
//       </motion.div>

//       <AnimatePresence>
//         {menuOpen && (
//           <motion.nav
//             className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
//             initial={{ height: 0, opacity: 0 }}
//             animate={{
//               height: "auto",
//               opacity: 1,
//               transition: {
//                 height: {
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 30,
//                 },
//                 opacity: {
//                   duration: 0.2,
//                 },
//               },
//             }}
//             exit={{
//               height: 0,
//               opacity: 0,
//               transition: {
//                 height: {
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 30,
//                 },
//                 opacity: {
//                   duration: 0.2,
//                 },
//               },
//             }}
//             role="navigation"
//           >
//             <div className="container mx-auto py-4 px-6">
//               <NavButtons onLoginClick={handleLoginClick} isMobile />
//             </div>
//           </motion.nav>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   );
// };

// export default Header;
