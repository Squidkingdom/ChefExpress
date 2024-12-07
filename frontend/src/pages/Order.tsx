import React, {
  useState,
  useMemo,
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
  FaChevronRight,
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

// Interfaces
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

// Sample product data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Professional Chef Knife",
    description:
      "Premium high-carbon stainless steel chef knife with ergonomic handle. Perfect for precise cutting and chopping.",
    price: 129.99,
    image: "/images/knife.jpg",
    category: "Tools",
  },
  {
    id: 2,
    name: "Artisan Mixing Bowl Set",
    description:
      "Set of 3 premium stainless steel mixing bowls with non-slip bases and measurement markings.",
    price: 79.99,
    image: "/images/bowls.jpg",
    category: "Utensils",
  },
  {
    id: 3,
    name: "Premium Cutting Board",
    description:
      "End-grain bamboo cutting board with juice groove and professional-grade durability.",
    price: 59.99,
    image: "/images/board.jpg",
    category: "Tools",
  },
  {
    id: 4,
    name: "Precision Measuring Set",
    description:
      "Complete set of stainless steel measuring cups and spoons with engraved measurements.",
    price: 34.99,
    image: "/images/measuring_cups.jpg",
    category: "Utensils",
  },
  {
    id: 5,
    name: "Professional Cookware Set",
    description:
      "10-piece non-stick ceramic cookware set with tempered glass lids and stay-cool handles.",
    price: 299.99,
    image: "/images/cookware_set.jpg",
    category: "Cookware",
  },
  {
    id: 6,
    name: "Digital Kitchen Scale",
    description:
      "High-precision digital scale with tare function and multiple unit conversions.",
    price: 24.99,
    image: "/images/scale.jpg",
    category: "Tools",
  },
  // Add more products as needed
];

// Animation Variants
const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Background Elements Component
const BackgroundElements = () => (
  <>
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
      </div>
    </div>

    {/* Animated floating elements */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${
            i % 3 === 0
              ? "w-16 h-16 border-2 border-teal-500/10"
              : i % 3 === 1
              ? "w-12 h-12 bg-cyan-500/5"
              : "w-8 h-8 bg-teal-500/5"
          } rounded-lg transform -rotate-45`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  </>
);

// Hero Section Component
const HeroSection: React.FC<{ onStartShopping: () => void }> = ({
  onStartShopping,
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 15 });

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothY, opacity, scale }}
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
            Professional{" "}
          </span>
          <br />
          <span className="text-white">Kitchen Tools</span>
        </motion.h1>

        <motion.p
          className="text-2xl md:text-4xl text-gray-300 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Equip your kitchen with premium quality tools
          <br />
          <span className="text-teal-400">crafted for perfection</span>
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
              <FaArrowRight />
            </motion.span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 
                        opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Category Filters Component
const CategoryFilters: React.FC<{
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}> = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: "all", name: "All", icon: FaShoppingCart },
    { id: "Tools", name: "Tools", icon: FaTools },
    { id: "Utensils", name: "Utensils", icon: FaUtensils },
    { id: "Cookware", name: "Cookware", icon: FaBurn },
  ];

  return (
    <motion.div
      className="flex flex-wrap gap-4 justify-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected =
          selectedCategory === null
            ? category.id === "all"
            : selectedCategory === category.name;

        return (
          <motion.button
            key={category.id}
            onClick={() =>
              setSelectedCategory(category.id === "all" ? null : category.name)
            }
            className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 
              ${
                isSelected
                  ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 
                          blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 text-lg">
              <Icon />
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// Search Bar Component
const SearchBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => (
  <motion.div
    className="max-w-2xl mx-auto relative"
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
  >
    <div className="absolute inset-0 bg-gray-800/50 rounded-xl backdrop-blur-lg" />
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for kitchen tools..."
        className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl
                 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/50
                 focus:border-transparent transition-all duration-300"
      />
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      {searchQuery && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSearchQuery("")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400
                   hover:text-gray-200 transition-colors duration-200"
        >
          <FaTimes className="text-xl" />
        </motion.button>
      )}
    </div>
  </motion.div>
);

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
}> = ({ product, addToCart, setSelectedProduct }) => (
  <motion.div
    className="group relative"
    variants={fadeInUp}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative bg-gray-800/30 rounded-2xl overflow-hidden backdrop-blur-sm 
                  border border-gray-700/50 h-full transition-all duration-300 
                  hover:shadow-xl hover:shadow-teal-500/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 
                   transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

        {/* Price Tag */}
        <motion.div
          className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                   px-4 py-2 rounded-full text-gray-900 font-bold shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          ${product.price.toFixed(2)}
        </motion.div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-teal-400 group-hover:text-teal-300
                   transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-400 mb-6 line-clamp-2">
          {product.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-400 
                     text-gray-900 px-4 py-3 rounded-xl font-medium
                     hover:from-teal-400 hover:to-cyan-300 
                     transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart /> Add to Cart
          </motion.button>
          <motion.button
            onClick={() => setSelectedProduct(product)}
            className="px-4 py-3 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 
                     transition-colors duration-300 text-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Details
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Cart Item Component
const CartItem: React.FC<{
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}> = ({ item, updateQuantity, removeFromCart }) => (
  <motion.div
    className="flex items-center gap-4 py-4 border-b border-gray-700/50"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <img
      src={item.image}
      alt={item.name}
      className="w-20 h-20 object-cover rounded-lg"
    />
    <div className="flex-1">
      <h4 className="font-medium text-gray-200">{item.name}</h4>
      <p className="text-teal-400">${item.price.toFixed(2)}</p>
    </div>
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <FaMinus />
      </motion.button>
      <span className="text-gray-200 w-8 text-center">{item.quantity}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <FaPlus />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => removeFromCart(item.id)}
        className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
      >
        <FaTrashAlt />
      </motion.button>
    </div>
  </motion.div>
);

// Cart Component
const Cart: React.FC<{
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  calculateTotal: () => string;
  handleCheckout: () => void;
}> = ({
  cart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
  handleCheckout,
}) => {
  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl z-40"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-teal-400 to-cyan-300 
                    bg-clip-text text-transparent mb-6">
        Shopping Cart
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-lg"
          >
            Your cart is empty
          </motion.div>
        </div>
      ) : (
        <div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin 
                        scrollbar-thumb-teal-500/30 scrollbar-track-gray-800/30">
            <AnimatePresence>
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-medium text-gray-300">Total</span>
              <span className="text-2xl font-bold text-teal-400">
                ${calculateTotal()}
              </span>
            </div>

            <motion.button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                       py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                       transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
              <FaChevronRight />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Product Details Modal Component
const ProductDetailsModal: React.FC<{
  product: Product | null;
  addToCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
}> = ({ product, addToCart, setSelectedProduct }) => (
  <AnimatePresence>
    {product && (
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div
          className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full relative
          border border-gray-700/50"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            onClick={() => setSelectedProduct(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={24} />
          </motion.button>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 relative">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-cyan-400 
                            px-4 py-2 rounded-full text-gray-900 font-bold">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                           bg-clip-text text-transparent mb-4">
                {product.name}
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                {product.description}
              </p>
              <motion.button
                onClick={() => {
                  addToCart(product);
                  setSelectedProduct(null);
                  toast.success(`${product.name} added to cart!`);
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                         py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                         transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart size={20} />
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Checkout Modal Component
const CheckoutModal: React.FC<{
  showCheckout: boolean;
  setShowCheckout: Dispatch<SetStateAction<boolean>>;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}> = ({ showCheckout, setShowCheckout, setCart }) => (
  <AnimatePresence>
    {showCheckout && (
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowCheckout(false)}
      >
        <motion.div
          className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 max-w-xl w-full relative
          border border-gray-700/50"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            onClick={() => setShowCheckout(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={24} />
          </motion.button>
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                         bg-clip-text text-transparent mb-6">
              Complete Your Purchase
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Thank you for shopping with us! This is a demo checkout process.
            </p>
            <motion.button
              onClick={() => {
                setCart([]);
                setShowCheckout(false);
                toast.success("Order completed successfully! 🎉");
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                       py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                       transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Complete Purchase
              <FaChevronRight />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Order Page Component
const OrderPage: React.FC = () => {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"hero" | "shop">("hero");

  // Cart functions
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
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Filtered products
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (selectedCategory ? product.category === selectedCategory : true) &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, selectedCategory, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Background Elements */}
      <BackgroundElements />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-gray-800 text-gray-100"
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === "hero" ? (
          <HeroSection onStartShopping={() => setCurrentView("shop")} />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="container mx-auto px-4 py-24"
          >
            <div className="max-w-7xl mx-auto">
              {/* Search and Filters */}
              <div className="sticky top-20 z-30 bg-gray-900/80 backdrop-blur-lg py-8 space-y-8
                            border-b border-gray-800">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <CategoryFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>

              {/* Products Grid and Cart */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div className="lg:col-span-2 xl:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        setSelectedProduct={setSelectedProduct}
                      />
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-40">
                    <Cart
                      cart={cart}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                      calculateTotal={calculateTotal}
                      handleCheckout={() => setShowCheckout(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        addToCart={addToCart}
        setSelectedProduct={setSelectedProduct}
      />
      <CheckoutModal
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        setCart={setCart}
      />
    </div>
  );
};

export default OrderPage;
