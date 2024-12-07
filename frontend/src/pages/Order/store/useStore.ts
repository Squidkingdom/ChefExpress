import { create } from 'zustand';
import { Product, CartItem } from '../types';
import { toast } from 'react-toastify';

interface StoreState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useStore = create<StoreState>()((set, get) => ({
  cart: [],
  
  addToCart: (product) => {
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

  removeFromCart: (id) => {
    const item = get().cart.find(item => item.id === id);
    if (item) {
      toast.info(`Removed ${item.name} from cart`);
    }
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
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

  clearCart: () => {
    toast.success('Cart cleared');
    set({ cart: [] });
  },

  calculateTotal: () => {
    const state = get();
    return state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));