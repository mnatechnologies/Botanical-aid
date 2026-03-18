import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for Botanical Aid — please read before placing an order.',
  alternates: {
    canonical: 'https://www.botanicalaid.com.au/terms',
  },
};

export default function TermsPage() {
  return (
    <div>
      <PageHero title="Terms & Conditions" imageUrl="/assets/hero-testimonials.jpg" />

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              Welcome to Botanical Aid. By accessing or purchasing from our website, you agree to
              the following Terms and Conditions. Please read them carefully before placing an order.
            </p>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Company Information</h2>
              <p>
                Botanical Aid is a provider of natural therapeutic creams, mental health balms, and
                post-cosmetic recovery creams. Our products are intended for general wellness and
                cosmetic support only.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Use of Products</h2>
              <p>
                Our products are not medicines and are not intended to diagnose, treat, cure, or
                prevent any medical condition. Customers should consult a qualified healthcare
                professional before using our products if they have existing medical conditions,
                are pregnant, breastfeeding, or taking prescription medications. Results may vary
                depending on individual circumstances.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Sales Restrictions</h2>
              <p>
                Botanical Aid does not sell or ship products to the United States of America or
                Canada due to regulatory and insurance limitations. Orders placed with a shipping
                address in these countries will be cancelled and refunded.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Orders &amp; Payments</h2>
              <p>
                All orders are subject to acceptance and availability. Prices are listed in AUD
                and may change without notice. Payment must be made in full at the time of purchase.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Shipping &amp; Delivery</h2>
              <p>
                Delivery times are estimates only and may vary depending on location and courier
                services. Botanical Aid is not responsible for delays outside our control.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Returns &amp; Refunds</h2>
              <p>
                Returns are accepted within 2 days of purchase if products are unused, unopened,
                and in original packaging. Refunds will be processed once returned items are
                received and inspected. Shipping costs are non-refundable unless the product is
                faulty or damaged.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Liability Disclaimer</h2>
              <p>
                Botanical Aid is not liable for any adverse reactions, misuse of products, or
                reliance on product descriptions as medical advice. Customers assume responsibility
                for ensuring products are suitable for their personal use.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Intellectual Property</h2>
              <p>
                All content on our website, including product descriptions, images, and branding,
                is the property of Botanical Aid and may not be copied or reproduced without
                permission.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Privacy &amp; Data Protection</h2>
              <p>
                Botanical Aid respects your privacy and is committed to protecting your personal
                information. Information collected during your use of our website (such as name,
                address, email, and payment details) is used solely for order processing, delivery,
                and customer service. We do not sell, rent, or share your personal data with third
                parties, except where required by law or to complete your transaction (e.g., with
                payment processors or delivery services). All data is stored securely and handled
                in accordance with applicable privacy laws. By using our website, you consent to
                the collection and use of your information as outlined in this policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Governing Law</h2>
              <p>
                These Terms and Conditions are governed by the laws of Sydney, Australia. Any
                disputes will be resolved under the jurisdiction of the courts in New South Wales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Amendments</h2>
              <p>
                Botanical Aid reserves the right to update or amend these Terms and Conditions at
                any time. Changes will be effective immediately upon posting on our website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
