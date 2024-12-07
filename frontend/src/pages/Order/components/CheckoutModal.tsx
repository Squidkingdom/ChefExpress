import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

interface CheckoutModalProps {
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  setCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  showCheckout,
  setShowCheckout,
  setCart,
}) => (
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
            <X className="w-6 h-6" />
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
                setCart();
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
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);