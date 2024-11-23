// src/pages/Learn.tsx

import React, {
  useState,
  useEffect,
  KeyboardEvent,
  useMemo,
} from "react";
import {
  FaSearch,
  FaPlayCircle,
  FaArrowRight,
  FaUtensils,
  FaShieldAlt,
  FaFlask,
  FaBookOpen,
  FaLightbulb,
  FaFireAlt,
} from "react-icons/fa";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
 * View Types
 */
type ViewType = "hero" | "select" | "view";

/**
 * Learn Page Component
 */
const Learn: React.FC = () => {
  // State Variables
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentView, setCurrentView] = useState<ViewType>("hero");

  // Debounced Search Query
  const [debouncedSearch, setDebouncedSearch] = useState<string>(
    searchQuery
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

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

  // Fetch video data using useQuery
  const fetchVideos = async () => {
    const response = await fetch("http://localhost:3000/api/videos", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }
    return response.json();
  };

  const {
    data: videos = [],
    isLoading,
    isError,
    error,
  } = useQuery<Video[], Error>({
    queryKey: ["videos"],
    queryFn: fetchVideos,
    enabled: currentView === "view",
  });

  // Filtered videos based on selected category and search query
  const filteredVideos = useMemo(
    () =>
      videos.filter((video) => {
        const matchesCategory = selectedCategory
          ? video.category.trim().toLowerCase() ===
            selectedCategory!.trim().toLowerCase()
          : true;
        const matchesSearch = video.title
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [videos, selectedCategory, debouncedSearch]
  );

  /**
   * Animation Variants
   */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /**
   * Categories
   */
  const categories = [
    {
      title: "Culinary Arts",
      value: "culinary arts", // Ensure this matches video.category values
      description: "Master the art of cooking and culinary techniques.",
      icon: FaUtensils,
      secondaryIcon: FaFireAlt,
      gradient: "from-red-500 to-orange-400",
      features: [
        "Professional cooking techniques",
        "Recipe development",
        "Plating and presentation",
        "Global cuisines",
      ],
      color: "text-red-400",
    },
    {
      title: "Kitchen Safety",
      value: "kitchen safety", // Ensure this matches video.category values
      description: "Learn essential safety practices in the kitchen.",
      icon: FaShieldAlt,
      secondaryIcon: FaBookOpen,
      gradient: "from-green-500 to-emerald-400",
      features: [
        "Food handling and hygiene",
        "Equipment safety",
        "Emergency procedures",
        "Safe storage practices",
      ],
      color: "text-green-400",
    },
    {
      title: "Food Science",
      value: "food science", // Ensure this matches video.category values
      description: "Explore the science behind cooking and food.",
      icon: FaFlask,
      secondaryIcon: FaLightbulb,
      gradient: "from-blue-500 to-indigo-400",
      features: [
        "Chemical reactions",
        "Nutrition and health",
        "Flavor development",
        "Food technology",
      ],
      color: "text-blue-400",
    },
  ];

  /**
   * Floating Elements for Background
   */
  const FloatingElements = () => (
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
  );

  /**
   * Video Card Component
   */
  const VideoCard: React.FC<{ video: Video }> = ({ video }) => (
    <motion.div
      className="bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden relative"
      onClick={() => setSelectedVideo(video)}
      whileHover={{ scale: 1.02 }}
      role="button"
      tabIndex={0}
      onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") setSelectedVideo(video);
      }}
      aria-label={`Play video: ${video.title}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform scale-110" />
      <div className="relative z-10">
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <img
            src={`https://img.youtube.com/vi/${getVideoId(
              video.URL
            )}/hqdefault.jpg`}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
            loading="lazy"
          />
          <FaPlayCircle className="absolute inset-0 m-auto text-6xl text-white opacity-75" />
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
            {video.length}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-teal-400">{video.title}</h3>
        </div>
      </div>
    </motion.div>
  );

  /**
   * Video Modal Component
   */
  const VideoModal: React.FC<{ video: Video | null }> = ({ video }) => (
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
   * SelectionCards Component
   */
  const handleSelectView = (view: ViewType, categoryValue?: string) => {
    setCurrentView(view);
    if (categoryValue) {
      setSelectedCategory(categoryValue);
    } else {
      setSelectedCategory(null);
    }
    setSearchQuery("");
  };

  const SelectionCards: React.FC<{
    onSelect: (view: ViewType, categoryValue?: string) => void;
  }> = ({ onSelect }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mb-16"
    >
      {categories.map((category, index) => (
        <motion.button
          key={index}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("view", category.value)}
          className="group relative overflow-hidden rounded-2xl focus:outline-none"
          aria-label={category.title}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
          />
          {/* Card Content */}
          <div className="relative z-10 backdrop-blur-sm bg-gray-800/60 border border-gray-700/50 p-6 h-full rounded-2xl flex flex-col">
            {/* Icon and Title */}
            <div className="flex items-center mb-4">
              <div className="relative mr-4">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} blur-xl opacity-50 rounded-full`}
                />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-800">
                  <category.icon className={`text-2xl ${category.color}`} />
                </div>
              </div>
              <h3 className={`text-xl font-bold ${category.color}`}>
                {category.title}
              </h3>
            </div>
            {/* Description */}
            <p className="text-gray-300 mb-4 flex-grow">
              {category.description}
            </p>
            {/* Features */}
            <div className="space-y-2 mb-6">
              {category.features?.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <FaLightbulb className="text-sm text-gray-300" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
            {/* Action Button */}
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-2 text-gray-300 ml-auto"
                whileHover={{ x: 5 }}
              >
                <span className="font-medium text-sm">Get Started</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaArrowRight size={12} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );

  /**
   * SearchBar Component
   */
  const SearchBar: React.FC = () => (
    <motion.div
      className="flex items-center gap-2 w-full lg:w-1/3 mx-auto"
      variants={itemVariants}
    >
      <div className="relative flex-grow">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a video..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-700/50 bg-gray-800/50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
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
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden flex flex-col">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
        </div>
      </div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-gray-800 text-gray-100"
      />

      {/* Main Content */}
      <div className="relative z-10 flex-grow">
        {/* Hero Section */}
        {currentView === "hero" && (
          <motion.header
            style={{ y: smoothY, opacity, scale }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
          >
            <motion.div
              className="relative z-10 max-w-6xl mx-auto px-6 text-center mt-24"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl transform -translate-y-1/2" />

              <h2 className="text-6xl md:text-8xl font-extrabold mb-8 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                  Discover
                </span>{" "}
                <span className="text-white">Culinary Skills</span>
              </h2>
              <p className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed">
                Learn from curated tutorials tailored for you.
              </p>

              <motion.button
                onClick={() => setCurrentView("select")}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Learning
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
          </motion.header>
        )}

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Add top margin when not on hero section */}
          {currentView !== "hero" && <div className="mt-24" />}

          {/* Page Content */}
          <AnimatePresence mode="wait">
            {currentView === "select" && (
              <SelectionCards onSelect={handleSelectView} />
            )}

            {currentView === "view" && (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Category Header */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold capitalize">{selectedCategory}</h2>
                </div>
                {/* Search Bar */}
                <SearchBar />

                {/* Video Grid */}
                <motion.section
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {isLoading ? (
                    <p className="col-span-full text-center text-gray-400">
                      Loading videos...
                    </p>
                  ) : isError ? (
                    <p className="col-span-full text-center text-red-500">
                      Error: {error?.message}
                    </p>
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
                      No videos match your search.
                    </motion.p>
                  )}
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Modal */}
        <VideoModal video={selectedVideo} />
      </div>

    </div>
  );
};

export default Learn;
