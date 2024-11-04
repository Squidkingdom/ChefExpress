import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Interface for Navigation buttons.
 *
 * @interface NavButtonProps
 */
interface NavButtonProps {
    /**
     * The path to navigate to when the button is clicked.
     * @type {string}
     */
    to: string;

    /**
     * The content to be displayed inside the button.
     * Usually used for button text
     * @type {React.ReactNode}
     */
    children: React.ReactNode;
}

/**
 * A button component for navigation that renders a link styled as a button.
 *
 * @param {NavButtonProps} props - The properties for the NavButton component.
 * @param {string} props.to - The path to navigate to.
 * @param {React.ReactNode} props.children - The content of the button.
 * @returns {JSX.Element} The rendered NavButton component.
 */
const NavButton: React.FC<NavButtonProps> = ({ to, children }) => {
    return (
        <Link
            to={to}
            className="text-xl outline outline-1 outline-gray-600 block font-semibold px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-300"
        >
            {children}
        </Link>
    );
};

/**
 * A component that renders a set of navigation buttons.
 * @returns {JSX.Element} The rendered NavButtons component containing multiple NavButton components.
 */
const NavButtons: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row lg:space-x-4 ">
            <NavButton to="/Learn">Learn</NavButton>
            <NavButton to="/Make">Make</NavButton>
            <NavButton to="/Order">Order</NavButton>
            <NavButton to="/Share">Share</NavButton>
            <NavButton to="/Login">Login</NavButton>
        </div>
    );
};

/**
 * The header component that contains the site title and navigation links.
 * @returns {JSX.Element} The rendered Header component containing the site title and navigation buttons.
 */
const Header: React.FC = () => {
    return (
        <header className='bg-gray-800 text-white p-5'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to='/' className='text-2xl font-bold'>ChefExpress</Link>
                <nav className="hidden md:flex">
                    <NavButtons />
                </nav>
            </div>
        </header>
    );
};

export default Header;
