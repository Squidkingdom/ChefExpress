import React, { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { HeroSection } from "./components/HeroSection";
import { SearchBar } from "./components/SearchBar";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";
import { CheckoutModal } from "./components/CheckoutModal";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { useStore } from "./store/useStore";
import type { Product, CartItem } from "./types";

const queryClient = new QueryClient();

const CATEGORIES = ["All", "Health & Household", "Grocery & Gourmet Food"];

export const OrderPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"hero" | "shop">("hero");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } = useStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize the cart-related functions to avoid circular dependencies
  const memoizedAddToCart = useCallback((product: Product) => addToCart(product), [addToCart]);
  const memoizedRemoveFromCart = useCallback((id: number) => removeFromCart(id), [removeFromCart]);
  const memoizedUpdateQuantity = useCallback((id: number, quantity: number) => updateQuantity(id, quantity), [updateQuantity]);

  const ShopContent = () => (
    <div className="max-w-8xl mx-auto">
      <div
        className={`sticky top-0 z-30 backdrop-blur-lg py-8 border-b border-gray-800 px-4 
        transition-colors duration-300 ${
          scrolled ? 'bg-gray-900/80' : 'bg-transparent'
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent text-center">
            Professional Kitchen Shop
          </h1>
        </div>

        <div className="flex items-center justify-center mb-8">
          <motion.button
            className="relative p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart className="w-6 h-6 text-gray-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-gray-900 
                             w-5 h-5 rounded-full text-xs font-bold flex items-center 
                             justify-center">
                {cart.length}
              </span>
            )}
          </motion.button>
        </div>

        <div className="space-y-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            scrolled={scrolled}
          />
          <div className="flex flex-wrap gap-4 justify-center">
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  category === selectedCategory
                    ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <ProductGrid
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          addToCart={memoizedAddToCart}
          setSelectedProduct={setSelectedProduct}
        />

        <div className="text-center text-gray-400 py-12">
          <p>Category: {selectedCategory}</p>
          <p>Search Query: {searchQuery}</p>
          <p>Scrolled: {scrolled.toString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900 text-gray-100 pt-16">
        <BackgroundEffects />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastClassName="bg-gray-800 text-gray-100"
        />

        <AnimatePresence mode="wait">
          {currentView === "hero" ? (
            <HeroSection onStartShopping={() => setCurrentView("shop")} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ShopContent />
            </motion.div>
          )}
        </AnimatePresence>

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

        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        )}
        
        <CheckoutModal
          showCheckout={showCheckout}
          setShowCheckout={setShowCheckout}
          setCart={calculateTotal}
        />
      </div>
    </QueryClientProvider>
  );
};

export default OrderPage;