// src/pages/Learn.tsx

import React, { useState } from "react";
import { FaSearch, FaPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// Define the Video interface
interface Video {
  length: string;
  title: string;
  URL: string;
  id: string;
  category: string;
}

const Learn: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const closeModal = () => setSelectedVideo(null);

  // Function to extract video ID from the URL
  const getVideoId = (url: string) => {
    const regex = /embed\/([^\?&"]+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  // Fetch video data Using TanStack's useQuery hook
  const fetchVideos = async () => {
    const response = await fetch("localhost:3000/api/videos", {
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

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory
      ? video.category === selectedCategory
      : true;
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <header
        className="text-center py-24 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/learn-hero.jpg')",
        }}
        id="learn-hero"
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            className="px-4 py-2 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-600 transition duration-200"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-8"
        id="learn-videos"
      >
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden"
              onClick={() => setSelectedVideo(video)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative" style={{ paddingTop: "56.25%" }}>
                <img
                  src={`https://img.youtube.com/vi/${getVideoId(
                    video.URL
                  )}/hqdefault.jpg`}
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
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 z-50"
                onClick={closeModal}
              >
                &times;
              </button>
              {/* Video Player */}
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={selectedVideo.URL}
                  title={selectedVideo.title}
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
