// src/components/Header.tsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";

/**
 * NavButton Component
 */
interface NavButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  to,
  onClick,
  className = "",
  children,
}) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const baseClasses =
    "relative transition-all duration-300 px-4 py-2 rounded-full overflow-hidden";

  const activeClasses =
    "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 shadow-lg shadow-teal-500/30";

  const inactiveClasses =
    "text-gray-200 hover:text-white hover:bg-gray-800/50";

  const combinedClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  } ${className}`;

  if (to) {
    return (
      <Link to={to}>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={combinedClasses}
        >
          <span className="relative z-10">{children}</span>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className={`${combinedClasses} focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

/**
 * NavButtons Component
 */
interface NavButtonsProps {
  onLoginClick: () => void;
}

const NavButtons: React.FC<NavButtonsProps> = ({ onLoginClick }) => (
  <div className="flex items-center space-x-6">
    <NavButton to="/learn">Learn</NavButton>
    <NavButton to="/make">Make</NavButton>
    <NavButton to="/order">Order</NavButton>
    {/* Removed the "Share" button */}
    <motion.button
      onClick={onLoginClick}
      className="bg-gradient-to-r from-teal-500 to-cyan-400 p-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Login"
    >
      <RiLoginBoxLine size={24} />
    </motion.button>
  </div>
);

/**
 * Header Component
 */
interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll to apply background to the header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="group relative">
          <motion.span
            className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            ChefExpress
          </motion.span>
          <motion.div
            className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex navbar" role="navigation">
          <NavButtons onLoginClick={handleLoginClick} />
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-100 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <AiOutlineClose size={28} />
          ) : (
            <AiOutlineMenu size={28} />
          )}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            role="navigation"
          >
            <div className="container mx-auto py-4 px-6">
              <NavButtons onLoginClick={handleLoginClick} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
