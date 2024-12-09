/***************************************************************************************************
 * Name of code artifact: Home.tsx
 * Brief description of what the code does:
 *   This file defines the Home component, serving as a landing page for the ChefExpress application.
 *   It includes a hero section, mission statement, feature highlights, statistics, testimonials,
 *   and a newsletter subscription section. Users can scroll through the page to learn about the 
 *   platform’s capabilities, and smoothly transition to other pages or actions (like viewing features).
 * Programmer’s name: Darshil
 * Date the code was created: 11/1/24
 * Dates the code was revised: 12/8/24
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added advanced animations, refined layout and styling, and integrated 
 *   a newsletter subscription form for user engagement.
 * Preconditions:
 *   - React environment set up.
 *   - Dependencies: react-router-dom for navigation, framer-motion for animations, react-icons for icons.
 * Acceptable and unacceptable input values or types:
 *   - This component does not take direct input values. It depends on scroll and user interactions.
 * Postconditions:
 *   - Renders a fully interactive and animated homepage.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - No error handling needed as this page mostly displays static data and handles user actions.
 * Side effects:
 *   - Scroll event listener to adjust animation based on scroll position.
 *   - console.log for subscriptions could be extended into a real API call.
 * Invariants:
 *   - The layout and structure remain consistent; only user interactions and scroll animate elements.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - Hero Section: Presents the app name and a "Start Exploring" button.
 *   - Mission Statement, Features, Stats, Testimonials, Newsletter: Sequential sections each 
 *     animated into view as the user scrolls.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/pages/Home.tsx

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  FaBookOpen,      // Icon for "Learn"
  FaUtensils,       // Icon for "Meal Planner"
  FaArrowRight,     // Arrow icon for buttons
  FaPaperPlane,     // Icon for newsletter send
  FaShoppingCart,   // Icon for "Order"
  FaShareAlt,       // Icon for "Share"
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HomeProps {}

/**
 * Home component:
 * Serves as the landing page with a hero section, mission statement, feature highlights, stats, 
 * testimonials, and a newsletter signup. Integrates animations based on scroll and user interaction.
 */
const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const missionRef = useRef<HTMLDivElement>(null);

  // Parallax-like transforms based on scroll position
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  // Spring animation for smoother motion
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  // Container and item variants for staggered animations in Features section
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // Features array defines the platform features displayed in a grid
  const features = [
    {
      icon: FaBookOpen,
      title: "Learn",
      description: "Discover a world of culinary knowledge and skills and become a better chef!",
      link: "/Learn",
    },
    {
      icon: FaUtensils,
      title: "Meal Planner",
      description: "Add your own or use our recipes to create a meal plan!",
      link: "/Make",
    },
    {
      icon: FaShareAlt,
      title: "Share",
      description: "Explore and share your favorite recipes with the community!",
      link: "/Share",
    },
    {
      icon: FaShoppingCart,
      title: "Order",
      description: "Easily order tools and have them delivered to your door!",
      link: "/Order",
    },
  ];

  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Handle newsletter subscription
  const handleSubscribe = () => {
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    console.log("Subscribed with email:", email);
    setIsSubscribed(true);
    setEmail("");
  };

  // Scrolls smoothly to the mission section
  const scrollToMission = () => {
    if (missionRef.current) {
      const top =
        missionRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: top - 48,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden relative">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),transparent_60%)]" />
        </div>
      </div>

      {/* Hero Section with title and start exploring button */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: smoothY, opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, type: "spring", damping: 20 }}
        >
          <div className="relative">
            {/* Glowing gradient behind hero text */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
            />

            {/* Animated heading text */}
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold mb-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                Welcome to{" "}
              </span>
              <br />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block"
              >
                <span className="text-white">Chef</span>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Express
                </span>
              </motion.div>
            </motion.h1>

            {/* Hero subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
            >
              Experience the future of cooking,{" "}
              <span className="text-teal-400">one recipe at a time</span>
            </motion.p>

            {/* Start Exploring button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                       font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                       hover:shadow-teal-500/40 transition-all duration-300"
              onClick={scrollToMission}
              aria-label="Start Exploring Our Mission"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Exploring
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                            opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Mission Statement Section */}
      <motion.section
        ref={missionRef}
        className="py-20 px-6 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-300 leading-relaxed"
          >
            To empower home cooks and professional chefs alike by providing a seamless
            cooking experience, from discovering new recipes to sharing culinary creations
            with the community.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        animate="visible"
        className="py-24 px-6 relative"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Explore, Learn, Create, Share
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Background glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

                <div className="relative z-10 h-full backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    <feature.icon className="text-6xl mb-6 text-teal-400" />
                    <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(feature.link)}
                    className="mt-6 bg-teal-500 text-gray-900 px-4 py-2 rounded-full hover:bg-teal-400 transition duration-200 flex items-center"
                  >
                    Learn More
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { number: "10k+", label: "Recipes" },
              { number: "50k+", label: "Active Chefs" },
              { number: "100k+", label: "Monthly Users" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.h4
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {stat.number}
                </motion.h4>
                <p className="text-gray-400 transform group-hover:scale-105 transition-transform duration-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
          >
            What Chefs Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "ChefExpress revolutionized my cooking journey!",
                author: "Alex Chen",
                role: "Home Chef",
              },
              {
                text: "The AI-powered recommendations are spot-on!",
                author: "Sarah Johnson",
                role: "Food Blogger",
              },
              {
                text: "Best cooking platform I've ever used!",
                author: "Mike Peterson",
                role: "Professional Chef",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  transition: { type: "spring", stiffness: 400, damping: 30 },
                }}
                className="group relative flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

                <div className="relative z-10 backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 p-8 rounded-2xl shadow-lg flex flex-col justify-between h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative">
                    <div className="absolute -top-4 -left-2 text-4xl text-teal-500/20">
                      "
                    </div>
                    <p className="text-gray-300 italic mb-6 flex-grow relative z-10">
                      {testimonial.text}
                    </p>
                    <div className="absolute -bottom-4 -right-2 text-4xl text-teal-500/20">
                      "
                    </div>
                  </div>

                  <div className="relative z-10">
                    <motion.p
                      whileHover={{ x: 5 }}
                      className="font-semibold text-teal-400"
                    >
                      {testimonial.author}
                    </motion.p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-gray-800/50 border border-gray-700/50 p-12 rounded-2xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0">
              {/* Animated background for newsletter section */}
              <motion.div
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(45,212,191,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(45,212,191,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 0%, rgba(45,212,191,0.1) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0"
              />
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Join Our Newsletter
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 mb-8"
              >
                Get weekly recipes and cooking tips delivered to your inbox
              </motion.p>
              {!isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-6 py-3 bg-gray-700 text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubscribe}
                    className="flex items-center justify-center px-6 py-3 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-400 transition duration-200 group"
                  >
                    Subscribe
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2"
                    >
                      <FaPaperPlane />
                    </motion.span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                  className="text-green-400 text-xl font-semibold"
                >
                  Thank you for subscribing!
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
