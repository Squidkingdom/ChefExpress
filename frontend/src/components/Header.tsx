import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri";

/**
 * NavButton Component with enhanced animations and effects
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
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10 
      }
    },
    tap: { 
      scale: 0.95,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: { 
      opacity: 1, 
      scale: 1.2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
  };

  const textVariants = {
    initial: { y: 0 },
    hover: { 
      y: [-1, 1, -1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
  };

  const baseClasses = `
    relative transition-all duration-300 
    px-4 py-2 rounded-full overflow-hidden
    transform perspective-1000
  `;

  const activeClasses = `
    bg-gradient-to-r from-teal-500 to-cyan-400 
    text-gray-900 shadow-lg shadow-teal-500/30
    hover:shadow-teal-500/50 hover:from-teal-400 hover:to-cyan-300
  `;

  const inactiveClasses = `
    text-gray-200 hover:text-white 
    hover:bg-gray-800/50 hover:backdrop-blur-sm
    hover:border-teal-500/20
  `;

  const combinedClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  } ${className}`;

  const content = (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={combinedClasses}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-xl"
        variants={glowVariants}
      />
      <motion.span 
        className="relative z-10 flex items-center justify-center"
        variants={textVariants}
      >
        {children}
      </motion.span>
    </motion.div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return (
    <motion.button
      onClick={onClick}
      className="focus:outline-none focus:ring-2 focus:ring-teal-500/50"
    >
      {content}
    </motion.button>
  );
};

/**
 * Enhanced NavButtons Component
 */
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
      }
    },
  };

  return (
    <motion.div
      className={`flex items-center ${isMobile ? 'flex-col space-y-4' : 'space-x-6'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <NavButton to="/learn">Learn</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        <NavButton to="/make">Make</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
        <NavButton to="/order">Order</NavButton>
      </motion.div>
      <motion.div variants={itemVariants}>
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
              }
            }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <RiLoginBoxLine size={24} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/**
 * Enhanced Header Component
 */
interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed w-full top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <motion.div
        className={`w-full transition-all duration-300 ease-in-out
          ${scrolled 
            ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20 border-b border-gray-700/20 py-3" 
            : "bg-transparent py-4 border-b border-transparent"}`}
        layout
      >
        <motion.div 
          className="container mx-auto flex justify-between items-center px-6"
          layout
        >
          {/* Logo */}
          <Link to="/" className="group relative">
            <motion.span
              className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  backgroundSize: "200% auto",
                  backgroundImage: "linear-gradient(to right, #2dd4bf, #22d3ee, #2dd4bf)",
                }}
                className="bg-clip-text text-transparent"
              >
                ChefExpress
              </motion.span>
            </motion.span>
            <motion.div
              className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-teal-500/20 to-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex" role="navigation">
            <NavButtons onLoginClick={handleLoginClick} />
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-100 focus:outline-none relative"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? (
                  <AiOutlineClose size={28} />
                ) : (
                  <AiOutlineMenu size={28} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile Navigation */}
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
                  damping: 30
                },
                opacity: {
                  duration: 0.2
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                opacity: {
                  duration: 0.2
                }
              }
            }}
            role="navigation"
          >
            <div className="container mx-auto py-4 px-6">
              <NavButtons onLoginClick={handleLoginClick} isMobile />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;