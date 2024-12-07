import React from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  addToCart,
  setSelectedProduct,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <motion.div
      className="group relative cursor-pointer"
      onClick={() => setSelectedProduct(product)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-gray-800/30 rounded-2xl overflow-hidden backdrop-blur-sm 
                    border border-gray-700/50 h-full transition-all duration-300 
                    hover:shadow-xl hover:shadow-teal-500/10 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain bg-white p-4"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                       px-4 py-2 rounded-full text-gray-900 font-bold shadow-lg">
            ${product.price.toFixed(2)}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-teal-400 group-hover:text-teal-300
                      transition-colors duration-300">
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              ({product.reviews?.toLocaleString()})
            </span>
          </div>

          <p className="text-gray-400 mb-6 line-clamp-2 flex-grow">
            {product.description}
          </p>

          {/* Buttons Container */}
          <div className="flex gap-3 mt-auto">
            <motion.button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-400 
                       text-gray-900 px-4 py-3 rounded-xl font-medium
                       hover:from-teal-400 hover:to-cyan-300 
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
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-3 bg-[#FF9900] text-white rounded-xl 
                       hover:bg-[#FF9900]/90 transition-colors duration-300
                       shadow-lg shadow-[#FF9900]/20 hover:shadow-[#FF9900]/30
                       flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Amazon
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};