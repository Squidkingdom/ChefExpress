// src/components/Footer.tsx

import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa"; // Importing the icons

const Footer: React.FC = () => {
  // Mapping social media names to their corresponding icons
  const socialIcons: { [key: string]: JSX.Element } = {
    facebook: <FaFacebookF />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    youtube: <FaYoutube />,
  };

  return (
    <footer className="py-12 px-6 relative bg-gray-900 text-gray-100">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none" />
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
                  <span className="text-gray-300 group-hover:text-white"> {/* Adjusted color */}
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
                    href={`#${link.toLowerCase().replace(/\s+/g, "")}`} // Removing spaces for href
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
                    href={`#${link.toLowerCase().replace(/\s+/g, "")}`} // Removing spaces for href
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
              <motion.a
                href="#app-store" // Update with actual App Store link
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
              >
                {/* Add App Store icon if available */}
                <span className="text-white">App Store</span>
              </motion.a>
              <motion.a
                href="#play-store" // Update with actual Play Store link
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gray-800 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors duration-300"
              >
                {/* Add Play Store icon if available */}
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

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-teal-500/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
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
  );
};

export default Footer;
