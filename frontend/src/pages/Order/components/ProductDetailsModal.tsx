/***************************************************************************************************
 * Name of code artifact: ProductDetailsModal.tsx
 * Brief description of what the code does:
 *   This component displays a modal with details about a selected product. It includes an image, 
 *   product information (name, category, quantity, description), and actions to view the product 
 *   on Amazon or add it to the cart. The modal is displayed when a product is selected and can be 
 *   closed by clicking outside the modal or the close button.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/13/24
 * Dates the code was revised: 11/19/24
 * Brief description of each revision & author:
 *   11/19/24 - Brady Holland: Integrated animations, styling improvements, added Amazon link 
 *   and integrated cart functionality.
 * Preconditions:
 *   - `product` prop must be provided (or null if no product is selected).
 *   - `setSelectedProduct` function must be provided to close the modal.
 *   - `useStore` hook is used to manage cart state externally.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `product`: A valid Product object or null. If null, modal doesn't render.
 *   - `setSelectedProduct`: A function that accepts a Product or null to update selected product state.
 * Postconditions:
 *   - When open, displays product details in a modal.
 *   - User can add the product to the cart or view it on Amazon.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element or null).
 * Error and exception condition values or types:
 *   - If product data is missing certain fields, defaults or placeholders are shown.
 * Side effects:
 *   - Adds product to the cart using `addToCart` from store.
 *   - Closes the modal on outside click or upon action completion.
 * Invariants:
 *   - Modal layout remains consistent.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - AnimatePresence and motion.div for modal fade-in/out animations.
 *   - Product image and details section.
 *   - Buttons for Amazon link and adding to cart, with hover/tap animations.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and framer-motion for animations
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import icons
import { X, ShoppingCart } from "lucide-react";
// Import store hook to manage cart
import { useStore } from "../store/useStore";
// Import Product type for type-checking
import type { Product } from "../types";

interface ProductDetailsModalProps {
  product: Product | null;                // The product to show details for, or null if none selected
  setSelectedProduct: (product: Product | null) => void; // Function to close modal by setting product to null
}

/**
 * ProductDetailsModal:
 * Displays a modal with detailed information about a product.
 * Allows adding the product to the cart or visiting Amazon if a URL is provided.
 * Closes when clicking outside or on the close button.
 */
export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  setSelectedProduct,
}) => {
  // If there's no product selected, don't render anything
  if (!product) return null;

  // Display price as returned from API. If needed, parsing can be done.
  const displayPrice = product.price || "$0.00";

  // Access addToCart function from global store
  const { addToCart } = useStore();

  return (
    <AnimatePresence>
      {/* Overlay and modal are shown if product is not null */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}        // Start transparent
        animate={{ opacity: 1 }}         // Fade in overlay
        exit={{ opacity: 0 }}            // Fade out on close
        onClick={() => setSelectedProduct(null)} // Close on overlay click
      >
        <motion.div
          className="bg-gray-900/90 backdrop-blur-md rounded-2xl w-full max-w-7xl relative
                     border border-gray-700/50 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }} // Start slightly smaller and lower
          animate={{ scale: 1, opacity: 1, y: 0 }}     // Animate to full size and aligned
          exit={{ scale: 0.9, opacity: 0, y: 20 }}     // Reverse animation on exit
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        >
          {/* Close button at top-right corner */}
          <motion.button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 z-10"
            onClick={() => setSelectedProduct(null)}
            whileHover={{ scale: 1.1 }} // Slight enlarge on hover
            whileTap={{ scale: 0.9 }}    // Slight shrink on tap
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="flex h-full">
            {/* Left side: Image section */}
            <div className="w-1/2 relative bg-white p-8">
              {/* Display product image or placeholder if not available */}
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
              {/* Price tag overlay */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                              px-4 py-2 rounded-full text-gray-900 font-bold">
                {displayPrice}
              </div>
            </div>

            {/* Right side: Content section */}
            <div className="w-1/2 p-8 flex flex-col justify-between">
              <div>
                {/* Product name with gradient text */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                               bg-clip-text text-transparent mb-4">
                  {product.name}
                </h2>

                {/* Category, quantity, and description */}
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

              {/* Action buttons: View on Amazon and Add to Cart */}
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
                    addToCart(product);      // Add selected product to cart
                    setSelectedProduct(null); // Close modal after adding
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
