import React from 'react';


/**
 * Home Page
 * The Home page for the application
 * @returns {React.JSX.Element} - Home Page
 */
const Home: React.FC = () => {
    return (
        <div className=''>
            <h1 className='text-4xl font-bold text-center py-5'>Welcome to ChefExpress!</h1>
            <p className='text-xl text-center py-5'>Start cooking delicious meals with our recipes.</p>
        </div>
    );
};

export default Home;