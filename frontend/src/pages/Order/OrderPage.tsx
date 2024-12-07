import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";

import { BackgroundEffects } from "./components/BackgroundEffects";
import { HeroSection } from "./components/HeroSection";
import { SearchBar } from "./components/SearchBar";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { useStore } from "./store/useStore";
import { SAMPLE_PRODUCTS } from "./data/products";
import type { Product } from "./types";

const CATEGORIES = ["All", "Tools", "Utensils", "Cookware", "Appliances"];

const OrderPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"hero" | "shop">("hero");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  const filteredProducts = useMemo(
    () =>
      SAMPLE_PRODUCTS.filter(
        (product) =>
          (!selectedCategory || product.category === selectedCategory) &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [selectedCategory, searchQuery]
  );

  const ShopContent = () => (
    <div className="max-w-8xl mx-auto pt-16">
      <div 
        className={`sticky top-16 z-20 transition-all duration-500 ease-in-out ${
          scrolled ? "bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-gray-900/20 border-b border-gray-700/20" 
                  : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="space-y-6 px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <motion.button
              className="relative p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 
                       transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="w-6 h-6 text-gray-300" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-gray-900 
                               w-5 h-5 rounded-full text-xs font-bold flex items-center 
                               justify-center">
                  {totalCartItems}
                </span>
              )}
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === "All" ? null : category)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 
                  ${
                    (category === "All" && selectedCategory === null) ||
                    category === selectedCategory
                      ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={handleAddToCart}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <BackgroundEffects />

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
          />
        )}
      </AnimatePresence>

      <ProductDetailsModal
        product={selectedProduct}
        addToCart={handleAddToCart}
        setSelectedProduct={setSelectedProduct}
      />
      
      <CheckoutModal
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        setCart={useStore((state) => state.clearCart)}
      />
    </div>
  );
};

export default OrderPage;