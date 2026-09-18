'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { products, POST_TREATMENT_BUNDLE } from '@/data/products';

const bundleProducts = POST_TREATMENT_BUNDLE.productIds.map(
  (id) => products.find((p) => p.id === id)!
);
const rrp = bundleProducts.reduce((sum, p) => sum + p.price, 0);
const bundlePrice = parseFloat((rrp * (1 - POST_TREATMENT_BUNDLE.discountPercent / 100)).toFixed(2));
const savings = parseFloat((rrp - bundlePrice).toFixed(2));

export default function PostTreatmentBundleBanner() {
  const { addToCart } = useCart();

  const handleAddBundle = () => {
    for (const product of bundleProducts) {
      addToCart(product, 1);
    }
    toast.success('Post Treatment Bundle added to cart');
  };

  return (
    <div className="rounded-xl border-2 border-[#0d9488]/30 bg-gradient-to-r from-[#f0fdfa] to-[#f0faf5] p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        {/* Header */}
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white bg-[#0d9488] px-3 py-1 rounded-full mb-3">
          Bundle &amp; Save
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
          Post Treatment Complete Care Bundle
        </h3>
        <p className="text-sm text-gray-500 mb-5 max-w-md">
          Get all 3 post-treatment essentials together and save {POST_TREATMENT_BUNDLE.discountPercent}%
        </p>

        {/* Product thumbnails */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5">
          {bundleProducts.map((product, i) => (
            <div key={product.id} className="flex items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white border border-gray-100 overflow-hidden shadow-sm">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600 mt-1.5 font-medium text-center leading-tight max-w-[80px]">
                  {product.name}
                </span>
                <span className="text-[10px] text-gray-400">${product.price.toFixed(2)}</span>
              </div>
              {i < bundleProducts.length - 1 && (
                <span className="text-gray-300 text-lg font-light">+</span>
              )}
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-400 line-through">${rrp.toFixed(2)}</span>
          <span className="text-2xl font-bold text-[#22a855]">${bundlePrice.toFixed(2)}</span>
          <span className="text-xs font-bold text-white bg-[#22a855] px-2 py-0.5 rounded-full">
            Save ${savings.toFixed(2)}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleAddBundle}
          className="px-8 py-3 rounded text-sm font-bold text-white tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
          style={{ backgroundColor: '#1a3a8f' }}
        >
          ADD BUNDLE TO CART
        </button>
      </div>
    </div>
  );
}
