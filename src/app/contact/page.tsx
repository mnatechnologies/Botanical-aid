import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Get in touch with Botanical Aid. We'd love to hear from you about our natural wellness products.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHero title="Contact Us" imageUrl="/assets/hero-contact.jpg" />
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#1565c0] mb-3">
            We&apos;re here for you.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Your questions, feedback and personal care needs matter to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Our dedicated team is ready to assist you promptly, so reach out to us on:
              </h3>
              <ul className="space-y-4 text-sm mt-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a
                      href="mailto:info@botanicalaid.com.au"
                      className="text-muted-foreground hover:text-primary transition-colors break-all"
                    >
                      info@botanicalaid.com.au
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Call us on</p>
                    <a
                      href="tel:1300895132"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      1300 895 132
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Our clinic is located at</p>
                    <p className="text-muted-foreground">
                      Bella Vista, NSW 2153
                    </p>
                  </div>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-6">
                Let&apos;s stay connected &mdash; we&apos;d love to hear from you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
