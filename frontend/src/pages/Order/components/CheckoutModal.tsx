/***************************************************************************************************
 * Name of code artifact: CheckoutModal.tsx
 * Brief description of what the code does:
 *   This component displays a checkout modal dialog that appears when a user proceeds to the 
 *   checkout phase of a shopping session. It provides the user with the option to complete their 
 *   purchase. On completion, it clears the cart, closes the modal, and shows a success message.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/3/24
 * Dates the code was revised: 11/22/24
 * Brief description of each revision & author:
 *   11/22/24 - Brady Holland: Added animations, styling improvements, and integrated a toast message 
 *   upon successful checkout.
 * Preconditions:
 *   - The parent component must control the `showCheckout` state and provide a `setShowCheckout` 
 *     callback.
 *   - The parent must also provide `setCart` to clear the cart contents.
 * Acceptable and unacceptable input values or types:
 *   - `showCheckout`: boolean (true to show modal, false to hide).
 *   - `setShowCheckout`: function to toggle the modal visibility.
 *   - `setCart`: function to clear the cart.
 *   - All must be valid and provided, or the component will not function as intended.
 * Postconditions:
 *   - If the user clicks "Complete Purchase," the cart is cleared, the modal closes, and a success 
 *     toast appears.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element) that conditionally renders the checkout modal.
 * Error and exception condition values or types:
 *   - None known; if the backend or cart state management fails, the modal just closes without action.
 * Side effects:
 *   - Clears the cart and shows a toast notification on successful completion.
 * Invariants:
 *   - The modal layout and behavior remain consistent.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - AnimatePresence and Framer Motion for showing/hiding modal with animations.
 *   - `handleCompletePurchase` triggers cart clearing and shows a success toast.
 * Comments on every line are provided below.
 ***************************************************************************************************/


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
}) => {
  const handleCompletePurchase = () => {
    setCart(); // Clear the cart
    setShowCheckout(false); // Close the modal
    toast.success("Order completed successfully! 🎉");
  };

  return (
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
              <h2
                className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                             bg-clip-text text-transparent mb-6"
              >
                Complete Your Purchase
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Thank you for shopping with us! This is a demo checkout process.
              </p>
              <motion.button
                onClick={handleCompletePurchase}
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
};
