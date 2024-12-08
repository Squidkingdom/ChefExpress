// src/components/Footer.tsx

import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const socialIcons: { [key: string]: JSX.Element } = {
    facebook: <FaFacebookF />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    youtube: <FaYoutube />,
  };

  return (
    <footer className="relative bg-gray-900 text-gray-100 w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none" />

      <div className="py-12 px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-4 relative">
              {/* Relative container for the brand heading */}
              <div className="relative inline-block">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  ChefExpress
                </h3>

                {/* Floating elements above the text */}
                <div className="absolute inset-x-0 top-[-2rem] pointer-events-none flex justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-teal-500/20 rounded-full mx-2"
                      initial={{
                        y: 0,
                        opacity: 0.5,
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
              </div>

              <p className="text-gray-400 leading-relaxed">
                Revolutionizing the way you cook with AI-powered recipes and a vibrant community.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <motion.a
                    key={social}
                    href={`#${social}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group transition-colors duration-300 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-400"
                    aria-label={social}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-gray-300 group-hover:text-white">
                      {socialIcons[social]}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
                {["About Us", "Recipes", "Premium", "Blog"].map((link) => (
                  <motion.li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
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
                {["Help Center", "Community", "Contact Us", "Privacy Policy"].map((link) => (
                  <motion.li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Get the App */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get the App</h4>
              <div className="space-y-3">
                <motion.a
                  href="#app-store"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
                >
                  <span className="text-white">App Store</span>
                </motion.a>
                <motion.a
                  href="#play-store"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
                >
                  <span className="text-white">Play Store</span>
                </motion.a>
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
              <a
                href="#terms"
                className="hover:text-teal-400 transition-colors duration-300"
              >
                Terms
              </a>
              <a
                href="#privacy"
                className="hover:text-teal-400 transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#cookies"
                className="hover:text-teal-400 transition-colors duration-300"
              >
                Cookies
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
