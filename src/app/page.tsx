import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductCard from '@/components/ProductCard';
import PostTreatmentBundleBanner from '@/components/PostTreatmentBundleBanner';
import WhyChooseUs from '@/components/WhyChooseUs';
import FAQAccordion from '@/components/FAQAccordion';
import { products } from '@/data/products';
import { faqSections } from '@/data/testimonials';

const mentalHealthProducts = products.filter(p => p.category === 'mental-health');
const postTreatmentProducts = products.filter(p => p.category === 'post-treatment');

const botanicalFAQ = faqSections.filter(s => s.category === 'Botanical Aid');
const homeopathyFAQ = faqSections.filter(s => s.category === 'Homeopathy');

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />

      {/* ── Products Section ── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 lg:px-6">

          {/* Mental Health Range row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {mentalHealthProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Post Treatment Skincare row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {postTreatmentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Post Treatment Bundle Banner */}
          <div className="max-w-3xl mx-auto mt-6">
            <PostTreatmentBundleBanner />
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 rounded text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1a3a8f' }}
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Section — split layout ── */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
          {/* Left — lavender/dropper photo */}
          <div className="relative min-h-[320px] lg:min-h-0 order-2 lg:order-1">
            <Image
              src="/assets/hero-shop.png"
              alt="Natural botanical ingredients — essential oil dropper"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Right — bright green panel */}
          <div
            className="flex items-center px-10 lg:px-16 py-14 lg:py-20 order-1 lg:order-2"
            style={{ backgroundColor: '#22c55e' }}
          >
            <div className="max-w-lg w-full">
              <p className="text-white/80 text-xs font-semibold tracking-widest uppercase flex items-center gap-2 mb-3">
                <span>✿</span> About
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                About Botanical Aid
              </h2>
              <p className="text-white/90 text-sm leading-relaxed mb-8">
                At Botanical Aid, we believe in the power of nature to nurture and heal.
                Our products are lovingly formulated with pure, natural ingredients to
                enhance therapeutic effects, the way nature intended.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="px-7 py-2.5 text-sm font-bold text-white rounded hover:bg-white/10 transition-colors"
                  style={{ backgroundColor: '#1a3a8f' }}
                >
                  READ MORE
                </Link>
                <Link
                  href="/products"
                  className="px-7 py-2.5 text-sm font-bold border border-white text-white rounded hover:bg-white hover:text-[#22c55e] transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us — split layout ── */}
      <WhyChooseUs />

      {/* ── FAQ Section ── */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#f0faf5' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a3a8f] mb-10 text-center">
            FAQ – Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {/* Botanical Aid FAQs */}
            <div>
              <div className="border border-[#1a3a8f] rounded px-4 py-3 mb-5 flex items-center justify-center">
                <Image
                  src="/circle/assets/faq-botanicalaid.png"
                  alt="BotanicalAid"
                  width={599}
                  height={90}
                  unoptimized
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Botanical aid and natural products harness the power of plant-based ingredients to
                support health and wellness. These remedies, derived from herbs, roots, and essential
                oils, have been used for centuries to promote balance and vitality. This FAQ answers
                common questions about their benefits, uses, and how they can complement your
                well-being naturally.
              </p>
              <FAQAccordion sections={botanicalFAQ} />
            </div>
            {/* Homeopathy FAQs */}
            <div className="mt-8 md:mt-0">
              <div className="border border-gray-300 rounded px-4 py-3 mb-5 flex items-center justify-center">
                <Image
                  src="/circle/assets/faq-homeopathy.png"
                  alt="Homeopathy"
                  width={598}
                  height={90}
                  unoptimized
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Homeopathy is a natural, holistic system of healing that has been used for centuries.
                It is based on the principle of &ldquo;like cures like&rdquo;, meaning that a substance
                causing symptoms in a healthy person can help treat similar symptoms in an unwell
                person when given in highly diluted doses.
              </p>
              <FAQAccordion sections={homeopathyFAQ} />
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3 rounded text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1a3a8f' }}
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
