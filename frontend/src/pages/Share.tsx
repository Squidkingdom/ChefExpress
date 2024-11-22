// src/pages/Share.tsx

import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { FaPlus, FaHeart, FaTimes, FaComment } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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
 * Enhanced to follow the Make.tsx and Learn.tsx UI/UX design.
 * @returns {React.JSX.Element} - The Share page component.
 */
const Share: React.FC = () => {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

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
      toast.success("Comment added!");
    }
  };

  // Floating elements for background
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
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
      {/* Animated background gradient */}
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
      <ToastContainer position="top-right" autoClose={3000} theme="dark" toastClassName="bg-gray-800 text-gray-100" />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: smoothY, opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl transform -translate-y-1/2" />
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                Share Your{" "}
              </span>
              <div className="inline-block">
                <span className="text-white">Culinary</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                  Creations
                </span>
              </div>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Upload photos of your recipes and inspire the community.
            </p>
          </motion.div>
        </motion.div>
      </header>

      {/* Upload Section */}
      <motion.section
        className="w-full max-w-4xl mx-auto bg-gray-800 p-8 rounded-3xl shadow-lg mb-16 relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl transform scale-110" />

        <div className="relative z-10">
          <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Upload Your Creation
          </h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <label className="w-12 h-12 bg-teal-500 text-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-400 transition duration-200 relative overflow-hidden">
                <FaPlus className="text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  whileHover={{ opacity: 0.2 }}
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
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              rows={3}
            />
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 py-3 rounded-full font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Share
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Gallery of Shared Items */}
      <motion.section
        className="w-full max-w-6xl mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-semibold text-center mb-12 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
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
                className="bg-gray-800 p-4 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 relative"
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl transform scale-105" />
                
                <div className="relative z-10">
                  <img
                    src={item.image}
                    alt="Shared Creation"
                    className="w-full h-64 object-cover rounded-md mb-4 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                    loading="lazy"
                  />
                  <p className="text-gray-300 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <motion.button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center text-teal-500 hover:text-teal-400 transition duration-200"
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Like ${item.description}`}
                    >
                      <FaHeart className="mr-2" /> {item.likes} Likes
                    </motion.button>
                    <motion.button
                      onClick={() => setSelectedItem(item)}
                      className="flex items-center text-gray-400 hover:text-gray-200 transition duration-200"
                      whileTap={{ scale: 0.9 }}
                      aria-label={`View comments for ${item.description}`}
                    >
                      <FaComment className="mr-2" /> View Comments
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-3xl shadow-lg max-w-3xl w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 z-50"
                aria-label="Close comments modal"
              >
                <FaTimes />
              </button>
              <div className="flex flex-col md:flex-row">
                <img
                  src={selectedItem.image}
                  alt="Shared Creation"
                  className="w-full md:w-1/2 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
                  loading="lazy"
                />
                <div className="flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-teal-400 mb-2">
                    {selectedItem.description}
                  </h3>
                  <div className="flex items-center mb-4">
                    <motion.button
                      onClick={() => handleLike(selectedItem.id)}
                      className="flex items-center text-teal-500 hover:text-teal-400 transition duration-200"
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Like ${selectedItem.description}`}
                    >
                      <FaHeart className="mr-2" /> {selectedItem.likes} Likes
                    </motion.button>
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
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 mb-2"
                      rows={2}
                    />
                    <motion.button
                      onClick={handleCommentSubmit}
                      className="w-full bg-teal-500 text-gray-900 py-2 rounded-full font-semibold hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Post comment"
                    >
                      Post Comment
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Share;
