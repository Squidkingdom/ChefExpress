import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 py-6 w-full">
      <div className="relative inline-block w-full text-center">
        {/* Floating elements */}
        <div className="absolute inset-x-0 top-[-1rem] pointer-events-none flex justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-teal-500/20 rounded-full mx-2"
              initial={{
                y: 0,
                opacity: 0.5,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Brand name */}
        <motion.h3 
          className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ChefExpress
        </motion.h3>
      </div>
    </footer>
  );
};

export default Footer;