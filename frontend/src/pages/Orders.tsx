// src/pages/Order.tsx

import React, { useState, ChangeEvent } from "react";
import { FaShoppingCart, FaSearch, FaTrashAlt, FaTimes, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shop, CartItem, Product } from "../components/Shop";

// Updated Hero Section without scroll transforms
interface HeroSectionProps {
  onStartShopping: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartShopping }) => {
  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, type: "spring", damping: 20 }}
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", damping: 20 }}
      >
        {/* Enhanced glow effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl transform -translate-y-1/2"
        />

        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
            Shop Your{" "}
          </span>
          <br />
          <span className="text-white">Kitchen Essentials</span>
        </motion.h1>

        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Discover and order the best tools at the click of a button.
        </motion.p>

        <motion.button
          onClick={onStartShopping}
          className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full 
                   font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 
                   hover:shadow-teal-500/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Shopping
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight className="w-6 h-6" />
            </motion.span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                        opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Order: React.FC = () => {
  // Same as your current logic
  const [products] = useState<Product[]>([
    {
      name: "Dawn Multi-Purpose Reusable Wipes, 6 Pack",
      price: "$11.00",
      URL: "https://www.amazon.com/Dawn-Multi-Purpose-Reusable-Wipes-Pack/dp/B081FJZ7HJ?ref_=ast_sto_dp",
      quantity: 1,
      category: "Health & Household",
      id: 7,
      img: "https://m.media-amazon.com/images/I/41G66bY0xzL._SY300_SX300_QL70_FMwebp_.jpg",
    },
    {
      name: "McCormick Basil Leaves, 1.25 oz",
      price: "$5.62",
      URL: "https://www.amazon.com/McCormick-Basil-Leaves-1-25-oz/dp/B0CX7NJPXJ?ref_=ast_sto_dp",
      quantity: 1,
      category: "Grocery & Gourmet Food",
      id: 42,
      img: "https://m.media-amazon.com/images/I/41WUAlFI01L._SX300_SY300_QL70_FMwebp_.jpg",
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"hero" | "shop">("hero");

  const categories = ["All", "Tools", "Utensils", "Cookware"];

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
    toast.info("Item removed from cart.");
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const calculateTotal = () => {
    const total = cart.reduce((acc, item) => {
      const price = parseFloat(item.price.replace("$", "")) || 0;
      return acc + price * item.quantity;
    }, 0);
    return total.toFixed(2);
  };

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.15),transparent_60%)]" />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {currentView === "hero" && (
        <HeroSection onStartShopping={() => setCurrentView("shop")} />
      )}

      {currentView === "shop" && (
        <div className="relative z-10 container mx-auto px-4 py-10">
          {/* Search and Category Filters */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
                    selectedCategory === category
                      ? "bg-teal-500 text-gray-900"
                      : "bg-gray-700 text-gray-200 hover:bg-teal-600"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Product List */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Shop
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  setSelectedProduct={setSelectedProduct}
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                />
              </motion.div>
            </div>

            {/* Cart Summary */}
            <aside className="w-full lg:w-1/3">
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl shadow-xl sticky top-20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">
                  Your Cart
                </h2>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400">Your cart is empty.</p>
                ) : (
                  <div>
                    <ul className="divide-y divide-gray-700">
                      {cart.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center py-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <p className="text-lg font-medium text-gray-100 line-clamp-1">
                              {item.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, parseInt(e.target.value))
                              }
                              className="w-16 bg-gray-700 text-gray-100 border border-gray-600 rounded-md text-center"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-400"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <FaTrashAlt />
                            </motion.button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center py-4 mt-4 border-t border-gray-700">
                      <p className="text-xl font-semibold text-gray-100">Total</p>
                      <p className="text-xl font-semibold text-teal-500">
                        ${calculateTotal()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-4 bg-teal-500 text-gray-900 py-3 rounded-full font-semibold hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                      onClick={() => setShowCheckout(true)}
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </aside>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 p-6 rounded-2xl shadow-xl max-w-3xl w-full relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
                aria-label="Close product details"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes />
              </motion.button>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full md:w-1/2 h-64 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <h2 className="text-3xl font-bold text-teal-400 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {selectedProduct.description}
                  </p>
                  <p className="text-2xl font-semibold text-teal-500 mb-6">
                    {selectedProduct.price}
                  </p>
                  <motion.button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="bg-teal-500 text-gray-900 px-6 py-3 rounded-full hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 p-8 rounded-2xl shadow-xl max-w-xl w-full relative text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
                aria-label="Close checkout"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes />
              </motion.button>
              <h2 className="text-3xl font-bold text-teal-400 mb-6">Checkout</h2>
              <p className="text-gray-300 mb-8">
                Thank you for shopping with us! This is a demo checkout process.
              </p>
              <motion.button
                onClick={() => {
                  setCart([]);
                  setShowCheckout(false);
                  toast.success("Purchase completed successfully!");
                }}
                className="w-full bg-teal-500 text-gray-900 py-3 rounded-full font-semibold hover:bg-teal-400 transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Complete Purchase
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
