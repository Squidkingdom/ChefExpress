// src/pages/Order.tsx

import React, {
  useState,
  useEffect,
  useMemo,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
} from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaTrashAlt,
  FaTimes,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaTools,
  FaUtensils,
  FaBurn,
} from "react-icons/fa";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
 * Animation Variants
 */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Floating Elements for Background
 */
const FloatingElements: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-4 h-4 bg-teal-500/10 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
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
interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  addToCart,
  setSelectedProduct,
}) => (
  <motion.div
    className="bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col cursor-pointer overflow-hidden relative"
    whileHover={{ scale: 1.02 }}
    onClick={() => setSelectedProduct(product)}
    role="button"
    tabIndex={0}
    onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") setSelectedProduct(product);
    }}
    aria-label={`View details of ${product.name}`}
    variants={fadeIn}
  >
    {/* Animated background */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform scale-110"
    />
    <div className="relative z-10 flex flex-col h-full">
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-teal-500 text-gray-900 text-sm px-2 py-1 rounded-md">
          ${product.price.toFixed(2)}
        </span>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-bold text-teal-400 mb-2">
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
      </div>
    </div>
  </motion.div>
);

/**
 * Cart Component
 */
interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  calculateTotal: () => string;
  handleCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
  handleCheckout,
}) => (
  <motion.div
    className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-lg shadow-lg lg:sticky lg:top-20"
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
interface ProductDetailsModalProps {
  product: Product;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  addToCart,
  setSelectedProduct,
}) => (
  <AnimatePresence>
    {product && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl w-full relative"
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
              <p className="text-gray-300 mb-4">{product.description}</p>
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
interface CheckoutModalProps {
  showCheckout: boolean;
  setShowCheckout: Dispatch<SetStateAction<boolean>>;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  showCheckout,
  setShowCheckout,
  setCart,
}) => (
  <AnimatePresence>
    {showCheckout && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-xl w-full relative"
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

/**
 * Category Filter Component
 */
interface CategoryFiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => (
  <motion.div
    className="flex flex-wrap gap-4 justify-center mb-8"
    variants={fadeIn}
    initial="hidden"
    animate="visible"
  >
    {[
      { title: "All", icon: FaShoppingCart }, // Using FaShoppingCart for "All" as a placeholder
      { title: "Tools", icon: FaTools },
      { title: "Utensils", icon: FaUtensils },
      { title: "Cookware", icon: FaBurn },
    ].map((category) => (
      <motion.button
        key={category.title}
        onClick={() =>
          setSelectedCategory(
            selectedCategory === category.title ? null : category.title
          )
        }
        className={`px-4 py-2 rounded-full font-medium transition duration-200 flex items-center gap-2 ${
          selectedCategory === category.title
            ? `bg-gradient-to-r from-teal-400 to-cyan-300 text-gray-900`
            : "bg-gray-700 text-gray-200 hover:bg-teal-600"
        }`}
        aria-label={`Filter by ${category.title}`}
      >
        <category.icon className="text-lg" />
        {category.title}
      </motion.button>
    ))}
  </motion.div>
);

/**
 * SearchBar Component
 */
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => (
  <motion.div
    className="flex items-center gap-2 w-full max-w-md mx-auto"
    variants={fadeIn}
    initial="hidden"
    animate="visible"
  >
    <div className="relative flex-grow">
      <FaSearch className="absolute top-3 left-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search for a product..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-700/50 bg-gray-800/50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
        aria-label="Search for a product"
      />
    </div>
    <button
      className="px-4 py-2 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-600 transition duration-200"
      onClick={() => setSearchQuery("")}
      aria-label="Clear search"
    >
      Clear
    </button>
  </motion.div>
);

/**
 * Main Order Component
 */
const OrderPage: React.FC = () => {
  // Sample product data
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Chef Knife",
      description: "High-quality chef knife for all your cutting needs.",
      price: 29.99,
      image: "/images/knife.jpg", // Ensure this path is correct
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>("hero");

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
   * Debounced Search Query
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
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (selectedCategory ? product.category === selectedCategory : true) &&
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [products, selectedCategory, debouncedSearch]
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
   * Animation Variants for Header
   */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden flex flex-col">
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

      {/* Main Content */}
      <div className="relative z-10 flex-grow">
        {/* Hero Section */}
        {currentView === "hero" && (
          <motion.header
            style={{ y: smoothY, opacity, scale }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
          >
            <motion.div
              className="relative z-10 max-w-6xl mx-auto px-6 text-center mt-24"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl transform -translate-y-1/2" />

              <h2 className="text-6xl md:text-8xl font-extrabold mb-8 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                  Equip
                </span>{" "}
                <span className="text-white">Your Kitchen</span>
              </h2>
              <p className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed">
                Shop for the best culinary tools and utensils.
              </p>

              <motion.button
                onClick={() => setCurrentView("shop")}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Shopping
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaArrowRight />
                  </motion.span>
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </motion.header>
        )}

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Add top margin when not on hero section */}
          {currentView !== "hero" && <div className="mt-24" />}

          {/* Page Content */}
          <AnimatePresence mode="wait">
            {currentView === "shop" && (
              <motion.div
                key="shop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Category Filters */}
                <CategoryFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                {/* Search Bar */}
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />

                {/* Product List */}
                <motion.section
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        setSelectedProduct={setSelectedProduct}
                      />
                    ))
                  ) : (
                    <motion.p
                      className="text-center text-gray-400 col-span-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      No products found matching your search.
                    </motion.p>
                  )}
                </motion.section>

                {/* Cart Summary */}
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  calculateTotal={calculateTotal}
                  handleCheckout={handleCheckout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          addToCart={addToCart}
          setSelectedProduct={setSelectedProduct}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          showCheckout={showCheckout}
          setShowCheckout={setShowCheckout}
          setCart={setCart}
        />
      </div>

    </div>
  );
};

export default OrderPage;
