'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useCart, getLineTotal, getLineSavings, getPostTreatmentBundleDiscount } from '@/contexts/CartContext';

export default function CartContent() {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any products yet.</p>
        <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const isFreeShipping = cartTotal >= 99;
  const shipping = isFreeShipping ? 0 : 9.95;
  const total = parseFloat((cartTotal + shipping).toFixed(2));

  // Savings breakdown
  const fullTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemSubtotal = items.reduce((sum, i) => sum + getLineTotal(i.product, i.quantity), 0);
  const mhSavings = parseFloat((fullTotal - itemSubtotal).toFixed(2));
  const bundleDiscount = getPostTreatmentBundleDiscount(items);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => {
          const lineTotal = getLineTotal(item.product, item.quantity);
          const savings = getLineSavings(item.product, item.quantity);
          const atMax = item.product.maxQuantity != null && item.quantity >= item.product.maxQuantity;

          return (
            <div key={item.product.id} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex gap-4">
                {/* Product image */}
                <Link href={`/products/${item.product.slug}`} className="relative w-20 h-20 rounded-md flex-shrink-0 overflow-hidden bg-[#f0faf5]">
                  {item.product.image ? (
                    <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1.5" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-30">
                      {item.product.category === 'mental-health' ? '🧠' : '✨'}
                    </span>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.product.size}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-[#22a855]">
                      ${lineTotal.toFixed(2)}
                    </span>
                    {savings > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white bg-[#22a855] px-1.5 py-0.5 rounded-full">
                          <Tag className="h-2.5 w-2.5" />Save ${savings.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={atMax}
                      className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="font-semibold text-foreground">${lineTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Bundle info */}
              {savings > 0 && (
                <p className="mt-2 text-xs text-[#22a855] bg-green-50 rounded px-3 py-1.5">
                  Bundle savings applied — you&apos;re saving ${savings.toFixed(2)} on this item
                </p>
              )}
              {atMax && (
                <p className="mt-2 text-xs text-muted-foreground bg-muted rounded px-3 py-1.5">
                  Maximum of {item.product.maxQuantity} per order
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-lg p-6 sticky top-[140px]">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">${itemSubtotal.toFixed(2)}</span>
            </div>
            {mhSavings > 0 && (
              <div className="flex justify-between text-[#22a855]">
                <span className="flex items-center gap-1"><Tag className="h-3 w-3" />Bundle savings</span>
                <span className="font-semibold">-${mhSavings.toFixed(2)}</span>
              </div>
            )}
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-[#22a855]">
                <span className="flex items-center gap-1"><Tag className="h-3 w-3" />Post Treatment Bundle (15% off)</span>
                <span className="font-semibold">-${bundleDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {isFreeShipping ? <span className="text-[#22a855]">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {!isFreeShipping && (
              <p className="text-xs text-muted-foreground">
                Add ${(99 - cartTotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" className="mt-6 w-full inline-flex items-center justify-center h-11 px-6 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1a3a8f' }}>
            Proceed to Checkout
          </Link>
          <Link href="/products" className="mt-3 w-full inline-flex items-center justify-center h-10 px-6 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
