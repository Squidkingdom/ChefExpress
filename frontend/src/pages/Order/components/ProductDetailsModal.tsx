import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { useStore } from "../store/useStore";
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

  // The API returns a price as a string (e.g. "$19.99"). We can display it as-is.
  // If needed, parse it for numeric operations.
  const displayPrice = product.price || "$0.00";

  const { addToCart } = useStore();

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
          className="bg-gray-900/90 backdrop-blur-md rounded-2xl w-full max-w-7xl relative
                     border border-gray-700/50 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 z-10"
            onClick={() => setSelectedProduct(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="flex h-full">
            {/* Image Section */}
            <div className="w-1/2 relative bg-white p-8">
              <div className="aspect-square rounded-xl overflow-hidden">
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
              <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                              px-4 py-2 rounded-full text-gray-900 font-bold">
                {displayPrice}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                               bg-clip-text text-transparent mb-4">
                  {product.name}
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  Category: {product.category || "Unknown"}
                </p>

                <p className="text-gray-300 text-lg mb-4">
                  Quantity: {product.quantity || "N/A"}
                </p>

                <p className="text-gray-300 text-lg mb-8">
                  {product.description || "No description available."}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                {product.URL && (
                  <motion.a
                    href={product.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-[#FF9900] text-white rounded-xl 
                               hover:bg-[#FF9900]/90 transition-colors duration-300
                               shadow-lg shadow-[#FF9900]/20 hover:shadow-[#FF9900]/30
                               flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View on Amazon
                  </motion.a>
                )}

                <motion.button
                  onClick={() => {
                    addToCart(product);
                    setSelectedProduct(null);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                            rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                            transition-all duration-300 flex items-center justify-center gap-2
                            shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};