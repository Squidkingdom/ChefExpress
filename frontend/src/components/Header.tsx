// src/components/Header.tsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

/**
 * Interface for Navigation buttons.
 */
interface NavButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * A button component for navigation that renders a link or button.
 */
const NavButton: React.FC<NavButtonProps> = ({ to, onClick, className = "", children }) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  const commonClasses =
    "text-lg font-medium px-4 py-2 rounded-lg transition duration-300";

  if (to) {
    return (
      <Link
        to={to}
        className={`${commonClasses} ${className} ${
          isActive
            ? "bg-teal-500 text-gray-900"
            : "text-gray-300 hover:text-white hover:bg-gray-700"
        }`}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClick}
        className={`${commonClasses} ${className} text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none`}
      >
        {children}
      </button>
    );
  }
};

/**
 * A component that renders a set of navigation buttons.
 */
const NavButtons: React.FC<{ onLoginClick: () => void }> = ({
  onLoginClick,
}) => (
  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
    <NavButton to="/learn">Learn</NavButton>
    <NavButton to="/make">Make</NavButton>
    <NavButton to="/order">Order</NavButton>
    <NavButton to="/share">Share</NavButton>
    <NavButton onClick={onLoginClick} className="login-button">
      Login
    </NavButton>
  </div>
);

/**
 * Interface for Header props.
 */
interface HeaderProps {
  setIsLoginOpen: (isOpen: boolean) => void;
}

/**
 * The header component that contains the site title, navigation links, and responsive menu toggle.
 */
const Header: React.FC<HeaderProps> = ({ setIsLoginOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-gray-900 text-gray-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Site Logo */}
        <Link to="/" className="text-3xl font-extrabold text-teal-500">
          ChefExpress
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex navbar"> {/* Added 'navbar' class here */}
          <NavButtons onLoginClick={handleLoginClick} />
        </nav>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-gray-100 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-800 border-t border-gray-700 py-4 navbar"> {/* Added 'navbar' class here */}
          <NavButtons onLoginClick={handleLoginClick} />
        </nav>
      )}
    </header>
  );
};

export default Header;
