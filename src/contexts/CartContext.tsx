'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type Product } from '@/types/product';
import { POST_TREATMENT_BUNDLE } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Line total for a single cart row.
 *   – MH products: look up the variant whose quantity matches (bundle pricing).
 *   – Post-treatment: simple qty × base price (bundle discount applied separately).
 */
export function getLineTotal(product: Product, quantity: number): number {
  if (product.maxQuantity) {
    const cappedQty = Math.min(quantity, product.maxQuantity);
    const variant = product.variants.find((v) => v.quantity === cappedQty);
    return variant ? variant.totalPrice : product.price * cappedQty;
  }
  return parseFloat((product.price * quantity).toFixed(2));
}

/** Dollar savings for a single cart row (MH bundle savings). */
export function getLineSavings(product: Product, quantity: number): number {
  const fullPrice = product.price * quantity;
  const actual = getLineTotal(product, quantity);
  return parseFloat((fullPrice - actual).toFixed(2));
}

/**
 * Post-treatment bundle: 15 % off the post-treatment subtotal when all three
 * post-treatment products are present in the cart.
 */
export function getPostTreatmentBundleDiscount(items: CartItem[]): number {
  const bundleIds: readonly string[] = POST_TREATMENT_BUNDLE.productIds;
  const hasAll = bundleIds.every((id) => items.some((item) => item.product.id === id));
  if (!hasAll) return 0;

  const bundleSubtotal = items
    .filter((item) => bundleIds.includes(item.product.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return parseFloat((bundleSubtotal * POST_TREATMENT_BUNDLE.discountPercent / 100).toFixed(2));
}

interface CartContextType {
  items: CartItem[];
  isLoaded: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('botanical-aid-cart');
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('botanical-aid-cart', JSON.stringify(items));
  }, [items, isLoaded]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const maxQty = product.maxQuantity ?? Infinity;
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxQty) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, maxQty) }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const maxQty = i.product.maxQuantity ?? Infinity;
        return { ...i, quantity: Math.min(quantity, maxQty) };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getCartCount = useCallback(() =>
    items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const getCartTotal = useCallback(() => {
    const itemTotal = items.reduce((sum, i) => sum + getLineTotal(i.product, i.quantity), 0);
    const bundleDiscount = getPostTreatmentBundleDiscount(items);
    return parseFloat((itemTotal - bundleDiscount).toFixed(2));
  }, [items]);

  return (
    <CartContext.Provider value={{ items, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
