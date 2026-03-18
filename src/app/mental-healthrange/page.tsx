import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsByCategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Mental Health Range — Natural Balms for Anxiety, Grief & Focus',
  description:
    'Explore Botanical Aid\'s Mental Health range — natural homeopathic balms and creams to support anxiety, grief, depression, focus and emotional well-being. Australian-made, vegan & cruelty-free.',
  alternates: {
    canonical: 'https://www.botanicalaid.com.au/mental-healthrange',
  },
};

/* ── Product sub-category circles ── */
const mentalHealthCircles = [
  { name: 'Focus and\nClarity', image: '/circle/assets/circle-focus-clarity.png', ring: '#4dd6c5', slug: 'focus-and-clarity' },
  { name: 'Grief', image: '/circle/assets/circle-grief.png', ring: '#e87fa5', slug: 'grief' },
  { name: 'Mild Anxiety', image: '/circle/assets/circle-mild-anxiety.png', ring: '#7c3aed', slug: 'mild-anxiety' },
  { name: 'Mild Depression', image: '/circle/assets/circle-mild-depression.png', ring: '#22c55e', slug: 'mild-depression' },
];

export default function MentalHealthRangePage() {
  const products = getProductsByCategory('mental-health');

  return (
    <div>
      {/* Hero — Desktop: overlay layout / Mobile: stacked layout */}
      {/* Desktop hero (hidden on mobile) */}
      <section className="relative w-full overflow-hidden hidden md:block" style={{ height: '620px' }}>
        <div className="absolute inset-0 bg-black">
          <Image
            src="/assets/hero-mental-health.webp"
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="max-w-xl">
              <span
                className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-6"
                style={{ backgroundColor: '#7c3aed' }}
              >
                MENTAL HEALTH RANGE
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-5">
                Find The Light And Set Your Mind Free With Botanical Aid.
              </h1>
              <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                Our <strong className="text-white">Mental Health</strong> range allow you to experience the profound
                healing that natural remedies provide, helping you achieve a balanced,
                harmonious, and healthier life.
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

      {/* Mobile hero (hidden on desktop) */}
      <section className="md:hidden">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src="/assets/hero-mental-health.webp"
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="px-6 py-8 text-center">
          <span
            className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-5"
            style={{ backgroundColor: '#7c3aed' }}
          >
            MENTAL HEALTH RANGE
          </span>
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">
            Find The Light And Set Your Mind Free With Botanical Aid.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Our <strong className="text-foreground">Mental Health</strong> range allow you to experience the profound
            healing that natural remedies provide, helping you achieve a balanced,
            harmonious, and healthier life.
          </p>
          <a
            href="#products"
            className="inline-block px-6 py-2.5 text-sm font-bold text-white rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#222' }}
          >
            EXPLORE
          </a>
        </div>
      </section>

      {/* Sub-category circles */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-start justify-center gap-10 lg:gap-20 flex-wrap">
            {mentalHealthCircles.map((item) => (
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
          MORE FROM OUR <strong>MENTAL HEALTH</strong> RANGE
        </div>
      </div>

      {/* Products grid */}
      <div id="products" className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
