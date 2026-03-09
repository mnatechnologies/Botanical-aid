'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { type Product, type ProductVariant } from '@/types/product';

const categoryLabels: Record<Product['category'], string> = {
  'mental-health': 'Mental Health Range',
  'post-treatment': 'Post Treatment Skincare',
};

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

          {/* Ingredients */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-3">How to Use</h3>
            <p className="text-muted-foreground leading-relaxed">{product.usage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
