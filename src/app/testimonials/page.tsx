import type { Metadata } from 'next';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Read real reviews from Botanical Aid customers about our natural wellness products.',
};

export default function TestimonialsPage() {
  const mentalHealth = testimonials.filter((t) => t.category === 'mental-health');
  const postTreatment = testimonials.filter((t) => t.category === 'post-treatment');

  // Group by product
  const groupByProduct = (items: typeof testimonials) => {
    const groups: Record<string, typeof testimonials> = {};
    items.forEach((t) => {
      if (!groups[t.product]) groups[t.product] = [];
      groups[t.product].push(t);
    });
    return groups;
  };

  const mhGroups = groupByProduct(mentalHealth);
  const ptGroups = groupByProduct(postTreatment);

  return (
    <div>
      <PageHero title="Testimonials" imageUrl="/assets/hero-testimonials.jpg" />

      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#1565c0] mb-2">
            Relief You Can Feel. Stories You Can Trust.
          </h2>
        </div>

        {/* Mental Health Range */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white bg-[#7c3aed]">
              MENTAL HEALTH RANGE
            </span>
          </div>

          {Object.entries(mhGroups).map(([product, reviews]) => (
            <div key={product} className="mb-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                What people are saying about our {product}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews.map((t, i) => (
                  <TestimonialCard key={i} testimonial={t} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Post Treatment Skincare */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white bg-[#22c55e]">
              POST TREATMENT SKINCARE
            </span>
          </div>

          {Object.entries(ptGroups).map(([product, reviews]) => (
            <div key={product} className="mb-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                What people are saying about our {product}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews.map((t, i) => (
                  <TestimonialCard key={i} testimonial={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
