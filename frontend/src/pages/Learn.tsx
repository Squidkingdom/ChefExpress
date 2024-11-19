import React, { useState } from "react";

/**
 * Learn Page
 * The Learning page for the ChefExpress application
 * @returns {React.JSX.Element} - Learn Page
 */

// Define the Video interface
interface Video {
  length: string;
  title: string;
  URL: string;
  id: string;
  category: string;
}

const Learn: React.FC = () => {
  const videos: Video[] = [
    {
      length: "2:39",
      title: "Focusing on Safety",
      URL: "https://www.youtube.com/embed/VHGtPeH4tCg",
      id: "1.1",
      category: "Kitchen Safety",
    },
    {
      length: "2:46",
      title: "Preventing burns and scalds",
      URL: "https://www.youtube.com/embed/05TlLLUWUG8",
      id: "1.4",
      category: "Kitchen Safety",
    },
    {
      length: "2:03",
      title: "Food combinations",
      URL: "https://www.youtube.com/embed/NMt3H2CbTg4",
      id: "2.9",
      category: "Food Science",
    },
    {
      length: "30:13",
      title: "Cuisinart Culinary School - Episode 6",
      URL: "https://www.youtube.com/embed/ZDqrMDw6QRY",
      id: "3.6",
      category: "Culinary Arts",
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Tracks the selected category
  const [searchQuery, setSearchQuery] = useState<string>(""); // Tracks the search input

  const closeModal = () => setSelectedVideo(null);

  // Filter the videos based on category and search query
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
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <h2 className="text-4xl font-extrabold">Discover Culinary Skills</h2>
        <p className="text-lg mt-2">Learn from curated tutorials tailored for you.</p>
      </section>

      {/* Search and Categories */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-8 py-6 bg-gray-800">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 ${
              selectedCategory === "Culinary Arts"
                ? "bg-yellow-500 text-gray-900"
                : "bg-blue-600 text-white"
            } rounded-full hover:bg-blue-700`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "Culinary Arts" ? null : "Culinary Arts"
              )
            }
          >
            Culinary Arts
          </button>
          <button
            className={`px-4 py-2 ${
              selectedCategory === "Kitchen Safety"
                ? "bg-yellow-500 text-gray-900"
                : "bg-blue-600 text-white"
            } rounded-full hover:bg-blue-700`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "Kitchen Safety" ? null : "Kitchen Safety"
              )
            }
          >
            Kitchen Safety
          </button>
          <button
            className={`px-4 py-2 ${
              selectedCategory === "Food Science"
                ? "bg-yellow-500 text-gray-900"
                : "bg-blue-600 text-white"
            } rounded-full hover:bg-blue-700`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === "Food Science" ? null : "Food Science"
              )
            }
          >
            Food Science
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
            onClick={() => setSelectedCategory(null)}
          >
            Clear Filters
          </button>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-1/3">
          <input
            type="text"
            placeholder="Search for a learning video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-8">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 cursor-pointer hover:bg-gray-700"
            onClick={() => setSelectedVideo(video)}
          >
            <h3 className="text-xl font-bold mb-2 text-yellow-400">{video.title}</h3>
            <p className="text-sm text-gray-300 mb-2">{video.category}</p>
            <p className="text-sm text-gray-300">Length: {video.length}</p>
          </div>
        ))}
        {filteredVideos.length === 0 && (
          <p className="text-center col-span-full text-gray-400">
            No videos match your filters.
          </p>
        )}
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <>
          {/* Close Button */}
          <button
            className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 z-50"
            onClick={closeModal}
          >
            ×
          </button>

          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
            <div className="bg-gray-800 w-4/5 lg:w-2/3 rounded-lg shadow-lg overflow-hidden relative">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Learn;
