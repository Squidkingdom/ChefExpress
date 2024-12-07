// src/pages/Learn.tsx

import React, { useState } from "react";
import { FaSearch, FaPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// Define the Video interface
interface Video {
  length: string; // Video duration
  title: string; // Video title
  URL: string;   // Video URL
  id: string;    // Unique identifier for the video
  category: string; // Video category
}

const Learn: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null); // State for the currently selected video
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for the selected category filter
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for the search input value

  const closeModal = () => setSelectedVideo(null); // Close the video modal

  // Function to extract video ID from the URL (specific to YouTube links)
  const getVideoId = (url: string) => {
    const regex = /watch\?v=([^&]+)/; // Regex to find the video ID in the query string
    const match = url.match(regex);
    return match ? match[1] : ""; // Return the ID or an empty string if no match
  };

  // Fetch video data using TanStack's useQuery hook
  const fetchVideos = async () => {
    const response = await fetch("http://localhost:3000/api/videos", {
      method: "POST" // Use POST method to fetch videos from the API
    });

    if (!response.ok) {
      // Throw an error if the request fails
      throw new Error("Failed to fetch videos");
    }
    return response.json(); // Parse and return the JSON response
  };

  // React Query hook to manage video fetching and caching
  const { data: videos = [], isLoading, isError, error } = useQuery<Video[], Error>({
    queryKey: ["videos"], // Unique query key for caching and identification
    queryFn: fetchVideos, // Function to fetch video data
    initialData: [] // Initial value for videos to avoid undefined states
  });

  // Filter videos based on the selected category and search query
  const filteredVideos = (videos || []).filter((video) => {
    const matchesCategory = selectedCategory
      ? video.category === selectedCategory // Match the category if one is selected
      : true;
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()); // Match the title with the search query
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <header
        className="text-center py-24 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/learn-hero.jpg')", // Background image for the hero section
        }}
        id="learn-hero"
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div> {/* Dark overlay */}
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-extrabold text-teal-400">
            Discover Culinary Skills
          </h2>
          <p className="text-xl mt-4 text-gray-200">
            Learn from curated tutorials tailored for you.
          </p>
        </motion.div>
      </header>

      {/* Search and Categories */}
      <div
        className="flex flex-col lg:flex-row items-center justify-between gap-4 px-8 py-6 bg-gray-800"
        id="learn-filters"
      >
        {/* Category Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          {["Kitchen Safety", "Food Safety", "Food Science", "Ramsay"].map(
            (category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium transition duration-200 ${selectedCategory === category
                    ? "bg-teal-500 text-gray-900"
                    : "bg-gray-700 text-gray-200 hover:bg-teal-600"
                  }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
              >
                {category}
              </button>
            )
          )}
          <button
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-full hover:bg-red-600 transition duration-200"
            onClick={() => setSelectedCategory(null)}
          >
            Clear Filters
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full lg:w-1/3 mt-4 lg:mt-0">
          <div className="relative flex-grow">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            className="px-4 py-2 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-600 transition duration-200"
            onClick={() => setSearchQuery("")} // Clear the search query
          >
            Clear
          </button>
        </div>
      </div>

        {/* Video Grid */}
        <section
          className="
          w-full 
          grid 
          grid-cols-1
          gap-4
          p-4
          sm:grid-cols-1 sm:gap-10 sm:p-10
          md:grid-cols-2 md:gap-8 md:p-8
          lg:grid-cols-3 lg:gap-10 lg:p-10
          xl:grid-cols-4 xl:gap-12 xl:p-12
          2xl:grid-cols-5 2xl:gap-12 2xl:p-12
        "
          id="learn-videos"
        >
          {((filteredVideos.length > 0) && !isLoading) ? (
            filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                className=" bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedVideo(video)} // Set the selected video for the modal
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${getVideoId(
                      video.URL
                  )}/hqdefault.jpg`} // YouTube thumbnail
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover"
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
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No videos match your filters.
          </p>
        )}
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <>
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            id="learn-video-modal"
          >
            <div className="bg-gray-900 w-11/12 lg:w-3/4 xl:w-2/3 rounded-lg shadow-lg overflow-hidden relative">
              {/* Close Button */}
              <button
                className="absolute w-10 h-10 bottom-7 right-6 bg-red-500 text-white flex items-center justify-center p-2 rounded-full shadow-lg hover:bg-red-600 z-50"
                onClick={closeModal} // Close the modal on click
              >
                &times;
              </button>
              {/* Video Player */}
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.URL)}`} // Video URL for the iframe
                  title={selectedVideo.title} // Accessible title for the iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="text-2xl font-bold text-teal-400">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-300 mt-2">{selectedVideo.category}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Learn;
