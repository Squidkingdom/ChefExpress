// src/pages/Home.tsx

import React from "react";
import { FaUtensils, FaBookOpen, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

/**
 * Interface for Home component props.
 */
interface HomeProps {
  setRunTour: (run: boolean) => void;
}

/**
 * Home Page
 * Enhanced with interactive elements, animations, and a modern design.
 * @returns {React.JSX.Element} - Enhanced Home Page
 */
const Home: React.FC<HomeProps> = ({ setRunTour }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <header
        className="hero-section relative flex flex-col justify-center items-center text-center py-32 bg-cover bg-center w-full"
        style={{
          backgroundImage: "url('/images/hero-background.jpg')",
        }}
        id="hero"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>

        <motion.div
          className="max-w-4xl px-4 relative z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-teal-400 mb-6">
            Welcome to{" "}
            <span className="text-white">Chef</span>
            <span className="text-teal-500">Express</span>!
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 mb-8">
            Ready to cook something delicious today?
          </p>
          <button
            className="px-8 py-4 bg-teal-500 text-gray-900 rounded-full font-semibold text-xl hover:bg-teal-400 transition duration-300"
            onClick={() => setRunTour(true)}
            id="cta-button"
          >
            Take a Tour
          </button>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="features-section py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              className="feature-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center"
              id="feature-variety"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaUtensils className="text-teal-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-teal-400 mb-4">
                Variety of Recipes
              </h3>
              <p className="text-gray-300">
                Explore recipes tailored to your taste. From quick snacks to
                gourmet meals, find it all here.
              </p>
            </motion.div>
            <motion.div
              className="feature-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center"
              id="feature-instructions"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaBookOpen className="text-teal-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-teal-400 mb-4">
                Step-by-Step Guides
              </h3>
              <p className="text-gray-300">
                Easy instructions with visuals to make cooking enjoyable and
                hassle-free.
              </p>
            </motion.div>
            <motion.div
              className="feature-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center"
              id="feature-community"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaUsers className="text-teal-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-teal-400 mb-4">
                Community Engagement
              </h3>
              <p className="text-gray-300">
                Share and discover tips with fellow chefs. Join our vibrant
                community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section
        className="parallax-section bg-fixed bg-center bg-cover text-center text-white"
        style={{
          backgroundImage: "url('/images/parallax-background.jpg')",
        }}
      >
        <div className="bg-gray-900 bg-opacity-60 py-20 px-4">
          <h2 className="text-4xl font-bold mb-6">
            Cooking Made <span className="text-teal-500">Simple</span> and{" "}
            <span className="text-teal-500">Fun</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Whether you're a beginner or a seasoned chef, ChefExpress offers
            tools and resources to enhance your culinary journey.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="bg-gray-900 py-20 px-6"
        id="testimonials-section"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Hear from Our Community
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              className="testimonial-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 italic mb-4">
                "ChefExpress makes cooking fun and easy!"
              </p>
              <p className="text-teal-400 font-semibold">- Alex</p>
            </motion.div>
            <motion.div
              className="testimonial-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 italic mb-4">
                "A daily source of inspiration for my meals."
              </p>
              <p className="text-teal-400 font-semibold">- Jamie</p>
            </motion.div>
            <motion.div
              className="testimonial-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 italic mb-4">
                "The community tips are a game-changer!"
              </p>
              <p className="text-teal-400 font-semibold">- Taylor</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} ChefExpress. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
