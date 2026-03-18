import type { Metadata, Viewport } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a3a8f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.botanicalaid.com.au'),
  title: {
    default: 'Botanical Aid | Natural Wellness Products — Mental Health Balms & Post-Treatment Skincare',
    template: '%s | Botanical Aid',
  },
  description:
    'Botanical Aid offers natural wellness products including mental health balms for anxiety, grief, depression & focus, plus post-treatment skincare for cosmetic surgery recovery. Australian-made, vegan & cruelty-free.',
  keywords: [
    'natural wellness products',
    'botanical skincare',
    'mental health balm',
    'anxiety cream natural',
    'grief support balm',
    'post-treatment skincare',
    'post-cosmetic surgery cream',
    'post lip filler balm',
    'post surgery care cream',
    'homeopathic remedies Australia',
    'essential oils',
    'holistic healing',
    'natural anxiety relief',
    'vegan skincare Australia',
  ],
  authors: [{ name: 'Botanical Aid' }],
  creator: 'Botanical Aid',
  publisher: 'Botanical Aid',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: 'Botanical Aid | Natural Wellness Products',
    description:
      'Pure, botanical formulations for holistic healing. Mental health balms and post-treatment skincare. Australian-made, vegan & cruelty-free.',
    siteName: 'Botanical Aid',
    type: 'website',
    locale: 'en_AU',
    url: 'https://www.botanicalaid.com.au',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Botanical Aid | Natural Wellness Products',
    description:
      'Pure, botanical formulations for holistic healing. Mental health balms and post-treatment skincare.',
  },
  alternates: {
    canonical: 'https://www.botanicalaid.com.au',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
    <head>

          <Script id="gtm-head" strategy="afterInteractive">
            {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-TZL7TMFN');
              `}
          </Script>

      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

    </head>
      <body className="font-sans antialiased">
      <noscript>
        <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-TZL7TMFN`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.botanicalaid.com.au/#organization',
                  name: 'Botanical Aid',
                  url: 'https://www.botanicalaid.com.au',
                  email: 'info@botanicalaid.com.au',
                  telephone: '1300 895 132',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bella Vista',
                    addressRegion: 'NSW',
                    postalCode: '2153',
                    addressCountry: 'AU',
                  },
                  sameAs: [
                    'https://www.facebook.com/botanicalaid',
                    'https://www.instagram.com/botanicalaid',
                    'https://x.com/botanicalaid',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.botanicalaid.com.au/#website',
                  url: 'https://www.botanicalaid.com.au',
                  name: 'Botanical Aid',
                  publisher: {
                    '@id': 'https://www.botanicalaid.com.au/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://www.botanicalaid.com.au/products?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
        <CartProvider>
          <Header />
          {/* top-9 = topbar (36px), + nav (72px) = 108px total */}
          <main className="min-h-screen pt-[108px]">{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
