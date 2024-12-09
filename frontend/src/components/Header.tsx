import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";
import { HeaderFloatingElements, HeaderShapeBackground } from "./HeaderFloatingElements";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/learn", label: "Learn" },
  { path: "/make", label: "Plan" },
  { path: "/share", label: "Share" },
  { path: "/order", label: "Order" },
];

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
  const combinedClasses = `
    relative transition-transform duration-300 
    px-6 py-2 rounded-full overflow-hidden
    inline-flex items-center justify-center
    min-w-[100px] mx-2
    ${className}`;

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
      className="w-full text-center"
    >
      {children}
    </motion.div>
  );

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

interface NavButtonsProps {
  onLoginClick: () => void;
  isMobile?: boolean;
}

const NavButtons: React.FC<NavButtonsProps> = ({ onLoginClick, isMobile }) => {
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

  const mobileClasses = "flex-col space-y-6 w-full items-center py-4";
  const desktopClasses = "items-center";

  return (
    <motion.div
      className={`flex ${isMobile ? mobileClasses : desktopClasses}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {NAV_ITEMS.map((item) => (
        <motion.div 
          key={item.path} 
          variants={itemVariants}
          className={isMobile ? "w-full flex justify-center" : ""}
        >
          <NavButton to={item.path}>{item.label}</NavButton>
        </motion.div>
      ))}
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

interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true);
    setMenuOpen(false);
  }, [setIsLoginOpen]);

  return (
    <motion.header
      className="fixed w-full top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <HeaderShapeBackground />
      <HeaderFloatingElements />

      <motion.div
        className={`relative w-full transition-all duration-300 ease-in-out
          ${scrolled
            ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20 border-b border-gray-700/20 py-3"
            : "bg-transparent py-4 border-b border-transparent"}`}
        layout
      >
        <motion.div
          className="container mx-auto flex justify-between items-center px-6 lg:px-8"
          layout
        >
          <NavLink to="/" className="group relative">
            <motion.span
              className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ChefExpress
            </motion.span>
          </NavLink>

          <nav className="hidden md:flex justify-end" role="navigation">
            <NavButtons onLoginClick={handleLoginClick} />
          </nav>

          <motion.button
            className="md:hidden text-gray-100 focus:outline-none relative p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
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

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
            initial={{ height: 0, opacity: 0 }}
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
              <NavButtons onLoginClick={handleLoginClick} isMobile />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;