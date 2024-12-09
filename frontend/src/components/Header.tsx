/***************************************************************************************************
 * Name of code artifact: Header.tsx
 * Brief description of what the code does:
 *   This file defines the Header component for the ChefExpress application. It provides a responsive 
 *   top navigation bar with branding, navigation links, login button, and a mobile-responsive menu 
 *   that toggles. It also includes animated background elements and visual transitions as the user 
 *   scrolls.
 * Programmer’s name: Darshil Patel
 * Date the code was created: 11/3/24
 * Dates the code was revised: 11/12/24
 * Brief description of each revision & author:
 *   11/12/24 - Brady Holland: Added mobile menu animations, integrated login modal trigger, and 
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

import React, { useState, useEffect, useCallback } from "react"; // Importing React and related hooks
import { NavLink } from "react-router-dom"; // Importing NavLink for navigation
import { motion, AnimatePresence } from "framer-motion"; // Importing motion components for animations
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Importing menu icons
import { RiLoginBoxLine } from "react-icons/ri"; // Importing a login icon
import { HeaderFloatingElements, HeaderShapeBackground } from "./HeaderFloatingElements"; // Importing custom header floating elements

// Define an array of navigation items, each with a path and label
const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/learn", label: "Learn" },
  { path: "/make", label: "Plan" },
  { path: "/share", label: "Share" },
  { path: "/order", label: "Order" },
];

// Define the interface for NavButtonProps, specifying optional props and child elements
interface NavButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

// NavButton component: a button or link with hover/tap animations
const NavButton: React.FC<NavButtonProps> = ({
  to,
  onClick,
  className = "",
  children,
}) => {
  // Combine default and passed-in classes for styling
  const combinedClasses = `
    relative transition-transform duration-300 
    px-6 py-2 rounded-full overflow-hidden
    inline-flex items-center justify-center
    min-w-[100px] mx-2
    ${className}`;

  // The content inside the button/link is animated using Framer Motion variants
  const content = (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={{
        initial: { scale: 1 }, // Default scale
        hover: { scale: 1.05 }, // Slightly larger on hover
        tap: { scale: 0.95 },   // Slightly smaller on tap
      }}
      className="w-full text-center"
    >
      {children} 
    </motion.div>
  );

  // If a 'to' prop is provided, render a NavLink; otherwise, render a button element
  return to ? (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${combinedClasses} ${
          isActive
            ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 shadow-lg"
            : "text-gray-200 hover:text-white hover:bg-gray-800/50"
        }`
      }
    >
      {content}
    </NavLink>
  ) : (
    <button onClick={onClick} className={`focus:outline-none ${combinedClasses}`}>
      {content}
    </button>
  );
};

// Define props for NavButtons, including a login click handler and optional mobile flag
interface NavButtonsProps {
  onLoginClick: () => void;
  isMobile?: boolean;
}

// NavButtons component: a container for multiple NavButton components and a login button
const NavButtons: React.FC<NavButtonsProps> = ({ onLoginClick, isMobile }) => {
  // Variants for the container, used by Framer Motion to animate child items in a staggered fashion
  const containerVariants = {
    hidden: { opacity: 0, y: -20 }, // Hidden state: slightly above and transparent
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,   // Stagger each child by 0.1s
        delayChildren: 0.2,     // Delay children start
      },
    },
  };

  // Variants for individual items: they pop in from above with a spring animation
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

  // Classes for mobile vs. desktop layout
  const mobileClasses = "flex-col space-y-6 w-full items-center py-4";
  const desktopClasses = "items-center";

  return (
    <motion.div
      className={`flex ${isMobile ? mobileClasses : desktopClasses}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Map through the NAV_ITEMS array and create a NavButton for each */}
      {NAV_ITEMS.map((item) => (
        <motion.div 
          key={item.path} 
          variants={itemVariants}
          className={isMobile ? "w-full flex justify-center" : ""}
        >
          <NavButton to={item.path}>{item.label}</NavButton>
        </motion.div>
      ))}

      {/* The login button, only shown at the end of the navigation items */}
      <motion.div 
        variants={itemVariants}
        className={isMobile ? "w-full flex justify-center mt-4" : "ml-4"}
      >
        <motion.button
          onClick={onLoginClick}
          className="bg-gradient-to-r from-teal-500 to-cyan-400 p-3 rounded-full text-gray-900 
                   focus:outline-none focus:ring-2 focus:ring-teal-500/50
                   hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300
                   min-w-[48px] flex items-center justify-center"
          whileHover={{
            scale: 1.1,           // Slightly enlarge on hover
            rotate: [0, -10, 10, 0], // Add a playful rotate animation sequence
            transition: {
              rotate: {
                duration: 0.5,
                ease: "easeInOut",
              },
            },
          }}
          whileTap={{ scale: 0.95 }} // Shrink slightly on tap
        >
          <RiLoginBoxLine size={24} /> {/* Login icon */}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Define HeaderProps interface: header component needs a function to set the login modal state
interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void;
}

// Header component: includes brand name, nav items, and responsive menu
const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  // menuOpen state controls whether the mobile menu is visible
  const [menuOpen, setMenuOpen] = useState(false);
  // scrolled state indicates if the user has scrolled down
  const [scrolled, setScrolled] = useState(false);

  // useEffect to handle scroll events and update scrolled state
  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for performance
      requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // handleLoginClick: sets login modal open and closes the menu if open
  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true);
    setMenuOpen(false);
  }, [setIsLoginOpen]);

  return (
    <motion.header
      className="fixed w-full top-0 z-50"
      initial={{ y: -100 }}    // Start off-screen from top
      animate={{ y: 0 }}       // Animate into view
      transition={{
        type: "spring", 
        stiffness: 260, 
        damping: 20,
      }}
    >
      {/* Background and floating elements behind the header */}
      <HeaderShapeBackground />
      <HeaderFloatingElements />

      {/* The main header container */}
      <motion.div
        className={`relative w-full transition-all duration-300 ease-in-out
          ${scrolled
            ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20 border-b border-gray-700/20 py-3"
            : "bg-transparent py-4 border-b border-transparent"}`}
        layout
      >
        {/* Inner container with brand and navigation */}
        <motion.div
          className="container mx-auto flex justify-between items-center px-6 lg:px-8"
          layout
        >
          {/* Brand logo/name */}
          <NavLink to="/" className="group relative">
            <motion.span
              className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }} // Slight zoom on hover
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ChefExpress
            </motion.span>
          </NavLink>

          {/* Desktop navigation (hidden on small screens) */}
          <nav className="hidden md:flex justify-end" role="navigation">
            <NavButtons onLoginClick={handleLoginClick} />
          </nav>

          {/* Mobile menu toggle button (hamburger/close icon) */}
          <motion.button
            className="md:hidden text-gray-100 focus:outline-none relative p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }} // Slight zoom on hover
            whileTap={{ scale: 0.9 }}   // Slight shrink on tap
            aria-label="Toggle menu"
          >
            {/* AnimatePresence to animate between menu and close icons */}
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? "close" : "menu"}    // Key changes based on state
                initial={{ opacity: 0, rotate: -180 }} // Start rotated and transparent
                animate={{ opacity: 1, rotate: 0 }}    // Rotate to normal and appear
                exit={{ opacity: 0, rotate: 180 }}      // Rotate out when exit
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile navigation menu, displayed when menuOpen is true */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
            initial={{ height: 0, opacity: 0 }}      // Start collapsed and invisible
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
            <div className="container mx-auto px-6">
              {/* NavButtons with isMobile prop for vertical layout */}
              <NavButtons onLoginClick={handleLoginClick} isMobile />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Export the Header component as default
export default Header;
