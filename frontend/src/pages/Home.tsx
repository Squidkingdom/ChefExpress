import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { FaUtensils, FaBookOpen, FaUsers, FaArrowRight } from "react-icons/fa";

interface HomeProps {
  setRunTour: (run: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setRunTour }) => {
  const { scrollY } = useScroll();
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Parallax effect for hero section
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Smooth spring animation for scroll-driven effects
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
        </div>
      </div>
      

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: smoothY, opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl transform -translate-y-1/2" />
            
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                Welcome to{" "}
              </span>
              <div className="inline-block">
                <span className="text-white">Chef</span>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Express
                </span>
              </div>
            </h1>

            <p className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed">
              Experience the future of cooking,{" "}
              <span className="text-teal-400">one recipe at a time</span>
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
              onClick={() => setRunTour(true)}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating elements background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-teal-500/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </header>

      {/* Features Section */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="py-32 px-6 relative"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              What We Offer
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaUtensils,
                title: "Recipe Variety",
                description: "Explore a world of flavors with our diverse recipe collection",
              },
              {
                icon: FaBookOpen,
                title: "Smart Guides",
                description: "Interactive, AI-powered cooking instructions",
              },
              {
                icon: FaUsers,
                title: "Chef Community",
                description: "Connect with passionate food enthusiasts worldwide",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
                <div className="relative h-full backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <feature.icon className="text-6xl mb-6 text-transparent bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text" />
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl" />
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
                className="text-center"
              >
                <h4 className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  {stat.number}
                </h4>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with 3D Cards */}
      <section className="py-32 px-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              What Chefs Say
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
                <div className="relative backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 p-8 rounded-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <p className="text-gray-300 italic mb-6">{testimonial.text}</p>
                  <div>
                    <p className="font-semibold text-teal-400">{testimonial.author}</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-gray-800/50 border border-gray-700/50 p-12 rounded-2xl text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Join Our Newsletter
              </span>
            </h2>
            <p className="text-gray-300 mb-8">
              Get weekly recipes and cooking tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-3 bg-gray-900/50 border border-gray-700/50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full text-gray-900 font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto relative"
        >
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                ChefExpress
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing the way you cook with AI-powered recipes and a vibrant community.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <motion.a
                    key={social}
                    href={`#${social}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group transition-colors duration-300 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-400"
                  >
                    <span className="text-gray-400 group-hover:text-gray-900">
                      {/* Add your social media icons here */}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'Recipes', 'Premium', 'Blog'].map((link) => (
                  <motion.li key={link}>
                    <a 
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Community', 'Contact Us', 'Privacy Policy'].map((link) => (
                  <motion.li key={link}>
                    <a 
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Download App */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get the App</h4>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
                >
                  {/* Add App Store icon */}
                  <span className="text-white">App Store</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
                >
                  {/* Add Play Store icon */}
                  <span className="text-white">Play Store</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                ChefExpress
              </span>
              . All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#terms" className="hover:text-teal-400 transition-colors duration-300">
                Terms
              </a>
              <a href="#privacy" className="hover:text-teal-400 transition-colors duration-300">
                Privacy
              </a>
              <a href="#cookies" className="hover:text-teal-400 transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-teal-500/20 rounded-full"
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;