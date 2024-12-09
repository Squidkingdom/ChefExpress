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

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  FaBookOpen,
  FaUtensils,
  FaArrowRight,
  FaPaperPlane,
  FaShoppingCart,
  FaShareAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal"; // Make sure to create this file

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const missionRef = useRef<HTMLDivElement>(null);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  // Check if hero animation played this session
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("heroAnimationPlayed");
    if (hasPlayed) {
      // Skip animations this session
      setShowAnimation(false);
    } else {
      // First time this session: run animations and set the flag
      sessionStorage.setItem("heroAnimationPlayed", "true");
    }
  }, []);

  // Enhanced parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Smoother spring animation
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const features = [
    {
      icon: FaBookOpen,
      title: "Learn",
      description: "Discover a world of culinary knowledge and skills and become a better chef!",
      link: "/Learn",
      modalDescription: [
        "Access expert-curated courses and interactive tutorials designed for all skill levels",
        "Master essential cooking techniques from basic to advanced",
        "Learn professional kitchen tips and tricks",
        "Learn about Food Science and Safety",
        "Tutorials from Chef Gordon Ramsay",
        "Watch step-by-step video demonstrations"
      ]
    },
    {
      icon: FaUtensils,
      title: "Meal Planner",
      description: "Add your own or use our recipes to create a meal plan!",
      link: "/Make",
      modalDescription: [
        "Create customized weekly meal plans tailored to your preferences",
        "Import your favorite recipes or choose from our collection",
        "Export your meal plan with full recipe and instructions",
        "Track nutritional information for balanced meals",
        "Plan meals based on dietary requirements and restrictions"
      ]
    },
    {
      icon: FaShareAlt,
      title: "Share",
      description: "Explore and share your favorite recipes with the community!",
      link: "/Share",
      modalDescription: [
        "Upload and share your original recipes with the community",
        "Showcase your culinary creations with photos",
        "Connect with fellow food enthusiasts",
        "Explore recipes shared by others",
        "Explore Recipes provided by us",
        "Save and organize your favorite community recipes"
      ]
    },
    {
      icon: FaShoppingCart,
      title: "Order",
      description: "Easily order tools and have them delivered to your door!",
      link: "/Order",
      modalDescription: [
        "Browse professional-grade kitchen tools and equipment",
        "Get chef-recommended cookware and utensils",
        "Direct acces to Amazon ensuring best prices and fast delivery",
        "Professional products selected by our experts",
        "Find specialty cooking ingredients",
        "No need to wonder what to buy, our recipes will let you know"
      ]
    }
  ];

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    console.log("Subscribed with email:", email);
    setIsSubscribed(true);
    setEmail("");
  };

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
      {/* Shared Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),transparent_60%)]" />
        </div>
      </div>

      {/* Modified Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: smoothY, opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
          initial={showAnimation ? { opacity: 0, y: 50 } : false}
          animate={showAnimation ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 1.2, type: "spring", damping: 20 }}
        >
          <div className="relative">
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold mb-8 relative"
              initial={showAnimation ? { opacity: 0, y: 20 } : false}
              animate={showAnimation ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                Welcome to{" "}
              </span>
              <br />
              <motion.div
                initial={showAnimation ? { opacity: 0, y: 20 } : false}
                animate={showAnimation ? { opacity: 1, y: 0 } : false}
                transition={{ delay: 0.6 }}
                className="inline-block"
              >
                <span className="text-white">Chef</span>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Express
                </span>
              </motion.div>
            </motion.h1>

            <motion.p
              className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Experience the future of cooking
              <br />
              <span className="text-teal-400">one recipe at a time</span>
            </motion.p>

            <motion.button
              initial={showAnimation ? { opacity: 0, y: 20 } : false}
              animate={showAnimation ? { opacity: 1, y: 0 } : false}
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

      {/* Mission Statement */}
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
              <React.Fragment key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
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

                    <button
                      type="button"
                      onClick={() => setSelectedFeature(index)}
                      className="mt-6 bg-teal-500 text-gray-900 px-4 py-2 rounded-full hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                    >
                      Learn More
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>

                <Modal
                  isOpen={selectedFeature === index}
                  onClose={() => setSelectedFeature(null)}
                  title={feature.title}
                  description={feature.modalDescription}
                  onNavigate={() => {
                    setSelectedFeature(null);
                    navigate(feature.link);
                  }}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.section>

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
