import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Our Privacy Policy',
  description: 'Botanical Aid privacy policy — how we collect, use, and safeguard your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHero title="Our Privacy Policy" imageUrl="/assets/hero-about.jpg" />

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              At Botanical Aid, we are committed to protecting your personal information and
              ensuring its privacy, accuracy, and security. This Privacy Policy outlines how we
              collect, use, and safeguard your personal information in compliance with the
              Privacy Act 1988 (Cth).
            </p>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Collection of personal information</h2>
              <p className="mb-3">We collect personal information that you provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Make a purchase on our website.</li>
                <li>Contact us for inquiries or support.</li>
                <li>Subscribe to our newsletter or marketing communications.</li>
              </ul>
              <p className="mt-3">
                The types of personal information we may collect include your name, email address,
                phone number, delivery address, and payment details.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Use of personal information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fulfill orders and process payments.</li>
                <li>Respond to customer inquiries and provide support.</li>
                <li>Send newsletters or promotional offers (if opted-in).</li>
                <li>Improve our website and services.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Sharing of personal information</h2>
              <p className="mb-3">
                We do not sell or share your personal information with third parties, except as
                necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process payments (via trusted payment processors).</li>
                <li>Fulfill shipping and delivery services.</li>
                <li>Comply with legal obligations or requests from law enforcement.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Security of personal information</h2>
              <p>
                We take all reasonable steps to protect your information from misuse, loss, or
                unauthorized access. This includes secure servers, encryption, and regular data
                protection audits.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Access and correction</h2>
              <p>
                You have the right to access and correct your personal information. To request
                changes or access your data, please contact us at{' '}
                <a href="mailto:info@botanicalaid.com.au" className="text-[#1565c0] hover:underline">
                  info@botanicalaid.com.au
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Cookies and tracking</h2>
              <p>
                Our website uses cookies to improve your browsing experience. Cookies help us
                understand user preferences and enhance website functionality. You can manage
                your cookie settings through your browser.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Third-party links</h2>
              <p>
                Our website may contain links to external sites. We are not responsible for the
                privacy practices of these third-party sites and recommend reviewing their
                policies before sharing personal information.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Changes to this policy</h2>
              <p>
                We reserve the right to update this Privacy Policy to reflect changes in our
                practices or legal obligations. Any updates will be posted on this page with the
                revised date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Contact us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              <ul className="mt-2 space-y-1">
                <li>Email: <a href="mailto:info@botanicalaid.com.au" className="text-[#1565c0] hover:underline">info@botanicalaid.com.au</a></li>
                <li>Phone: <a href="tel:1300895132" className="text-[#1565c0] hover:underline">1300 895 132</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
