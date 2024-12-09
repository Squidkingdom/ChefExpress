/***************************************************************************************************
 * Name of code artifact: useStore.ts
 * Brief description of what the code does:
 *   This file uses Zustand, a small state management library for React, to create a global 
 *   store for managing the cart. It stores cart items, allows adding/removing items, updating 
 *   their quantities, clearing the cart, and calculating the total cost. Toast notifications 
 *   from react-toastify are displayed on certain actions for user feedback.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added toast notifications, improved data mutation logic, and ensured
 *   the total cost calculation returns a number.
 * Preconditions:
 *   - Zustand and react-toastify should be installed and configured.
 *   - Product and CartItem types must be defined properly.
 * Acceptable and unacceptable input values or types:
 *   - Product must have an id, name, price (string formatted as "$X.YY"), img, URL, etc.
 *   - CartItem extends Product with an added quantity field.
 *   - Functions must be called with valid product objects or item IDs.
 * Unacceptable inputs:
 *   - Negative quantity updates are invalid and handled by removing the item.
 * Postconditions:
 *   - Global cart state is updated accordingly on each operation.
 * Return values or types:
 *   - `calculateTotal` returns a number representing the total cost.
 * Error and exception condition values or types:
 *   - If product price cannot be parsed, it returns NaN, but the code expects well-formed price strings.
 * Side effects:
 *   - Toast notifications shown on add, remove, and clear cart actions.
 * Invariants:
 *   - The cart remains an array of CartItems.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - addToCart: Adds a product to the cart or increments its quantity if it exists.
 *   - removeFromCart: Removes the cart item matching the given ID.
 *   - updateQuantity: Updates the item's quantity or removes it if quantity < 1.
 *   - clearCart: Empties the cart array.
 *   - calculateTotal: Iterates through cart items to sum up their total price.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/store/useStore.ts

import { create } from 'zustand';            // Zustand state management
import { Product, CartItem } from '../types'; // Import product and cart item types
import { toast } from 'react-toastify';      // For showing toast notifications

// Interface defining the shape of store state and actions
interface StoreState {
  cart: CartItem[];                         // Current array of cart items
  addToCart: (product: Product) => void;    // Add a product or increment its quantity in cart
  removeFromCart: (id: number) => void;     // Remove an item from the cart by ID
  updateQuantity: (id: number, quantity: number) => void; // Update item quantity by ID
  clearCart: () => void;                    // Remove all items from the cart
  calculateTotal: () => number;             // Calculate total cart cost
}

// Create a Zustand store with initial state and actions
export const useStore = create<StoreState>((set, get) => ({
  // Initial empty cart
  cart: [],

  /**
   * addToCart:
   * If the product exists in the cart, increment its quantity.
   * Otherwise, add a new entry with quantity = 1.
   * Shows a success toast for feedback.
   */
  addToCart: (product: Product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success(`Updated ${product.name} quantity in cart`);
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      toast.success(`Added ${product.name} to cart`);
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },

  /**
   * removeFromCart:
   * Removes an item from the cart by its ID.
   * Shows a toast notifying removal if item existed.
   */
  removeFromCart: (id: number) => {
    const item = get().cart.find((item) => item.id === id);
    if (item) {
      toast.info(`Removed ${item.name} from cart`);
    }
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  /**
   * updateQuantity:
   * Updates the quantity of a specific cart item.
   * If quantity < 1, item is removed.
   */
  updateQuantity: (id: number, quantity: number) => {
    if (quantity < 1) {
      get().removeFromCart(id);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },

  /**
   * clearCart:
   * Clears all items from the cart.
   * Shows a success toast for user feedback.
   */
  clearCart: () => {
    toast.success('Cart cleared');
    set({ cart: [] });
  },

  /**
   * calculateTotal:
   * Sums the cost of each cart item (price * quantity).
   * Parses the price string, removes the '$' sign, and converts to a number.
   */
  calculateTotal: () => {
    const state = get();
    const total = state.cart.reduce((sum, item) => {
      const priceNumber = parseFloat(item.price.replace('$', ''));
      return sum + priceNumber * item.quantity;
    }, 0);
    return total; // return as a number
  },
}));


// // src/store/useStore.ts
// import { create } from 'zustand';
// import { Product, CartItem } from '../types';
// import { toast } from 'react-toastify';

// interface StoreState {
//   cart: CartItem[];
//   addToCart: (product: Product) => void;
//   removeFromCart: (id: number) => void;
//   updateQuantity: (id: number, quantity: number) => void;
//   clearCart: () => void;
//   calculateTotal: () => number; // Return a number now
// }

// export const useStore = create<StoreState>((set, get) => ({
//   cart: [],

//   addToCart: (product: Product) => {
//     set((state) => {
//       const existingItem = state.cart.find((item) => item.id === product.id);
//       if (existingItem) {
//         toast.success(`Updated ${product.name} quantity in cart`);
//         return {
//           cart: state.cart.map((item) =>
//             item.id === product.id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           ),
//         };
//       }
//       toast.success(`Added ${product.name} to cart`);
//       return { cart: [...state.cart, { ...product, quantity: 1 }] };
//     });
//   },

//   removeFromCart: (id: number) => {
//     const item = get().cart.find((item) => item.id === id);
//     if (item) {
//       toast.info(`Removed ${item.name} from cart`);
//     }
//     set((state) => ({
//       cart: state.cart.filter((item) => item.id !== id),
//     }));
//   },

//   updateQuantity: (id: number, quantity: number) => {
//     if (quantity < 1) {
//       get().removeFromCart(id);
//       return;
//     }
//     set((state) => ({
//       cart: state.cart.map((item) =>
//         item.id === id ? { ...item, quantity } : item
//       ),
//     }));
//   },

//   clearCart: () => {
//     toast.success('Cart cleared');
//     set({ cart: [] });
//   },

//   calculateTotal: () => {
//     const state = get();
//     const total = state.cart.reduce((sum, item) => {
//       const priceNumber = parseFloat(item.price.replace('$', ''));
//       return sum + priceNumber * item.quantity;
//     }, 0);
//     return total; // return as a number
//   },
// }));
