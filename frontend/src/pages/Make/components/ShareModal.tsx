// src/components/ShareModal.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaShare, FaGlobe,
  FaCamera, FaHashtag, FaImage,
} from 'react-icons/fa';
import type { ShareModalProps, Recipe } from '../types';
import { toast } from 'react-toastify';

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  recipe,
  onShare,
}) => {
  const [description, setDescription] = useState(recipe.description || '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(recipe.image || null);
  const [tags, setTags] = useState<string[]>(recipe.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleShare = () => {
    if (!description.trim()) {
      toast.error('Please add a description');
      return;
    }

    const updatedRecipe: Recipe = {
      ...recipe,
      description,
      tags,
      image: previewImage,
      isPublic: true,
      shares: (recipe.shares || 0) + 1,
      created: new Date().toISOString(),
    };

    onShare(updatedRecipe);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 pointer-events-none" />

            {/* Header */}
            <div className="relative p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-500/10 rounded-full">
                    <FaShare className="text-2xl text-teal-400" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                    Share Recipe
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Recipe Preview */}
              <div className="flex items-start gap-4">
                <div className="relative group flex-shrink-0">
                  <div className="w-32 h-32 rounded-xl overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                        <FaImage className="text-3xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  <label
                    className="absolute inset-0 flex items-center justify-center bg-black/50 
                      opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <FaCamera className="text-white text-2xl" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white mb-2">{recipe.title}</h3>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-100
                      placeholder-gray-400 resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FaHashtag className="text-teal-400" /> Add Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300
                        flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <FaTimes size={12} />
                      </button>
                    </motion.span>
                  ))}
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag..."
                    className="px-3 py-1 bg-transparent text-sm text-gray-300 
                      focus:outline-none min-w-[100px] flex-grow"
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaGlobe className="text-teal-400" />
                <span>This recipe will be shared publicly with the community</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700/50 flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gray-700/50 text-gray-300
                  hover:bg-gray-600/50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 
                  to-cyan-400 text-gray-900 font-medium shadow-lg 
                  shadow-teal-500/25 hover:shadow-teal-500/40"
              >
                Share Recipe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
