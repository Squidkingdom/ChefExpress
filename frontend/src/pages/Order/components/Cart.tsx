/***************************************************************************************************
 * Name of code artifact: Cart.tsx
 * Brief description of what the code does:
 *   This file defines a Cart component and a CartItemComponent that work together to display and 
 *   manage a shopping cart UI. The Cart component shows a modal overlay with a list of cart items, 
 *   their quantities, total price, and actions to remove items, update quantities, or proceed 
 *   to checkout. The CartItemComponent is responsible for rendering each individual cart item, 
 *   displaying its name, price, and quantity controls.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Integrated animations (Framer Motion), improved styling, and 
 *   enhanced UX with hover/tap effects and a modal overlay.
 * Preconditions:
 *   - React environment is set up.
 *   - CartItem type must be defined elsewhere.
 *   - Functions for updating quantity, removing from cart, closing the cart, and checking out 
 *     must be provided.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `cart`: an array of CartItems, where each item contains id, name, price, img, and quantity.
 *   - `updateQuantity`: function that takes an item’s id and a new quantity number.
 *   - `removeFromCart`: function that takes an item’s id and removes it from the cart.
 *   - `calculateTotal`: function that calculates the total cost of the cart items.
 *   - `onClose` and `onCheckout`: callbacks to handle closing the cart modal and proceeding 
 *     to checkout, respectively.
 * Postconditions:
 *   - The cart modal is displayed over the current view.
 *   - Users can see and modify the cart content and either close or proceed with checkout.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - None known; errors would mainly be due to missing or incorrect props.
 * Side effects:
 *   - Clicking outside the modal closes it (triggering onClose).
 *   - Interactions with buttons update the cart state or close the modal.
 * Invariants:
 *   - The cart modal remains centered and scrollable if there are many items.
 * Any known faults:
 *   - If cart data changes unexpectedly, animations might appear abrupt.
 * Comments summarizing major blocks of code:
 *   - CartItemComponent: Renders individual item with increment, decrement, and remove actions.
 *   - Cart component: Renders a modal overlay, cart header, items list, and footer with total 
 *     and checkout button.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and Framer Motion for animations
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import icons from lucide-react for UI elements
import { Minus, Plus, Trash2, ChevronRight, X } from "lucide-react";
// Import CartItem type for type-checking
import type { CartItem } from "../types";

interface CartItemProps {
  item: CartItem;                          // Cart item data (name, img, price, quantity, etc.)
  updateQuantity: (id: number, quantity: number) => void; // Function to update item quantity
  removeFromCart: (id: number) => void;    // Function to remove item from cart
}

/**
 * CartItemComponent:
 * Represents a single cart item line within the cart. Allows incrementing/decrementing quantity 
 * and removing the item entirely.
 */
const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeFromCart,
}) => (
  <motion.div
    className="flex items-center gap-4 py-4 border-b border-gray-700/50" // Item container styling
    initial={{ opacity: 0, y: 20 }}   // Start invisible and slightly below
    animate={{ opacity: 1, y: 0 }}    // Animate to visible and aligned
    exit={{ opacity: 0, x: -20 }}     // On exit, fade out and slide left
  >
    {/* Product image */}
    <img
      src={item.img}
      alt={item.name}
      className="w-24 h-24 object-contain bg-white rounded-lg p-2"
    />
    <div className="flex-1 min-w-0">
      {/* Product name */}
      <h4 className="font-medium text-gray-200 truncate">{item.name}</h4>
      {/* Product price, converting string price to a float */}
      <p className="text-teal-400 font-semibold">
        ${parseFloat(item.price.replace('$', '')).toFixed(2)}
      </p>
    </div>
    <div className="flex items-center gap-3">
      {/* Decrease quantity button */}
      <motion.button
        whileHover={{ scale: 1.1 }}   // Slight scale on hover
        whileTap={{ scale: 0.9 }}     // Slight shrink on tap
        onClick={() => updateQuantity(item.id, item.quantity - 1)} // Decrement quantity
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      {/* Display current quantity */}
      <span className="text-gray-200 w-8 text-center font-medium">
        {item.quantity}
      </span>
      {/* Increase quantity button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => updateQuantity(item.id, item.quantity + 1)} // Increment quantity
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
      {/* Remove item from cart button */}
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
  onClose: () => void;                // Function to close the cart modal
  onCheckout: () => void;             // Function to proceed to checkout
  cart: CartItem[];                   // Array of cart items
  removeFromCart: (id: number) => void;   // Remove item from cart function
  updateQuantity: (id: number, quantity: number) => void; // Update item quantity function
  calculateTotal: () => number;       // Calculate total cost of cart items
}

/**
 * Cart component:
 * Renders a modal overlay containing the shopping cart items, total amount, and actions 
 * to close, remove items, adjust quantities, or proceed to checkout.
 */
export const Cart: React.FC<CartProps> = ({
  onClose,
  onCheckout,
  cart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
}) => {
  return (
    // Semi-transparent overlay
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50"
      onClick={onClose} // Clicking overlay closes cart
    >
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md rounded-2xl w-full max-w-2xl mt-24 mx-4
                  border border-gray-700/50 overflow-hidden" 
        initial={{ opacity: 0, y: -50 }}  // Start hidden above
        animate={{ opacity: 1, y: 0 }}     // Fade in and drop into position
        exit={{ opacity: 0, y: -50 }}      // Fade out and move up on exit
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside the box from closing
      >
        {/* Cart header with title and close button */}
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

        {/* If cart is empty, show a message, otherwise list items */}
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
            {/* Cart items container, scrollable if many items */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              {/* AnimatePresence for smooth removing/adding of items */}
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

            {/* Cart footer with total and checkout button */}
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


// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Minus, Plus, Trash2, ChevronRight, X } from "lucide-react";
// import type { CartItem } from "../types";

// interface CartItemProps {
//   item: CartItem;
//   updateQuantity: (id: number, quantity: number) => void;
//   removeFromCart: (id: number) => void;
// }

// const CartItemComponent: React.FC<CartItemProps> = ({
//   item,
//   updateQuantity,
//   removeFromCart,
// }) => (
//   <motion.div
//     className="flex items-center gap-4 py-4 border-b border-gray-700/50"
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//   >
//     <img
//       src={item.img}
//       alt={item.name}
//       className="w-24 h-24 object-contain bg-white rounded-lg p-2"
//     />
//     <div className="flex-1 min-w-0">
//       <h4 className="font-medium text-gray-200 truncate">{item.name}</h4>
//       <p className="text-teal-400 font-semibold">
//         ${parseFloat(item.price.replace('$', '')).toFixed(2)}
//       </p>
//     </div>
//     <div className="flex items-center gap-3">
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => updateQuantity(item.id, item.quantity - 1)}
//         className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
//       >
//         <Minus className="w-4 h-4" />
//       </motion.button>
//       <span className="text-gray-200 w-8 text-center font-medium">
//         {item.quantity}
//       </span>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => updateQuantity(item.id, item.quantity + 1)}
//         className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
//       >
//         <Plus className="w-4 h-4" />
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => removeFromCart(item.id)}
//         className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
//       >
//         <Trash2 className="w-4 h-4" />
//       </motion.button>
//     </div>
//   </motion.div>
// );

// interface CartProps {
//   onClose: () => void;
//   onCheckout: () => void;
//   cart: CartItem[];
//   removeFromCart: (id: number) => void;
//   updateQuantity: (id: number, quantity: number) => void;
//   calculateTotal: () => number;
// }

// export const Cart: React.FC<CartProps> = ({
//   onClose,
//   onCheckout,
//   cart,
//   removeFromCart,
//   updateQuantity,
//   calculateTotal,
// }) => {
//   return (
//     <div
//       className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50"
//       onClick={onClose}
//     >
//       <motion.div
//         className="bg-gray-900/90 backdrop-blur-md rounded-2xl w-full max-w-2xl mt-24 mx-4
//                   border border-gray-700/50 overflow-hidden"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
//           <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
//                       bg-clip-text text-transparent">
//             Shopping Cart
//           </h2>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={onClose}
//             className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400
//                      hover:text-gray-300 transition-colors duration-200"
//           >
//             <X className="w-5 h-5" />
//           </motion.button>
//         </div>

//         {cart.length === 0 ? (
//           <div className="p-8 text-center">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-gray-400 text-lg"
//             >
//               Your cart is empty
//             </motion.div>
//           </div>
//         ) : (
//           <>
//             <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
//               <AnimatePresence mode="wait">
//                 {cart.map((item) => (
//                   <CartItemComponent
//                     key={item.id}
//                     item={item}
//                     updateQuantity={updateQuantity}
//                     removeFromCart={removeFromCart}
//                   />
//                 ))}
//               </AnimatePresence>
//             </div>

//             <div className="p-6 border-t border-gray-700/50 bg-gray-800/50">
//               <div className="flex justify-between items-center mb-6">
//                 <span className="text-xl font-medium text-gray-300">Total</span>
//                 <span className="text-2xl font-bold text-teal-400">
//                   ${calculateTotal().toFixed(2)}
//                 </span>
//               </div>

//               <motion.button
//                 onClick={onCheckout}
//                 className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 
//                          py-4 rounded-xl font-medium hover:from-teal-400 hover:to-cyan-300 
//                          transition-all duration-300 flex items-center justify-center gap-2
//                          shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Proceed to Checkout
//                 <ChevronRight className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };
