/**
 * Name: Card.tsx
 * Description: This component displays its children within a styled card. The card is visually elevated with a drop shadow and includes padding. It allows customization via an optional className prop.
 * Programmer's name: Brady, Darshil
 * Date the code was created: 11/20/24
 * Date the code was revised: 11/24/24
 * Preconditions:
 *   - React must be properly set up in the project.
 * Acceptable input values or types:
 *   - `children`: React.ReactNode — The content to display inside the card.
 *   - `className`: string (optional) — Custom CSS class names to further style the card.
 * Postconditions:
 *   - The component renders a card-like div element with the given children and optional styling.
 * Return values or types:
 *   - React.JSX.Element — A JSX element representing the card component.
 * Error and exception condition values:
 *   - None explicitly handled.
 * Side effects:
 *   - Renders the children within a styled card element.
 * Invariants:
 *   - The children are always wrapped in a div element with default and optional styles.
 * Known faults:
 *   - None explicitly mentioned.
 */

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
