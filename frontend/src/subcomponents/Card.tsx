import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string; // Optional additional styling classes for customization
}

/**
 * Card component
 * Displays its children visually elevated with a drop shadow and padding.
 *
 * @param {React.ReactNode} children - Content to display within the card.
 * @param {string} [className] - Optional additional classes for custom styling.
 * @returns { React.JSX.Element }
 */
const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`max-w-4xl mx-auto p-4 ${className || ''}`}>
            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
                {children}
            </div>
        </div>
    );
};

export default Card;
