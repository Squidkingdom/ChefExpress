/***************************************************************************************************
 * Name of code artifact: OrderPage.tsx
 * Brief description of what the code does:
 *   This file defines the OrderPage component, which showcases a hero section and a product 
 *   browsing page. Users can transition from the hero section to the shop section, search and 
 *   filter products, add items to a cart, and proceed to checkout. The component integrates 
 *   React Query for data fetching, Framer Motion for animations, Toastify for notifications, and 
 *   Zustand for state management (via useStore).
 * Programmer’s name: Brady, Darshil
 * Date the code was created: 11/24/24
 * Dates the code was revised: 12/8/24
 * Brief description of each revision & author:
 *   product filtering, and implemented hero-to-shop transitions.
 * Preconditions:
 *   - React environment and related dependencies (React Query, Framer Motion, Toastify, Zustand) installed.
 *   - Backend API endpoint (http://localhost:3000/api/items) must be available for product data.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - No direct inputs; this page interacts with global state, a backend API, and user interactions.
 *   - `onStartShopping` callback triggers transitioning from hero to shop.
 * Postconditions:
 *   - Displays a hero section initially.
 *   - Allows switching to a shopping page, searching, filtering, viewing products, adding to cart, and checking out.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If fetching products fails, shows an error message.
 *   - User actions triggering invalid states are handled gracefully (e.g., empty cart shows no items).
 * Side effects:
 *   - Fetches product data from the backend.
 *   - Updates global cart state and shows toast notifications on certain actions.
 * Invariants:
 *   - The hero section appears first; user must interact to view the shop.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - QueryClientProvider: Provides React Query context for data fetching.
 *   - HeroSection: Initial view encouraging user to start shopping.
 *   - ShopContent: Displays a header, category filters, search bar, and product grid.
 *   - Cart and CheckoutModal: Overlays for cart management and checkout process.
 *   - ProductDetailsModal: Shows detailed info about a clicked product.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and hooks for state, effects, and callbacks
import React, { useState, useEffect, useCallback } from "react";
// Import QueryClient and QueryClientProvider for React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Import motion and AnimatePresence from Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion";
// Import icons from lucide-react
import { ShoppingCart, Search, X } from "lucide-react";
// Import ToastContainer from react-toastify for notifications
import { ToastContainer } from "react-toastify";
// useDebounce hook for debouncing search input
import { useDebounce } from 'use-debounce';
import "react-toastify/dist/ReactToastify.css";

// Import hero, product grid, cart, checkout modal, and product details modal components
import { HeroSection } from "./components/HeroSection";
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";
import { CheckoutModal } from "./components/CheckoutModal";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
// Import Zustand store hook for cart and product state management
import { useStore } from "./store/useStore";
// Import Product type
import type { Product } from "./types";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

// Define available categories for filtering
const CATEGORIES = ["All", "Health & Household", "Grocery & Gourmet Food"];

// Interface for the internal SearchBar component props
interface SearchBarProps {
  searchQuery: string;                  // Current global search query
  setSearchQuery: (query: string) => void; // Updates global search query
  scrolled: boolean;                    // Indicates if user has scrolled (affects styling)
}

// Internal SearchBar component for inputting and debouncing search queries
const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  scrolled,
}) => {
  // Local state to handle immediate user input
  const [localQuery, setLocalQuery] = React.useState(searchQuery);
  // Debounce local input changes by 300ms before updating global query
  const [debouncedValue] = useDebounce(localQuery, 300);

  // Update global search query whenever debounced value changes
  React.useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  // Handle user typing in the input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  // Clear the search field and global query
  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="w-96 relative">
      {/* Background styling changes if scrolled */}
      <div 
        className={`absolute inset-0 rounded-lg backdrop-blur-lg transition-all duration-500 ease-in-out
          ${scrolled 
            ? "bg-gray-900/80 shadow-lg shadow-gray-900/20 border border-gray-700/20" 
            : "bg-gray-800/50 border border-gray-700/50"}`}
      />
      <div className="relative">
        {/* Search input field */}
        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search for kitchen tools..."
          className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-gray-700/50 rounded-lg
                   text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/50
                   focus:border-transparent transition-all duration-300 text-sm"
        />
        {/* Search icon inside input */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        {/* Clear button if input is not empty */}
        {localQuery && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={handleClear}
              className="p-0.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 
                       hover:text-gray-200 transition-colors duration-200 hover:scale-110
                       active:scale-95 transform"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main OrderPage component representing the full page (Hero -> Shop)
export const OrderPage: React.FC = () => {
  // Manage which view is currently displayed: "hero" or "shop"
  const [currentView, setCurrentView] = useState<"hero" | "shop">("hero");
  // Search query state for product filtering
  const [searchQuery, setSearchQuery] = useState("");
  // Currently selected category for filtering products
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Whether the user has scrolled to alter the header styling
  const [scrolled, setScrolled] = useState(false);
  // Product selected for detailed view, or null if none selected
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // State to show/hide the cart overlay
  const [showCart, setShowCart] = useState(false);
  // State to show/hide the checkout modal
  const [showCheckout, setShowCheckout] = useState(false);

  // Extract cart-related actions and data from the global store
  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } = useStore();

  // Listen for scroll events to update `scrolled` state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize store actions to avoid unnecessary re-renders
  const memoizedAddToCart = useCallback((product: Product) => addToCart(product), [addToCart]);
  const memoizedRemoveFromCart = useCallback((id: number) => removeFromCart(id), [removeFromCart]);
  const memoizedUpdateQuantity = useCallback((id: number, quantity: number) => updateQuantity(id, quantity), [updateQuantity]);

  // Header with title and cart button
  const Header = () => (
    <motion.div
      initial={{ y: -100, opacity: 0 }} // Start hidden above
      animate={{ y: 0, opacity: 1 }}    // Slide down and fade in
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-30 backdrop-blur-lg py-4 border-b border-gray-800 px-4 
        transition-colors duration-300 ${
          scrolled ? 'bg-gray-900/80' : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Site title with gradient text */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Professional Kitchen Shop
          </h1>
          {/* Cart button with item count badge */}
          <motion.button
            className="relative p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300
                     border border-gray-700/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart className="w-5 h-5 text-gray-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-gray-900 
                             w-5 h-5 rounded-full text-xs font-bold flex items-center 
                             justify-center">
                {cart.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Search bar and category buttons
  const SearchAndCategories = () => (
    <motion.div
      initial={{ y: -50, opacity: 0 }} // Start slightly above and transparent
      animate={{ y: 0, opacity: 1 }}    // Slide down and appear
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-6xl mx-auto py-4 px-4"
    >
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-xl opacity-50" />
          {/* Pass scrolled state and search query handlers to SearchBar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            scrolled={scrolled}
          />
        </div>
        <div className="flex gap-2">
          {/* Category filter buttons */}
          {CATEGORIES.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
                ${
                  category === selectedCategory
                    ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // ShopContent displays header, search/categories, and product grid
  const ShopContent = () => (
    <div className="max-w-8xl mx-auto">
      <Header />
      <SearchAndCategories />
      <div className="p-4">
        {/* ProductGrid retrieves products and uses addToCart and setSelectedProduct */}
        <ProductGrid
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          addToCart={memoizedAddToCart}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen font-sans overflow-x-hidden relative">
        {/* Background gradients and decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),transparent_60%)]" />
          </div>
        </div>

        {/* Actual content above background */}
        <div className="relative z-10">
          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
            toastClassName="bg-gray-800 text-gray-100"
          />

          {/* AnimatePresence handles transition between hero and shop views */}
          <AnimatePresence mode="wait">
            {currentView === "hero" ? (
              <HeroSection onStartShopping={() => setCurrentView("shop")} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}  // Fade in for shop view
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-24"
              >
                <ShopContent />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart overlay, visible if showCart is true */}
          <AnimatePresence>
            {showCart && (
              <Cart
                onClose={() => setShowCart(false)}
                onCheckout={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
                cart={cart}
                removeFromCart={memoizedRemoveFromCart}
                updateQuantity={memoizedUpdateQuantity}
                calculateTotal={calculateTotal}
              />
            )}
          </AnimatePresence>

          {/* Product details modal if a product is selected */}
          {selectedProduct && (
            <ProductDetailsModal
              product={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          )}
          
          {/* Checkout modal if showCheckout is true */}
          <CheckoutModal
            showCheckout={showCheckout}
            setShowCheckout={setShowCheckout}
            setCart={calculateTotal}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default OrderPage;
