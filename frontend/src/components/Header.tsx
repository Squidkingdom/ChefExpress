import React from 'react';
import { Link } from 'react-router-dom';


const NavButton: React.FC<{to: string; children: React.ReactNode}> = ({ to, children }) => {
    return (
        <Link
            to={to}
            className="text-xl outline outline-1 outline-gray-600 block font-semibold px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-300"
        >
            {children}
        </Link>
    );
};

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
    )
};

export default Header;