// src/pages/Order.tsx

import React, { useState, ChangeEvent, useEffect } from "react";
import { 
  FaShoppingCart, FaSearch, FaTrashAlt, FaTimes, 
  FaPlus, FaMinus, FaArrowLeft, FaArrowRight 
} from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/**
 * Interface definitions for Product and CartItem
 */
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

/**
 * Order Page
 * Enhanced with framer-motion animations and updated to align with the Make.tsx design.
 * @returns {React.JSX.Element} - Enhanced Order Page with modern design and features.
 */
const Order: React.FC = () => {
  // Sample product data
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Chef Knife",
      description: "High-quality chef knife for all your cutting needs.",
      price: 29.99,
      image: "/images/knife.jpg",
      category: "Tools",
    },
    {
      id: 2,
      name: "Mixing Bowl Set",
      description: "Durable stainless steel bowls for mixing ingredients.",
      price: 19.99,
      image: "/images/bowls.jpg",
      category: "Utensils",
    },
    {
      id: 3,
      name: "Cutting Board",
      description: "Bamboo cutting board, gentle on your knives.",
      price: 15.99,
      image: "/images/board.jpg",
      category: "Tools",
    },
    {
      id: 4,
      name: "Measuring Cups",
      description: "Set of stainless steel measuring cups for precision.",
      price: 12.99,
      image: "/images/measuring_cups.jpg",
      category: "Utensils",
    },
    {
      id: 5,
      name: "Non-Stick Frying Pan",
      description: "12-inch non-stick frying pan for easy cooking.",
      price: 39.99,
      image: "/images/frying_pan.jpg",
      category: "Cookware",
    },
    // Add more products as needed
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const categories = ["All", "Tools", "Utensils", "Cookware"];

  /**
   * Add a product to the cart
   */
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

  /**
   * Remove a product from the cart
   */
  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
    toast.info("Item removed from cart.");
  };

  /**
   * Update product quantity in cart
   */
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

  /**
   * Handle search input change with debounce
   */
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  /**
   * Filtered products based on search query and category
   */
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  /**
   * Calculate total price
   */
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  /**
   * Handle checkout confirmation
   */
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setShowCheckout(true);
  };

  /**
   * Animation Variants
   */
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const smoothY = useSpring(headerOpacity, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  /**
   * Floating Elements for Background
   */
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
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

  /**
   * Product Card Component
   */
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedProduct(product)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') setSelectedProduct(product);
      }}
      aria-label={`View details of ${product.name}`}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-teal-500 text-gray-900 text-sm px-2 py-1 rounded-md">
          ${product.price.toFixed(2)}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-teal-400 mb-2">
        {product.name}
      </h2>
      <p className="text-gray-300 flex-grow">
        {product.description.substring(0, 60)}...
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          addToCart(product);
        }}
        className="mt-4 bg-teal-500 text-gray-900 px-4 py-2 rounded-full hover:bg-teal-400 transition duration-200 flex items-center justify-center"
        aria-label={`Add ${product.name} to cart`}
      >
        <FaShoppingCart className="mr-2" /> Add to Cart
      </button>
    </motion.div>
  );

  /**
   * Cart Component
   */
  const Cart: React.FC = () => (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg lg:sticky lg:top-20"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
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
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md mr-4"
                    loading="lazy"
                  />
                  <p className="text-lg font-medium text-gray-100">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-400 hover:text-gray-300 p-1"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-2 text-gray-200">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-gray-300 p-1"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-400"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <FaTrashAlt />
                  </button>
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
          <button
            className="w-full mt-4 bg-teal-500 text-gray-900 py-3 rounded-full font-semibold hover:bg-teal-400 transition duration-200 flex items-center justify-center"
            onClick={handleCheckout}
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </motion.div>
  );

  /**
   * Product Details Modal Component
   */
  const ProductDetailsModal: React.FC<{ product: Product }> = ({ product }) => (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
              aria-label="Close product details"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col md:flex-row">
              <img
                src={product.image}
                alt={product.name}
                className="w-full md:w-1/2 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
                loading="lazy"
              />
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-teal-400 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-300 mb-4">
                  {product.description}
                </p>
                <p className="text-2xl font-semibold text-teal-500 mb-6">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    addToCart(product);
                    setSelectedProduct(null);
                  }}
                  className="bg-teal-500 text-gray-900 px-6 py-3 rounded-full hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /**
   * Checkout Modal Component
   */
  const CheckoutModal: React.FC = () => (
    <AnimatePresence>
      {showCheckout && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl w-full relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
              aria-label="Close checkout"
            >
              <FaTimes />
            </button>
            <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center">
              Checkout
            </h2>
            <p className="text-center text-gray-300 mb-8">
              Thank you for shopping with us! This is a demo checkout process.
            </p>
            <button
              className="w-full bg-teal-500 text-gray-900 py-3 rounded-full font-semibold hover:bg-teal-400 transition duration-200"
              onClick={() => {
                setCart([]);
                setShowCheckout(false);
                toast.success("Purchase completed successfully!");
              }}
              aria-label="Complete purchase"
            >
              Complete Purchase
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden relative">
      {/* Animated Background Gradient */}
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
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastClassName="bg-gray-800 text-gray-100"
      />

      {/* Hero Section */}
      <motion.header
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-[40vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-sm" />
        
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Order Your Favorite Kitchen Tools!
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Browse our selection of essential kitchen items.
          </p>
        </motion.div>
      </motion.header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Search and Category Filters */}
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Search Bar */}
          <motion.div variants={fadeIn} className="relative w-full max-w-md">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Search products"
            />
          </motion.div>

          {/* Category Buttons */}
          <motion.div variants={fadeIn} className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
                  selectedCategory === category
                    ? "bg-teal-500 text-gray-900"
                    : "bg-gray-700 text-gray-200 hover:bg-teal-600"
                }`}
                onClick={() => setSelectedCategory(category)}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product List */}
          <motion.section
            className="w-full lg:w-2/3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            id="order-products" // **Important:** Added ID for consistency
          >
            {filteredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.p
                className="text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No products found matching "{debouncedSearch}".
              </motion.p>
            )}
          </motion.section>

          {/* Cart Summary */}
          <motion.aside
            className="w-full lg:w-1/3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <Cart />
          </motion.aside>
        </div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal product={selectedProduct} />
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && <CheckoutModal />}
      </AnimatePresence>
    </div>
  );

  // The FloatingElements, ProductCard, Cart, ProductDetailsModal, and CheckoutModal components are defined above.
};

export default Order;
