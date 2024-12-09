// src/pages/Learn.tsx

import React, { 
  useState, 
  useEffect, 
  useMemo,
} from 'react';
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
  FaRegLightbulb,
  FaClock,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import { HeroSection } from '../components/LearnHeroSection';

// Types & Interfaces
interface Video {
  id: string;
  title: string;
  URL: string;
  length: string;
  category: string;
}

type ViewType = 'hero' | 'select' | 'view';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
}

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface SelectionCardsProps {
  onSelect: (view: ViewType, category?: string) => void;
}

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

// Categories Data
const categories = [
  {
    title: 'Kitchen Safety',
    value: 'kitchen safety',
    icon: FaShieldAlt,
    secondaryIcon: FaUtensils,
    description: 'Master essential kitchen safety practices and protocols',
    gradient: 'from-red-500 to-orange-400',
    features: [
      'Equipment handling',
      'Fire safety protocols',
      'First aid basics',
      'Accident prevention'
    ],
    color: 'text-red-400',
  },
  {
    title: 'Food Safety',
    value: 'food safety',
    icon: FaBookOpen,
    secondaryIcon: FaShieldAlt,
    description: 'Learn proper food handling and storage techniques',
    gradient: 'from-green-500 to-emerald-400',
    features: [
      'Food storage guidelines',
      'Cross-contamination prevention',
      'Temperature control',
      'Hygiene practices'
    ],
    color: 'text-green-400',
  },
  {
    title: 'Food Science',
    value: 'food science',
    icon: FaFlask,
    secondaryIcon: FaLightbulb,
    description: 'Explore the chemistry and physics behind cooking',
    gradient: 'from-blue-500 to-indigo-400',
    features: [
      'Chemical reactions',
      'Heat transfer',
      'Ingredient properties',
      'Molecular gastronomy'
    ],
    color: 'text-blue-400',
  },
  {
    title: 'Gordon Ramsay',
    value: 'gordon ramsay',
    icon: FaFireAlt,
    secondaryIcon: FaUtensils,
    description: 'Learn from the legendary Michelin-starred chef',
    gradient: 'from-yellow-500 to-amber-400',
    features: [
      'Signature techniques',
      'Restaurant secrets',
      'Advanced recipes',
      'Professional tips'
    ],
    color: 'text-yellow-400',
  }
];

const getVideoId = (url: string): string => {
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

// VideoCard Component (Updated)
const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const containerVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 }
  };

  const iconVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 }
  };

  const thumbnailUrl = imgError 
    ? "/api/placeholder/400/320"
    : `https://img.youtube.com/vi/${getVideoId(video.URL)}/hqdefault.jpg`;

  return (
    <motion.div
      className="group relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 cursor-pointer"
      variants={containerVariants}
      initial="rest"
      whileHover="hover"
      animate={isHovered ? "hover" : "rest"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(video)}
      role="button"
      tabIndex={0}
      onKeyPress={(e: React.KeyboardEvent) => e.key === "Enter" && onSelect(video)}
    >
      <div className="absolute inset-0 p-[1px] rounded-2xl bg-gradient-to-br from-teal-500/30 via-cyan-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative aspect-video">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover rounded-t-2xl"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent"
        >
          <motion.div
            variants={iconVariants}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FaPlayCircle className="text-6xl text-teal-400/90" />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <FaClock className="text-xs text-teal-400" />
          <span className="text-sm text-gray-200">{video.length}</span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-lg font-medium text-gray-200 mb-2 break-words line-clamp-2">
          {video.title}
        </h4>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-sm bg-gray-800/70 text-teal-300 rounded-full">
            {video.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};


// SearchBar Component
const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(inputValue.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 w-full lg:w-1/3 mx-auto"
    >
      <div className="relative flex-grow">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a video..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-4 py-2 border border-gray-700/50 bg-gray-800/50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
        />
      </div>
      <motion.button
        onClick={handleSearch}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-400 transition duration-200"
      >
        <FaSearch className="text-sm" />
        Search
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-200"
        onClick={handleClear}
      >
        Clear
      </motion.button>
    </motion.div>
  );
};

// SelectionCards Component
const SelectionCards: React.FC<SelectionCardsProps> = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y:0 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 mb-16"
    >
      {categories.map((category, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("view", category.value)}
          className="group relative overflow-hidden rounded-2xl focus:outline-none text-left"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 backdrop-blur-sm bg-gray-800/60 border border-gray-700/50 p-6 h-full rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} blur-xl opacity-50 rounded-full`} />
                  <div className="relative p-3 bg-gray-800/80 rounded-full">
                    <category.icon className={`text-2xl ${category.color}`} />
                  </div>
                </div>
                {category.secondaryIcon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-2 bg-gray-800/80 rounded-full"
                  >
                    <category.secondaryIcon className={`text-xl ${category.color}`} />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className={`text-xl font-bold ${category.color} mb-2`}>
                {category.title}
              </h3>
              <p className="text-gray-300">
                {category.description}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {category.features?.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <FaRegLightbulb className={`text-sm ${category.color}`} />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex items-center gap-2 text-gray-300"
              whileHover={{ x: 5 }}
            >
              <span className="font-medium text-sm">Get Started</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FaArrowRight className="relative top-[1px]" />
              </motion.span>
            </motion.div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};

// VideoModal Component
const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => (
  <AnimatePresence>
    {video && (
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900/90 backdrop-blur-xl max-w-6xl w-full relative rounded-2xl overflow-hidden border border-gray-700/50"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="p-6 bg-gray-900/95 border-b border-gray-700/50">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  {video.title}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-3 py-1 text-sm bg-gray-800 text-teal-300 rounded-full">
                    {video.category}
                  </span>
                  <span className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full flex items-center gap-1">
                    <FaClock className="text-xs" />
                    {video.length}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${getVideoId(video.URL)}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Background Close Button Area */}
        <button
          className="absolute inset-0 w-full h-full -z-10"
          onClick={onClose}
          aria-label="Close modal"
        />
      </motion.div>
    )}
  </AnimatePresence>
);

// Learn Page Component
const Learn = () => {
  const [currentView, setCurrentView] = useState<ViewType>('hero');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch videos when the view is 'view' and category is selected
  const { data: videos = [], isLoading, isError, error } = useQuery<Video[], Error>({
    queryKey: ['videos', selectedCategory],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: selectedCategory })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      return response.json();
    },
    enabled: currentView === 'view' && !!selectedCategory
  });

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesCategory = selectedCategory
        ? video.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesSearch = video.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  const handleSelect = (view: ViewType, category?: string) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    setSearchQuery('');
  };

  const VideoContent: React.FC = () => (
    <motion.div
      key="view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={() => setCurrentView('select')}
          className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors duration-200"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowRight className="rotate-180 relative top-[1px]" />
          <span>Back to Categories</span>
        </motion.button>
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
          {selectedCategory && 
            selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </h2>
        <div className="w-24" />
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          <div className="col-span-full flex justify-center">
            <motion.div
              className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : isError ? (
          <motion.div
            className="col-span-full text-center text-red-500 bg-red-500/10 p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Error: {error?.message}</p>
          </motion.div>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={setSelectedVideo}
            />
          ))
        ) : (
          <motion.div
            className="col-span-full text-center text-gray-400 bg-gray-800/50 p-8 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaSearch className="text-4xl mb-4 mx-auto text-gray-500" />
            <p className="text-lg">No videos match your search.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery('')}
              className="mt-4 text-teal-400 hover:text-teal-300 transition-colors duration-200"
            >
              Clear search
            </motion.button>
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative">

      
      {/* Adjust gradient overlay opacity */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),transparent_60%)]" />
        </div>
      </div>

      {/* Content container with transparent background */}
      <div className="relative z-10">
        {currentView === 'hero' && (
          <HeroSection onStartLearning={() => setCurrentView('select')} />
        )}

        <div className="max-w-7xl mx-auto py-12">
          {currentView !== 'hero' && <div className="mt-24" />}
          
          <AnimatePresence mode="wait">
            {currentView === 'select' && (
              <SelectionCards onSelect={handleSelect} />
            )}
            {currentView === 'view' && <VideoContent />}
          </AnimatePresence>
        </div>

        <VideoModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      </div>
    </div>
  );
};

export default Learn;
