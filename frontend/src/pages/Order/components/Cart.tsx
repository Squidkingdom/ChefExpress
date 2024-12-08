import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ChevronRight, X } from "lucide-react";
import { toast } from "react-toastify";
import type { CartItem } from "../types";

interface CartItemProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeFromCart,
}) => (
  <motion.div
    className="flex items-center gap-4 py-4 border-b border-gray-700/50"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <img
      src={item.img}
      alt={item.name}
      className="w-24 h-24 object-contain bg-white rounded-lg p-2"
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-200 truncate">{item.name}</h4>
      <p className="text-teal-400 font-semibold">
        ${parseFloat(item.price.replace('$', '')).toFixed(2)}
      </p>
    </div>
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      <span className="text-gray-200 w-8 text-center font-medium">
        {item.quantity}
      </span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => removeFromCart(item.id)}
        className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  calculateTotal: () => number;
}

export const Cart: React.FC<CartProps> = ({
  onClose,
  onCheckout,
  cart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md rounded-2xl w-full max-w-2xl mt-24 mx-4
                  border border-gray-700/50 overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                      bg-clip-text text-transparent">
            Shopping Cart
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400
                     hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {cart.length === 0 ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-lg"
            >
              Your cart is empty
            </motion.div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="wait">
                {cart.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700/50 bg-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-medium text-gray-300">Total</span>
                <span className="text-2xl font-bold text-teal-400">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              <motion.button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                         py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                         transition-all duration-300 flex items-center justify-center gap-2
                         shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};