import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Returns Policy',
  description: 'Botanical Aid returns policy — information about claims, refunds, and exchanges for our natural wellness products.',
  alternates: {
    canonical: 'https://www.botanicalaid.com.au/returns',
  },
};

export default function ReturnsPage() {
  return (
    <div>
      <PageHero title="Our Returns Policy" imageUrl="/assets/hero-contact.jpg" />

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              At Botanical Aid, we aim to ensure your purchase reaches you in perfect condition.
              If there&apos;s an issue with your order, please reach out to us at{' '}
              <a href="mailto:info@botanicalaid.com.au" className="text-[#1565c0] hover:underline">
                info@botanicalaid.com.au
              </a>
              , and we&apos;ll do our best to resolve it.
            </p>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Important, please note:</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Refunds are not provided for items if you simply change your mind, so we
                  encourage you to choose carefully.
                </li>
                <li>
                  Claims for products that are (1) damaged during transport, or (2) incorrect
                  goods received, must be made within 24 hours of delivery via email.
                </li>
                <li>
                  As part of our process, we kindly remind customers to inspect their goods upon
                  arrival before opening them. Your diligence helps us address concerns swiftly.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
