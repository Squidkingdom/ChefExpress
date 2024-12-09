import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { useDebounce } from 'use-debounce';
import "react-toastify/dist/ReactToastify.css";

import { HeroSection } from "./components/HeroSection";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import type { Product } from "./types";

const queryClient = new QueryClient();

const CATEGORIES = ["All", "Health & Household", "Grocery & Gourmet Food"];

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scrolled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  scrolled,
}) => {
  const [localQuery, setLocalQuery] = React.useState(searchQuery);
  const [debouncedValue] = useDebounce(localQuery, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="w-96 relative">
      <div 
        className={`absolute inset-0 rounded-lg backdrop-blur-lg transition-all duration-500 ease-in-out
          ${scrolled 
            ? "bg-gray-900/80 shadow-lg shadow-gray-900/20 border border-gray-700/20" 
            : "bg-gray-800/50 border border-gray-700/50"}
        `}
      />
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search for kitchen tools..."
          className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-gray-700/50 rounded-lg
                   text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/50
                   focus:border-transparent transition-all duration-300 text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
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

export const OrderPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"hero" | "shop">("hero");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ShopContent = () => (
    <div className="max-w-7xl mx-auto">
      <div
        className={`sticky top-0 z-30 backdrop-blur-lg py-4 border-b border-gray-800 px-4 
          transition-colors duration-300 ${
            scrolled ? 'bg-gray-900/80' : 'bg-transparent'
          }`}
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Professional Kitchen Shop
            </h1>
          </div>

          <div className="flex justify-between items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-xl opacity-50" />
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                scrolled={scrolled}
              />
            </div>
            <div className="flex gap-2">
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
        </div>
      </div>

      <div className="p-4">
        <ProductGrid
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen font-sans overflow-x-hidden relative">
        {/* Background gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),transparent_60%)]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
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
                className="mt-24"
              >
                <ShopContent />
              </motion.div>
            )}
          </AnimatePresence>

          {selectedProduct && (
            <ProductDetailsModal
              product={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default OrderPage;