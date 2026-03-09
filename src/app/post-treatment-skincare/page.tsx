import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsByCategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import PostTreatmentBundleBanner from '@/components/PostTreatmentBundleBanner';

export const metadata: Metadata = {
  title: 'Post Treatment Skincare',
  description:
    'Explore Botanical Aid\'s Post Treatment Skincare range — natural creams and balms for post-cosmetic, post-surgery, and lip filler recovery.',
};

/* ── Product sub-category circles ── */
const postTreatmentCircles = [
  { name: 'Post Cosmetic\nCream', image: '/circle/assets/circle-post-cosmetic.png', ring: '#b8c94e', slug: 'post-cosmetic-cream' },
  { name: 'Post Lip Filler\nBalm', image: '/circle/assets/circle-post-lip-filler.png', ring: '#e8a4c8', slug: 'post-lip-filler-balm' },
  { name: 'Post Surgery\nCare Cream', image: '/circle/assets/circle-post-surgery.png', ring: '#a4d4e8', slug: 'post-surgery-care-cream' },
];

export default function PostTreatmentSkincarePage() {
  const products = getProductsByCategory('post-treatment');

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: '520px' }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-post-treatment.avif"
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
            }}
          />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="max-w-xl">
              <span
                className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-6"
                style={{ backgroundColor: '#22c55e' }}
              >
                POST TREATMENT SKINCARE
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-5">
                Comfort For Today, Confidence Tomorrow
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                Our <strong className="text-white">Post Treatment</strong>
                <br />
                <strong className="text-white">Skincare</strong> Range
              </p>
              <a
                href="#products"
                className="inline-block px-6 py-2.5 text-sm font-bold text-white rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#222' }}
              >
                EXPLORE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-category circles */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-start justify-center gap-10 lg:gap-20 flex-wrap">
            {postTreatmentCircles.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <div
                  className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-4 ring-offset-2 group-hover:ring-offset-4 transition-all shadow-md"
                  style={{ '--tw-ring-color': item.ring } as React.CSSProperties}
                >
                  <Image
                    src={item.image}
                    alt={item.name.replace('\n', ' ')}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span
                  className="text-sm font-medium whitespace-pre-line leading-tight"
                  style={{ color: item.ring }}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* "MORE FROM OUR..." banner */}
      <div className="w-full py-3 text-white text-sm font-bold tracking-wider" style={{ backgroundColor: '#7c3aed' }}>
        <div className="container mx-auto px-4 lg:px-6">
          MORE FROM OUR <strong>POST TREATMENT SKINCARE</strong> RANGE
        </div>
      </div>

      {/* Products grid */}
      <div id="products" className="container mx-auto px-4 lg:px-6 py-12">
        <PostTreatmentBundleBanner />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
