'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { type Product, type ProductVariant } from '@/types/product';

const categoryBorder: Record<Product['category'], string> = {
  'mental-health': '#7c3aed',
  'post-treatment': '#0d9488',
};

const categoryLabels: Record<Product['category'], string> = {
  'mental-health': 'MENTAL HEALTH RANGE',
  'post-treatment': 'POST TREATMENT SKINCARE RANGE',
};

function Stars({ rating = 5, count }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {count && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (variant: ProductVariant) => {
    addToCart(product, variant.quantity);
    const label = variant.quantity > 1 ? `${variant.quantity}× ${product.name}` : product.name;
    toast.success(`${label} added to cart`);
    setOpen(false);
  };

  const border = categoryBorder[product.category];

  return (
    <div className="group bg-[#f0faf5] rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-smooth flex flex-col">
      {/* Category colour top bar */}
      <div className="h-1.5" style={{ backgroundColor: border }} />

      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden block bg-white">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-5xl opacity-20">{product.category === 'mental-health' ? '🧠' : '✨'}</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 text-sm group-hover:text-[#1a3a8f] transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-0.5">
          {categoryLabels[product.category]}
        </p>

        {product.id === 'grief' && <Stars rating={5} />}

        <div className="mt-2 flex items-center gap-2">
          <p className="text-base font-bold text-[#22a855]">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && (
            <>
              <p className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
              <span className="text-[10px] font-bold text-white bg-[#7c3aed] px-1.5 py-0.5 rounded-full">
                INTRO
              </span>
            </>
          )}
        </div>

        {/* Quick-add — dropdown for multi-variant, direct add for single */}
        {product.variants.length > 1 ? (
          <div className="mt-3 relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="w-full py-2 rounded text-xs font-bold text-white tracking-wide hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
              style={{ backgroundColor: '#1a3a8f' }}
            >
              ADD TO BAG
              <svg className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute bottom-full mb-1.5 left-0 right-0 z-30 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                {product.variants.map((variant) => {
                  const savings = parseFloat((product.price * variant.quantity - variant.totalPrice).toFixed(2));
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleSelect(variant)}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#f0faf5] transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-700 leading-snug flex-1">{variant.label}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-xs font-bold text-[#22a855]">${variant.totalPrice.toFixed(2)}</span>
                          {savings > 0 && (
                            <span className="text-[10px] font-bold text-white bg-[#22a855] px-1.5 py-0.5 rounded-full">
                              Save ${savings.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <button
              onClick={() => handleSelect(product.variants[0])}
              className="w-full py-2 rounded text-xs font-bold text-white tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: '#1a3a8f' }}
            >
              ADD TO BAG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
