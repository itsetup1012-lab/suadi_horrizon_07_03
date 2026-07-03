// Description: Cart management functions
// Endpoint: N/A (Local storage based)
// Request: N/A
// Response: N/A

// Mock localStorage for SSR
const localStorageMock = {
  getItem: () => null,
  setItem: () => { },
  removeItem: () => { },
  clear: () => { },
};

const safeLocalStorage = typeof window !== 'undefined' ? window.localStorage : localStorageMock;

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  type: 'product' | 'machinery';
}

import { toast } from 'sonner';

// Cart event emitter for cross-component updates
const CART_STORAGE_KEY = 'saudi_horizon_cart';

export const emitCartChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'));
  }
};

export const getCart = (): CartItem[] => {
  try {
    const cart = safeLocalStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const addToCart = (item: CartItem): boolean => {
  try {
    const cart = getCart();
    const existingItem = cart.find((i) => i._id === item._id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    safeLocalStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    emitCartChange();
    return true;
  } catch {
    // Ignore storage errors
    return false;
  }
};

export const removeFromCart = (itemId: string): void => {
  try {
    const cart = getCart();
    const filtered = cart.filter((i) => i._id !== itemId);
    safeLocalStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
    emitCartChange();
  } catch {
    // Ignore storage errors
  }
};

export const updateCartItem = (itemId: string, quantity: number): void => {
  try {
    const cart = getCart();
    const item = cart.find((i) => i._id === itemId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeFromCart(itemId);
      } else {
        safeLocalStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        emitCartChange();
      }
    }
  } catch {
    // Ignore storage errors
  }
};

export const clearCart = (): void => {
  try {
    safeLocalStorage.removeItem(CART_STORAGE_KEY);
    emitCartChange();
  } catch {
    // Ignore storage errors
  }
};