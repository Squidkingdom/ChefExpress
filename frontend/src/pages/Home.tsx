import React from 'react';

/**
 * Home Page
 * The Home page for the ChefExpress application.
 * @returns {React.JSX.Element} - Home Page
 */
const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            {/* Hero Section */}
            <header className="text-center py-16 bg-blue-600 text-white w-full">
                <h1 className="text-5xl font-extrabold">Welcome to ChefExpress!</h1>
                <p className="text-xl mt-4">Start cooking delicious meals with our recipes.</p>
            </header>

            {/* Features Section */}
            <section className="flex flex-col items-center w-full py-12 px-6 max-w-4xl">
                <h2 className="text-3xl font-bold text-primary mb-4">Discover New Recipes Every Day</h2>
                <p className="text-lg text-gray-700 text-center mb-8 max-w-xl">
                    ChefExpress brings you a curated collection of recipes to satisfy your taste buds and inspire your culinary adventures. Whether you're a beginner or a seasoned chef, we have recipes for every skill level and taste!
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2">Variety of Recipes</h3>
                        <p className="text-gray-600">Explore recipes for every cuisine and dietary need.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2">Easy Instructions</h3>
                        <p className="text-gray-600">Simple, step-by-step guides to make cooking enjoyable.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2">Community Tips</h3>
                        <p className="text-gray-600">Connect with fellow chefs and share cooking secrets.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg my-10 text-center">
                <h3 className="text-3xl font-bold mb-6 text-primary">What Our Users Say</h3>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="bg-gray-100 p-4 rounded-lg max-w-xs mx-auto shadow">
                        <p>"ChefExpress has changed the way I cook at home. The recipes are easy to follow and delicious!"</p>
                        <p className="mt-2 font-semibold text-gray-600">- Alice</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg max-w-xs mx-auto shadow">
                        <p>"Perfect for quick meals. The variety is amazing!"</p>
                        <p className="mt-2 font-semibold text-gray-600">- Bob</p>
                    </div>
                </div>
            </section>

            {/* CTA Button */}
            <div className="py-8">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-200">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Home;
