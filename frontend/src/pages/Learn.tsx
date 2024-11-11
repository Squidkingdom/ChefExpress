import React from 'react';

/**
 * Learn Page
 * The Learning page for the ChefExpress application
 * @returns {React.JSX.Element} - Learn Page
 */
const Learn: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            {/* Hero Section */}
            <header className="text-center py-16 bg-blue-600 text-white w-full">
                <h1 className="text-5xl font-extrabold">Welcome to the Learning Center!</h1>
                <p className="text-xl mt-4">Explore new techniques, tips, and recipes.</p>
            </header>

            {/* Search and Filter Section */}
            <section className="w-full max-w-4xl py-12 px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
                    <input
                        type="text"
                        placeholder="Search for a topic..."
                        className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                    />
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                            Beginner
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                            Intermediate
                        </button>
                        <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200">
                            Advanced
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Tutorials Section */}
            <section className="w-full max-w-4xl py-12 px-6">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Tutorials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center transition hover:shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2">Knife Skills 101</h3>
                        <p className="text-gray-600">Learn essential knife techniques to elevate your cooking.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center transition hover:shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2">Perfect Pasta</h3>
                        <p className="text-gray-600">Master pasta-making techniques from scratch.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center transition hover:shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2">Baking Basics</h3>
                        <p className="text-gray-600">Start baking with simple techniques and easy recipes.</p>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="w-full max-w-4xl py-12 px-6 bg-gray-50 rounded-lg shadow-lg my-12">
                <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200">
                        Appetizers
                    </button>
                    <button className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                        Main Courses
                    </button>
                    <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                        Desserts
                    </button>
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                        Beverages
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Learn;
