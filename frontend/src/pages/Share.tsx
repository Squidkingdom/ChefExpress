// src/pages/Share.tsx

import React, { useState, ChangeEvent } from "react";
import { FaPlus, FaHeart, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface SharedItem {
  id: number;
  image: string;
  description: string;
  likes: number;
}

interface Comment {
  id: number;
  sharedItemId: number;
  text: string;
}

/**
 * Share Page
 * Allows users to share their culinary creations and interact with others.
 * Updated to work with the guided tour.
 * @returns {React.JSX.Element} - The Share page component.
 */
const Share: React.FC = () => {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // Handle file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle adding shared item
  const handleShare = () => {
    if (selectedImage && description) {
      const newItem: SharedItem = {
        id: sharedItems.length + 1,
        image: URL.createObjectURL(selectedImage),
        description: description,
        likes: 0,
      };
      setSharedItems([newItem, ...sharedItems]);
      setSelectedImage(null);
      setDescription("");
      toast.success("Your creation has been shared!");
    } else {
      toast.error("Please select an image and add a description.");
    }
  };

  // Handle like functionality
  const handleLike = (id: number) => {
    setSharedItems(
      sharedItems.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (commentText.trim() && selectedItem) {
      const newComment: Comment = {
        id: comments.length + 1,
        sharedItemId: selectedItem.id,
        text: commentText.trim(),
      };
      setComments([...comments, newComment]);
      setCommentText("");
    }
  };

  return (
    <div className="share-page min-h-screen bg-gray-900 text-gray-100 py-10">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <header
        className="text-center py-24 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/share-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold text-teal-400 mb-4">
            Share Your Culinary Creations!
          </h1>
          <p className="text-xl text-gray-200">
            Upload photos of your recipes and inspire the community.
          </p>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Upload Section */}
        <section
          className="w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md mb-16"
          id="share-upload"
        >
          <h2 className="text-3xl font-semibold text-center mb-6 text-teal-400">
            Upload Your Creation
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-12 h-12 bg-teal-500 text-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-400 transition duration-200">
                <FaPlus className="text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="ml-4 text-gray-300">
                {selectedImage ? selectedImage.name : "Select an image"}
              </p>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <button
              onClick={handleShare}
              className="w-full bg-teal-500 text-gray-900 py-3 rounded-full font-semibold hover:bg-teal-400 transition duration-200 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Share
            </button>
          </div>
        </section>

        {/* Gallery of Shared Items */}
        <section className="w-full">
          <h2 className="text-4xl font-semibold text-center mb-12 text-teal-400">
            Community Creations
          </h2>
          {sharedItems.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">
              No shared creations yet. Be the first to share!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sharedItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={item.image}
                    alt="Shared Creation"
                    className="w-full h-64 object-cover rounded-md mb-4 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  />
                  <p className="text-gray-300 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center text-teal-500 hover:text-teal-400 transition duration-200"
                    >
                      <FaHeart className="mr-2" /> {item.likes} Likes
                    </button>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-gray-400 hover:text-gray-200 transition duration-200"
                    >
                      View Comments
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Comments Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col md:flex-row">
              <img
                src={selectedItem.image}
                alt="Shared Creation"
                className="w-full md:w-1/2 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
              />
              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">
                  {selectedItem.description}
                </h3>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => handleLike(selectedItem.id)}
                    className="flex items-center text-teal-500 hover:text-teal-400 transition duration-200"
                  >
                    <FaHeart className="mr-2" /> {selectedItem.likes} Likes
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto mb-4">
                  <h4 className="text-xl font-semibold text-gray-200 mb-2">
                    Comments
                  </h4>
                  {comments
                    .filter((comment) => comment.sharedItemId === selectedItem.id)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-700 p-3 rounded-md mb-2"
                      >
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    ))}
                  {comments.filter(
                    (comment) => comment.sharedItemId === selectedItem.id
                  ).length === 0 && (
                    <p className="text-gray-400">No comments yet.</p>
                  )}
                </div>
                <div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2"
                    rows={2}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="w-full bg-teal-500 text-gray-900 py-2 rounded-full font-semibold hover:bg-teal-400 transition duration-200"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
