import type { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';
import { faqSections } from '@/data/testimonials';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about Botanical Aid products, shipping, usage, and safety.',
};

export default function FAQPage() {
  const botanicalFAQ = faqSections.filter((s) => s.category === 'Botanical Aid');
  const homeopathyFAQ = faqSections.filter((s) => s.category === 'Homeopathy');

  return (
    <div>
      <PageHero title="FAQs" imageUrl="/assets/hero-shop.png" />

      <div className="container mx-auto px-4 lg:px-6 py-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#1a3a8f] mb-10 text-center">
          FAQ &ndash; Frequently Asked Questions
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {/* Botanical Aid FAQs */}
          <div>
            <div className="border border-[#1a3a8f] rounded px-4 py-2 mb-5 text-center">
              <span
                className="text-[#1a3a8f] font-semibold text-sm tracking-wide"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                Botanical<span className="text-[#22c55e]">Aid</span> 🌿
              </span>
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
            <div className="border border-gray-300 rounded px-4 py-2 mb-5 text-center">
              <span
                className="text-gray-600 font-semibold text-sm tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Homeopathy 🌿
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Homeopathy is a natural, holistic system of healing that has been used for centuries.
              It is based on the principle of &ldquo;like cures like&rdquo;, meaning that a
              substance causing symptoms in a healthy person can help treat similar symptoms in an
              unwell person when given in highly diluted doses. This FAQ section is designed to
              provide clear, straightforward answers, helping you understand the benefits and
              applications of homeopathic treatment.
            </p>
            <FAQAccordion sections={homeopathyFAQ} />
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;d love to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
