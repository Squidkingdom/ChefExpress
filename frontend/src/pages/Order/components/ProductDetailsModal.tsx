import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "../types";

interface ProductDetailsModalProps {
  product: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  setSelectedProduct,
}) => {
  if (!product) return null;

  const displayPrice = product.price || "$0.00";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div
          className="bg-gray-900/90 backdrop-blur-md rounded-xl w-full max-w-4xl relative
                     border border-gray-700/50 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 z-10"
            onClick={() => setSelectedProduct(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/2 relative bg-white p-6">
              <div className="aspect-square rounded-lg overflow-hidden">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>
              <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-cyan-400 
                             px-3 py-1.5 rounded-full text-gray-900 font-bold text-sm">
                {displayPrice}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                              bg-clip-text text-transparent mb-3">
                  {product.name}
                </h2>

                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Category: {product.category || "Unknown"}
                </p>

                <p className="text-gray-300 text-base mb-3">
                  Quantity: {product.quantity || "N/A"}
                </p>

                <p className="text-gray-300 text-base mb-6">
                  {product.description || "No description available."}
                </p>
              </div>

              <div className="flex justify-center">
                {product.URL && (
                  <motion.a
                    href={product.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#FF9900] text-white rounded-lg 
                             hover:bg-[#FF9900]/90 transition-colors duration-300
                             shadow-lg shadow-[#FF9900]/20 hover:shadow-[#FF9900]/30
                             flex items-center justify-center w-full md:w-auto text-center
                             text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View on Amazon
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};