import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const BackgroundEffects: React.FC = () => {
  // Add client-side only window check to prevent SSR issues
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
      </div>
      <div className="fixed inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 3 === 0
                ? "w-16 h-16 border-2 border-teal-500/10"
                : i % 3 === 1
                ? "w-12 h-12 bg-cyan-500/5"
                : "w-8 h-8 bg-teal-500/5"
            } rounded-lg transform -rotate-45`}
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};