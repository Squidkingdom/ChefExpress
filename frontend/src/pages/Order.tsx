// src/pages/Order.tsx

import React, { useState, ChangeEvent } from "react";
import { FaShoppingCart, FaSearch, FaTrashAlt, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Shop, CartItem, Product } from "../components/Shop";

/**
 * Interface definitions for Product and CartItem
 */


/**
 * Order Page
 * Enhanced with framer-motion animations and updated to work with the guided tour.
 * @returns {React.JSX.Element} - Order Page with advanced features and modern design.
 */
const Order: React.FC = () => {
  // Sample product data
  const [products] = useState<Product[]>([
    {
      name: "Dawn Multi-Purpose Reusable Wipes, 6 Pack",
      price: "$11.00",
      URL: "https://www.amazon.com/Dawn-Multi-Purpose-Reusable-Wipes-Pack/dp/B081FJZ7HJ?ref_=ast_sto_dp",
      quantity: 1,
      category: "Health & Household",
      id: 7,
      img: "https://m.media-amazon.com/images/I/41G66bY0xzL._SY300_SX300_QL70_FMwebp_.jpg"
  },
  {
      "name": "McCormick Basil Leaves, 1.25 oz",
      "price": "$5.62",
      "URL": "https://www.amazon.com/McCormick-Basil-Leaves-1-25-oz/dp/B0CX7NJPXJ?ref_=ast_sto_dp",
      "quantity": "1",
      "category": "Grocery & Gourmet Food",
      "id": 42,
      "img": "https://m.media-amazon.com/images/I/41WUAlFI01L._SX300_SY300_QL70_FMwebp_.jpg"
  },
    // Add more products as needed
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  const categories = ["All", "Tools", "Utensils", "Cookware"];

  // Add a product to the cart
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

  // Remove a product from the cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
    toast.info("Item removed from cart.");
  };

  // Update product quantity in cart
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

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtered products based on search query and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total price
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="order-page min-h-screen bg-gray-900 text-gray-100">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <header
        className="text-center py-24 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/order-hero.jpg')",
        }}
        id="order-hero" // **Important:** Added ID for Guided Tour targeting
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold py-5 text-teal-400">
            Order Your Favorite Kitchen Tools!
          </h1>
          <p className="text-xl text-gray-200">
            Browse our selection of essential kitchen items.
          </p>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 py-10">
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
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Buttons */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
                  selectedCategory === category
                    ? "bg-teal-500 text-gray-900"
                    : "bg-gray-700 text-gray-200 hover:bg-teal-600"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product List */}
          <Shop 
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          setSelectedProduct={setSelectedProduct}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory} />

          {/* Cart Summary */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-20">
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
                          />
                          <p className="text-lg font-medium text-gray-100">
                            {item.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-16 bg-gray-700 text-gray-100 border border-gray-600 rounded-md text-center mr-2"
                          />
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-400"
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
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-2xl"
              aria-label="Close product details"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col md:flex-row">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full md:w-1/2 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
              />
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-teal-400 mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-300 mb-4">
                  {selectedProduct.description}
                </p>
                <p className="text-2xl font-semibold text-teal-500 mb-6">
                  ${selectedProduct.price.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="bg-teal-500 text-gray-900 px-6 py-3 rounded-full hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl w-full relative">
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
              onClick={() => {
                setCart([]);
                setShowCheckout(false);
                toast.success("Purchase completed successfully!");
              }}
              className="w-full bg-teal-500 text-gray-900 py-3 rounded-full font-semibold hover:bg-teal-400 transition duration-200"
            >
              Complete Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
