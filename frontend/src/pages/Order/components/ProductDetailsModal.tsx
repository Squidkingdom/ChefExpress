import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star } from "lucide-react";
import { Product } from "../types";
import { toast } from "react-toastify";

interface ProductDetailsModalProps {
  product: Product | null;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  addToCart,
  setSelectedProduct,
}) => {
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
    setSelectedProduct(null);
  };

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
          className="bg-gray-900/90 backdrop-blur-md rounded-2xl max-w-4xl w-full relative
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

          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 relative bg-white p-8">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                            px-4 py-2 rounded-full text-gray-900 font-bold">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                           bg-clip-text text-transparent mb-4">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  ({product.reviews?.toLocaleString()} reviews)
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                           py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                           transition-all duration-300 flex items-center justify-center gap-2
                           shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.a
                  href={product.amazonLink}
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
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};