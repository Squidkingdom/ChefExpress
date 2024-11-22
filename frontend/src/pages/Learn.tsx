// src/pages/Learn.tsx

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { 
  FaSearch, FaPlayCircle, FaTimes, FaPlus, FaMinus, FaTrash 
} from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from "@tanstack/react-query";

/**
 * Interface Definitions
 */
interface Video {
  length: string;
  title: string;
  URL: string;
  id: string;
  category: string;
}

/**
 * Learn Page Component
 * Enhanced with framer-motion animations and updated to align with Make.tsx design.
 * @returns {React.JSX.Element} - Enhanced Learn Page with modern design and features.
 */
const Learn: React.FC = () => {
  // State Variables
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Debounced Search Query
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Function to extract video ID from the URL
  const getVideoId = (url: string) => {
    const regex = /watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  // Fetch video data Using TanStack's useQuery hook
  const fetchVideos = async () => {
    const response = await fetch("http://localhost:3000/api/videos", {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }
    return response.json();
  }

  const { data: videos = [], isLoading, isError, error } = useQuery<Video[], Error>({
    queryKey: ["videos"],
    queryFn: fetchVideos
  })

  // Filtered videos based on category and search query
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory
      ? video.category === selectedCategory
      : true;
    const matchesSearch = video.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /**
   * Animation Variants
   */
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const smoothY = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  /**
   * Floating Elements for Background
   */
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-teal-500/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  /**
   * Video Card Component
   */
  const VideoCard: React.FC<{ video: Video }> = ({ video }) => (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden"
      onClick={() => setSelectedVideo(video)}
      whileHover={{ scale: 1.02 }}
      role="button"
      tabIndex={0}
      onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') setSelectedVideo(video);
      }}
      aria-label={`Play video: ${video.title}`}
    >
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <img
          src={`https://img.youtube.com/vi/${getVideoId(video.URL)}/hqdefault.jpg`}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <FaPlayCircle className="absolute inset-0 m-auto text-6xl text-white opacity-75" />
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
          {video.length}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-teal-400">
          {video.title}
        </h3>
        <p className="text-sm text-gray-300 mt-1">{video.category}</p>
      </div>
    </motion.div>
  );

  /**
   * Video Modal Component
   */
  const VideoModal: React.FC<{ video: Video }> = ({ video }) => (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-4xl w-full relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 z-50"
              aria-label="Close video modal"
            >
              &times;
            </button>
            {/* Video Player */}
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-lg"
                src={video.URL.replace("watch?v=", "embed/")}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-2xl font-bold text-teal-400">
                {video.title}
              </h3>
              <p className="text-gray-300 mt-2">{video.category}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /**
   * Filters Component
   */
  const Filters: React.FC = () => (
    <motion.div
      className="flex flex-col lg:flex-row items-center justify-between gap-4 px-8 py-6 bg-gray-800 rounded-xl"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Category Buttons */}
      <motion.div
        className="flex gap-4 flex-wrap justify-center"
        variants={fadeIn}
      >
        {["Culinary Arts", "Kitchen Safety", "Food Science"].map(
          (category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
                selectedCategory === category
                  ? "bg-teal-500 text-gray-900"
                  : "bg-gray-700 text-gray-200 hover:bg-teal-600"
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
              aria-label={`Filter by ${category}`}
            >
              {category}
            </button>
          )
        )}
        <button
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-full hover:bg-red-600 transition duration-200"
          onClick={() => setSelectedCategory(null)}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </motion.div>

      {/* Search Input */}
      <motion.div
        className="flex items-center gap-2 w-full lg:w-1/3"
        variants={fadeIn}
      >
        <div className="relative flex-grow">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Search for a video"
          />
        </div>
        <button
          className="px-4 py-2 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-600 transition duration-200"
          onClick={() => setSearchQuery("")}
          aria-label="Clear search"
        >
          Clear
        </button>
      </motion.div>
    </motion.div>
  );

  /**
   * Floating Elements for Background
   */
  const EnhancedFloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-teal-500/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden relative">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
        </div>
      </div>

      {/* Floating Elements */}
      <EnhancedFloatingElements />

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastClassName="bg-gray-800 text-gray-100"
      />

      {/* Hero Section */}
      <motion.header
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-[40vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-sm" />
        
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Discover Culinary Skills
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Learn from curated tutorials tailored for you.
          </p>
        </motion.div>
      </motion.header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Filters */}
        <Filters />

        {/* Video Grid */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <p className="col-span-full text-center text-gray-400">Loading videos...</p>
          ) : isError ? (
            <p className="col-span-full text-center text-red-500">Error: {error?.message}</p>
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))
          ) : (
            <motion.p
              className="col-span-full text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No videos match your filters.
            </motion.p>
          )}
        </motion.section>
      </div>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} />

      {/* Hero and Filters IDs for Potential Guided Tours */}
      {/* Ensure consistency in IDs and structure with other pages like Make.tsx */}
    </div>
  );
};

export default Learn;
