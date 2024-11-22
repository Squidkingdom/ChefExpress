import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";

interface NavButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  isLogin?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ to, onClick, className = "", children, isLogin }) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const commonClasses = `
    relative transition-all duration-300 backdrop-blur-md
    before:absolute before:inset-0 before:rounded-full before:transition-all
    before:duration-300 before:opacity-0 before:hover:opacity-100
    overflow-hidden
  `;

  if (to) {
    return (
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Link
          to={to}
          className={`
            ${commonClasses}
            ${className}
            ${isActive
              ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 shadow-lg shadow-teal-500/30"
              : "text-gray-200 hover:text-white hover:bg-gray-800/50"
            }
            px-4 py-2 rounded-full
          `}
        >
          <span className="relative z-10">{children}</span>
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 blur-xl"
              layoutId="activeNav"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={`
        ${commonClasses}
        ${className}
        ${isLogin
          ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
          : "text-gray-200 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50"
        }
        p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50
      `}
    >
      {isLogin ? (
        <RiLoginBoxLine className="relative z-10" />
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </motion.button>
  );
};

const NavButtons: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => (
  <div className="flex items-center space-x-6">
    <NavButton to="/learn">Learn</NavButton>
    <NavButton to="/make">Make</NavButton>
    <NavButton to="/order">Order</NavButton>
    <NavButton to="/share">Share</NavButton>
    <motion.button
      onClick={onLoginClick}
      className="bg-gradient-to-r from-teal-500 to-cyan-400 p-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <RiLoginBoxLine size={24} />
    </motion.button>
  </div>
);

interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`
        fixed w-full top-0 z-50
        transition-all duration-300 ease-in-out
        ${scrolled
          ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20"
          : "bg-transparent"
        }
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
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
        <nav className="hidden md:flex navbar">
          <NavButtons onLoginClick={handleLoginClick} />
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-100 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
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