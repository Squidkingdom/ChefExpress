import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

/**
 * Interface for Navigation buttons.
 *
 * @interface NavButtonProps
 */
interface NavButtonProps {
    to: string;
    children: React.ReactNode;
}

/**
 * A button component for navigation that renders a link styled as a button.
 *
 * @param {NavButtonProps} props - The properties for the NavButton component.
 * @returns {JSX.Element} The rendered NavButton component.
 */
const NavButton: React.FC<NavButtonProps> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`text-lg font-semibold px-4 py-2 rounded-lg transition duration-300 ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
        >
            {children}
        </Link>
    );
};

/**
 * A component that renders a set of navigation buttons.
 * @returns {JSX.Element} The rendered NavButtons component containing multiple NavButton components.
 */
const NavButtons: React.FC = () => (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <NavButton to="/Learn">Learn</NavButton>
        <NavButton to="/Make">Make</NavButton>
        <NavButton to="/Order">Order</NavButton>
        <NavButton to="/Share">Share</NavButton>
        <NavButton to="/Login">Login</NavButton>
    </div>
);

/**
 * The header component that contains the site title, navigation links, and responsive menu toggle.
 * @returns {JSX.Element} The rendered Header component containing the site title and navigation buttons.
 */
const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center p-5">
                <Link to="/" className="text-3xl font-bold">ChefExpress</Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex">
                    <NavButtons />
                </nav>

                {/* Mobile Menu Icon */}
                <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <nav className="md:hidden bg-gray-700 p-4">
                    <NavButtons />
                </nav>
            )}
        </header>
    );
};

export default Header;
