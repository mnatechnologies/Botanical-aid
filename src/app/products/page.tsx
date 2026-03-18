import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { products, getProductsByCategory } from '@/data/products';
import type { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import PostTreatmentBundleBanner from '@/components/PostTreatmentBundleBanner';
import ProductFilter from './ProductFilter';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Shop Natural Wellness Products',
  description:
    'Browse Botanical Aid\'s full range of natural wellness products. Mental health balms for anxiety, grief, depression & focus. Post-treatment skincare for cosmetic surgery recovery. Free shipping over $99.',
  alternates: {
    canonical: 'https://www.botanicalaid.com.au/products',
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

const categoryLabels: Record<string, string> = {
  'mental-health': 'Mental Health Range',
  'post-treatment': 'Post Treatment Skincare',
};

/* ── Product sub-category circles (shown below the hero on category pages) ── */
const mentalHealthCircles = [
  { name: 'Focus and\nClarity', image: '/circle/assets/circle-focus-clarity.png', ring: '#4dd6c5', slug: 'focus-and-clarity' },
  { name: 'Grief', image: '/circle/assets/circle-grief.png', ring: '#e87fa5', slug: 'grief' },
  { name: 'Mild Anxiety', image: '/circle/assets/circle-mild-anxiety.png', ring: '#7c3aed', slug: 'mild-anxiety' },
  { name: 'Mild Depression', image: '/circle/assets/circle-mild-depression.png', ring: '#22c55e', slug: 'mild-depression' },
];

const postTreatmentCircles = [
  { name: 'Post Cosmetic\nCream', image: '/circle/assets/circle-post-cosmetic.png', ring: '#b8c94e', slug: 'post-cosmetic-cream' },
  { name: 'Post Lip Filler\nBalm', image: '/circle/assets/circle-post-lip-filler.png', ring: '#e8a4c8', slug: 'post-lip-filler-balm' },
  { name: 'Post Surgery\nCare Cream', image: '/circle/assets/circle-post-surgery.png', ring: '#a4d4e8', slug: 'post-surgery-care-cream' },
];

function CategoryCircles({ items }: { items: typeof mentalHealthCircles }) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-start justify-center gap-10 lg:gap-20 flex-wrap">
          {items.map((item) => (
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
  );
}

/* ── Category-specific hero content ── */
function MentalHealthHero() {
  return (
    <>
      {/* Desktop */}
      <section className="relative w-full overflow-hidden hidden md:block" style={{ height: '620px' }}>
        <div className="absolute inset-0 bg-black">
          <Image src="/assets/hero-mental-health.webp" alt="" fill unoptimized className="object-cover" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="max-w-xl">
              <span className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-6" style={{ backgroundColor: '#7c3aed' }}>MENTAL HEALTH RANGE</span>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-5">Find The Light And Set Your Mind Free With Botanical Aid.</h1>
              <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">Our <strong className="text-white">Mental Health</strong> range allow you to experience the profound healing that natural remedies provide, helping you achieve a balanced, harmonious, and healthier life.</p>
              <a href="#products" className="inline-block px-6 py-2.5 text-sm font-bold text-white rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#222' }}>EXPLORE</a>
            </div>
          </div>
        </div>
      </section>
      {/* Mobile */}
      <section className="md:hidden">
        <div className="relative w-full aspect-[4/3]">
          <Image src="/assets/hero-mental-health.webp" alt="" fill unoptimized className="object-cover" />
        </div>
        <div className="px-6 py-8 text-center">
          <span className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-5" style={{ backgroundColor: '#7c3aed' }}>MENTAL HEALTH RANGE</span>
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">Find The Light And Set Your Mind Free With Botanical Aid.</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">Our <strong className="text-foreground">Mental Health</strong> range allow you to experience the profound healing that natural remedies provide, helping you achieve a balanced, harmonious, and healthier life.</p>
          <a href="#products" className="inline-block px-6 py-2.5 text-sm font-bold text-white rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#222' }}>EXPLORE</a>
        </div>
      </section>
    </>
  );
}

function PostTreatmentHero() {
  return (
    <>
      {/* Desktop */}
      <section className="relative w-full overflow-hidden hidden md:block" style={{ height: '620px' }}>
        <div className="absolute inset-0">
          <Image src="/assets/hero-post-treatment.avif" alt="" fill unoptimized className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="max-w-xl">
              <span className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-6" style={{ backgroundColor: '#22c55e' }}>POST TREATMENT SKINCARE</span>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-5">Comfort For Today, Confidence Tomorrow</h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">Our <strong className="text-white">Post Treatment</strong><br /><strong className="text-white">Skincare</strong> Range</p>
              <a href="#products" className="inline-block px-6 py-2.5 text-sm font-bold text-white rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#222' }}>EXPLORE</a>
            </div>
          </div>
        </div>
      </section>
      {/* Mobile */}
      <section className="md:hidden">
        <div className="relative w-full aspect-[4/3]">
          <Image src="/assets/hero-post-treatment.avif" alt="" fill unoptimized className="object-cover" />
        </div>
        <div className="px-6 py-8 text-center">
          <span className="inline-block px-5 py-2 rounded text-white text-sm font-bold tracking-wider uppercase mb-5" style={{ backgroundColor: '#22c55e' }}>POST TREATMENT SKINCARE</span>
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">Comfort For Today, Confidence Tomorrow</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">Our <strong className="text-foreground">Post Treatment Skincare</strong> Range</p>
          <a href="#products" className="inline-block px-6 py-2.5 text-sm font-bold text-white rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#222' }}>EXPLORE</a>
        </div>
      </section>
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;

  let filteredProducts: Product[];
  let pageTitle: string;

  if (category === 'mental-health' || category === 'post-treatment') {
    filteredProducts = getProductsByCategory(category);
    pageTitle = categoryLabels[category];
  } else {
    filteredProducts = products;
    pageTitle = 'All Products';
  }

  return (
    <div>
      {/* Category-specific hero or generic shop hero */}
      {category === 'mental-health' ? (
        <MentalHealthHero />
      ) : category === 'post-treatment' ? (
        <PostTreatmentHero />
      ) : (
        <PageHero
          title="Shop"
          imageUrl="/assets/hero-shop.png"
        />
      )}

      {/* Sub-category circles */}
      {category === 'mental-health' && (
        <CategoryCircles items={mentalHealthCircles} />
      )}
      {category === 'post-treatment' && (
        <CategoryCircles items={postTreatmentCircles} />
      )}

      {/* "MORE FROM OUR..." banner */}
      {category === 'mental-health' && (
        <div className="w-full py-3 text-white text-sm font-bold tracking-wider" style={{ backgroundColor: '#7c3aed' }}>
          <div className="container mx-auto px-4 lg:px-6">
            MORE FROM OUR <strong>MENTAL HEALTH</strong> RANGE
          </div>
        </div>
      )}
      {category === 'post-treatment' && (
        <div className="w-full py-3 text-white text-sm font-bold tracking-wider" style={{ backgroundColor: '#7c3aed' }}>
          <div className="container mx-auto px-4 lg:px-6">
            MORE FROM OUR <strong>POST TREATMENT SKINCARE</strong> RANGE
          </div>
        </div>
      )}

    <div id="products" className="container mx-auto px-4 lg:px-6 py-12">
      {!category && (
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Explore our full range of natural wellness products.
        </p>
      </div>
      )}

      <ProductFilter currentCategory={category} />

      {category === 'post-treatment' && (
        <div className="mt-8">
          <PostTreatmentBundleBanner />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {!category && (
        <div className="mt-8">
          <PostTreatmentBundleBanner />
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
    </div>
  );
}
