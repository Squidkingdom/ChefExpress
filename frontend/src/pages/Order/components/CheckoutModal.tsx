/***************************************************************************************************
 * Name of code artifact: CheckoutModal.tsx
 * Brief description of what the code does:
 *   This component displays a checkout modal dialog that appears when a user proceeds to the 
 *   checkout phase of a shopping session. It provides the user with the option to complete their 
 *   purchase. On completion, it clears the cart, closes the modal, and shows a success message.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added animations, styling improvements, and integrated a toast message 
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

// Import React and motion libraries for UI and animation
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import icons for close button and arrow
import { X, ChevronRight } from "lucide-react";
// Import toast for success messages
import { toast } from "react-toastify";

// Define props for the CheckoutModal
interface CheckoutModalProps {
  showCheckout: boolean;         // Controls visibility of the modal
  setShowCheckout: (show: boolean) => void; // Callback to toggle modal visibility
  setCart: () => void;           // Function to clear the cart
}

/**
 * CheckoutModal component:
 * Displays a modal allowing the user to confirm their purchase. On confirmation:
 * - Clears the cart (via setCart)
 * - Closes the modal (via setShowCheckout)
 * - Shows a success toast message
 */
export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  showCheckout,
  setShowCheckout,
  setCart,
}) => {
  /**
   * handleCompletePurchase:
   * Called when the user clicks the "Complete Purchase" button.
   * Clears the cart, closes the modal, and shows a success toast.
   */
  const handleCompletePurchase = () => {
    setCart(); // Clear the cart contents
    setShowCheckout(false); // Close the modal
    toast.success("Order completed successfully! 🎉"); // Show success notification
  };

  return (
    // AnimatePresence for conditional rendering with exit animations
    <AnimatePresence>
      {showCheckout && (
        // Dark overlay covering the entire screen
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}      // Start transparent
          animate={{ opacity: 1 }}       // Fade in
          exit={{ opacity: 0 }}          // Fade out on close
          onClick={() => setShowCheckout(false)} // Clicking the overlay closes the modal
        >
          {/* The actual modal container */}
          <motion.div
            className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 max-w-xl w-full relative
            border border-gray-700/50"
            initial={{ scale: 0.9, opacity: 0, y: 20 }} // Start slightly scaled down and below
            animate={{ scale: 1, opacity: 1, y: 0 }}     // Animate to full size and aligned
            exit={{ scale: 0.9, opacity: 0, y: 20 }}     // Scale down and fade out on close
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Close button at top-right corner */}
            <motion.button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              onClick={() => setShowCheckout(false)}
              whileHover={{ scale: 1.1 }} // Slight enlarge on hover
              whileTap={{ scale: 0.9 }}    // Slight shrink on tap
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Modal content */}
            <div className="text-center">
              {/* Heading with gradient text */}
              <h2
                className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                             bg-clip-text text-transparent mb-6"
              >
                Complete Your Purchase
              </h2>
              {/* Informational text */}
              <p className="text-gray-300 mb-8 text-lg">
                Thank you for shopping with us! This is a demo checkout process.
              </p>
              {/* Complete Purchase button */}
              <motion.button
                onClick={handleCompletePurchase}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
                         py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
                         transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }} // Slight enlarge on hover
                whileTap={{ scale: 0.98 }}    // Slight shrink on tap
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


// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, ChevronRight } from "lucide-react";
// import { toast } from "react-toastify";

// interface CheckoutModalProps {
//   showCheckout: boolean;
//   setShowCheckout: (show: boolean) => void;
//   setCart: () => void;
// }

// export const CheckoutModal: React.FC<CheckoutModalProps> = ({
//   showCheckout,
//   setShowCheckout,
//   setCart,
// }) => {
//   const handleCompletePurchase = () => {
//     setCart(); // Clear the cart
//     setShowCheckout(false); // Close the modal
//     toast.success("Order completed successfully! 🎉");
//   };

//   return (
//     <AnimatePresence>
//       {showCheckout && (
//         <motion.div
//           className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={() => setShowCheckout(false)}
//         >
//           <motion.div
//             className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 max-w-xl w-full relative
//             border border-gray-700/50"
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <motion.button
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
//               onClick={() => setShowCheckout(false)}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <X className="w-6 h-6" />
//             </motion.button>
//             <div className="text-center">
//               <h2
//                 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
//                              bg-clip-text text-transparent mb-6"
//               >
//                 Complete Your Purchase
//               </h2>
//               <p className="text-gray-300 mb-8 text-lg">
//                 Thank you for shopping with us! This is a demo checkout process.
//               </p>
//               <motion.button
//                 onClick={handleCompletePurchase}
//                 className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
//                          py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
//                          transition-all duration-300 flex items-center justify-center gap-2"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Complete Purchase
//                 <ChevronRight className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
