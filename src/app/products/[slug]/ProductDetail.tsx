'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Truck, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { type Product, type ProductVariant } from '@/types/product';

const categoryLabels: Record<Product['category'], string> = {
  'mental-health': 'Mental Health Range',
  'post-treatment': 'Post Treatment Skincare',
};

/* ── Accordion section component ───────────────────────────────── */
function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
      >
        <span className="text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-[#1a3a8f] transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[5000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant.quantity);
    const label = selectedVariant.quantity > 1
      ? `${selectedVariant.quantity}× ${product.name}`
      : product.name;
    toast.success(`${label} added to cart`);
  };

  return (
    <div>
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="aspect-square rounded-xl overflow-hidden flex items-center justify-center bg-[#f0faf5] relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              className="object-contain p-8"
            />
          ) : (
            <span className="text-8xl opacity-30">
              {product.category === 'mental-health' ? '🧠' : '✨'}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
            {categoryLabels[product.category]}
          </span>
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {product.longDescription}
          </p>

          {/* Price display */}
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold text-[#22a855]">
              ${selectedVariant.totalPrice.toFixed(2)}
            </span>
            {selectedVariant.quantity > 1 && (
              <span className="text-sm text-muted-foreground">
                (${selectedVariant.unitPrice.toFixed(2)} each)
              </span>
            )}
            {product.originalPrice && selectedVariant.id === 'single' && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-white bg-[#7c3aed] px-2 py-0.5 rounded-full">
                  INTRO OFFER
                </span>
              </>
            )}
            <span className="text-sm text-muted-foreground">{product.size}</span>
          </div>

          {/* Variant selector — only shown when there are bundle options */}
          {product.variants.length > 1 ? (
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              {/* One-time purchase row */}
              <label
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  selectedVariant.id === 'single' ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  value="single"
                  checked={selectedVariant.id === 'single'}
                  onChange={() => setSelectedVariant(product.variants[0])}
                  className="accent-[#1a3a8f] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-800">
                  One-time purchase
                </span>
                <span className="ml-auto text-sm font-semibold text-[#22a855]">
                  ${product.variants[0].totalPrice.toFixed(2)}
                </span>
              </label>

              {/* Divider + bundle heading */}
              <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Bundle options
                </span>
              </div>

              {/* Bundle variants */}
              {product.variants.slice(1).map((variant) => {
                const savings = parseFloat((product.price * variant.quantity - variant.totalPrice).toFixed(2));
                return (
                  <label
                    key={variant.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-t border-gray-100 ${
                      selectedVariant.id === variant.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      checked={selectedVariant.id === variant.id}
                      onChange={() => setSelectedVariant(variant)}
                      className="accent-[#1a3a8f] w-4 h-4"
                    />
                    <span className="text-sm text-gray-800 flex-1">
                      {variant.label}
                    </span>
                    <span className="text-sm font-semibold text-[#22a855]">
                      ${variant.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-white bg-[#22a855] px-2 py-0.5 rounded-full">
                      Save ${savings.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <span className="text-sm text-muted-foreground">Per unit</span>
            </div>
          )}

          {/* Free shipping note */}
          <div className="flex items-center gap-2 mt-3 text-[#22a855] text-sm font-medium">
            <Truck className="h-4 w-4" />
            FREE Shipping for orders over $99
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer text-base"
            style={{ backgroundColor: '#1a3a8f' }}
          >
            <ShoppingCart className="h-5 w-5" />
            {selectedVariant.quantity > 1
              ? `Add ${selectedVariant.quantity} to Cart — $${selectedVariant.totalPrice.toFixed(2)}`
              : `Add to Cart — $${selectedVariant.totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* ── Accordion Sections ─────────────────────────────────── */}
      <div className="mt-12 max-w-3xl">
        {/* How to Use */}
        <Accordion title="How to Use This Product">
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.usage}
          </div>
        </Accordion>

        {/* Ingredients */}
        <Accordion title="Ingredients" defaultOpen>
          <div className="space-y-6">
            {product.ingredients.map((ing) => (
              <div key={ing.name} className="flex gap-4">
                {ing.image && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={ing.image}
                      alt={ing.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong className="text-foreground">{ing.name}</strong>
                    {ing.description ? `, ${ing.description.charAt(0).toLowerCase()}${ing.description.slice(1)}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Accordion>

        {/* Warning */}
        {product.warning && product.warning.length > 0 && (
          <Accordion title="Warning">
            <ul className="space-y-1.5">
              {product.warning.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-gray-400 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        {/* Health and Safety Disclaimer */}
        {product.disclaimer && product.disclaimer.length > 0 && (
          <Accordion title="Health and Safety Disclaimer">
            <div className="space-y-3">
              {product.disclaimer.map((item, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </Accordion>
        )}

        {/* Bottom border */}
        <div className="border-t border-gray-200" />
      </div>
    </div>
  );
}
