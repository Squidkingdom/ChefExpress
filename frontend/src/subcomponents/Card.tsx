import React from 'react';



/**
 * Card component
 * Displays its children visually higher than the its parent with a bit of drop shadow.
 *
 * @param {React.ReactNode} children - HTML to display within the card
 * @returns { React.JSX.Element}
 */
const Card: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <div className="max-w-4xl mx-auto pt-4 pb-20">
          <div className="sm:mx-8 sm:border sm:shadow-xl sm:px-8 pb-8">
            {children} 
          </div>
        </div>
      );
};

export default Card;