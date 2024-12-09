import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
};

const HeaderFloatingElements: React.FC = React.memo(() => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isVisible = useScrollVisibility();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: 100,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  const getGridPosition = (index: number) => {
    const padding = 20;
    const safeWidth = dimensions.width - padding * 2;
    const safeHeight = dimensions.height - padding * 2;

    const columns = 5;
    const rows = 3;
    const cellWidth = safeWidth / columns;
    const cellHeight = safeHeight / rows;

    const column = index % columns;
    const row = Math.floor(index / columns) % rows;

    const randomX = (Math.random() - 0.5) * cellWidth * 0.6;
    const randomY = (Math.random() - 0.5) * cellHeight * 0.6;

    return {
      x: padding + column * cellWidth + cellWidth / 2 + randomX,
      y: padding + row * cellHeight + cellHeight / 2 + randomY,
    };
  };

  if (dimensions.width === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Array.from({ length: 15 }).map((_, i) => {
            const position = getGridPosition(i);
            const size = i % 3 === 0 ? "w-4 h-4" : "w-3 h-3";
            const duration = 4 + Math.random() * 3;
            const maxMove = 15;

            return (
              <motion.div
                key={i}
                className={`absolute ${size} ${
                  i % 3 === 0
                    ? "border border-teal-500/20 bg-teal-500/5"
                    : "bg-teal-500/10"
                } rounded-full backdrop-blur-sm`}
                initial={{
                  x: position.x,
                  y: position.y,
                  scale: 0.6 + Math.random() * 0.3,
                }}
                animate={{
                  y: [
                    position.y,
                    position.y - (5 + Math.random() * maxMove),
                    position.y,
                  ],
                  x: [
                    position.x,
                    position.x + (Math.random() - 0.5) * maxMove * 1.5,
                    position.x,
                  ],
                  rotate: [0, 90 + Math.random() * 90],
                  scale: [1, 1.05 + Math.random() * 0.1, 1],
                }}
                transition={{
                  duration: duration * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * duration,
                }}
                style={{
                  boxShadow:
                    i % 3 === 0 ? "0 0 5px rgba(20, 184, 166, 0.1)" : "none",
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const HeaderShapeBackground: React.FC = React.memo(() => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isVisible = useScrollVisibility();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: 100,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  const getGridPosition = (index: number) => {
    const padding = 30;
    const safeWidth = dimensions.width - padding * 2;
    const safeHeight = dimensions.height - padding * 2;

    const columns = 4;
    const rows = 2;
    const cellWidth = safeWidth / columns;
    const cellHeight = safeHeight / rows;

    const column = index % columns;
    const row = Math.floor(index / columns) % rows;

    const randomX = (Math.random() - 0.5) * cellWidth * 0.4;
    const randomY = (Math.random() - 0.5) * cellHeight * 0.4;

    return {
      x: padding + column * cellWidth + cellWidth / 2 + randomX,
      y: padding + row * cellHeight + cellHeight / 2 + randomY,
    };
  };

  if (dimensions.width === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const position = getGridPosition(i);
            const duration = 10 + Math.random() * 5;
            const maxMove = 20;

            return (
              <motion.div
                key={i}
                className={`absolute ${
                  i % 3 === 0
                    ? "w-12 h-12 border border-teal-500/20 bg-teal-500/5"
                    : i % 3 === 1
                    ? "w-10 h-10 bg-cyan-500/10"
                    : "w-8 h-8 bg-teal-500/10"
                } rounded-xl backdrop-blur-sm transform`}
                initial={{
                  x: position.x,
                  y: position.y,
                  rotate: Math.random() * 360,
                  scale: 0.8 + Math.random() * 0.4,
                }}
                animate={{
                  y: [
                    position.y,
                    position.y - (15 + Math.random() * maxMove),
                    position.y,
                  ],
                  x: [
                    position.x,
                    position.x + (Math.random() - 0.5) * maxMove * 2,
                    position.x,
                  ],
                  rotate: [0, 360],
                  scale: [1, 1.2 + Math.random() * 0.2, 1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * duration,
                }}
                style={{
                  boxShadow: "0 0 15px rgba(20, 184, 166, 0.1)",
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

HeaderFloatingElements.displayName = "HeaderFloatingElements";
HeaderShapeBackground.displayName = "HeaderShapeBackground";

export { HeaderFloatingElements, HeaderShapeBackground };
