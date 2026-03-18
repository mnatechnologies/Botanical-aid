import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, getProductBySlug, getProductsByCategory } from '@/data/products';
import ProductDetail from './ProductDetail';
import ProductCard from '@/components/ProductCard';
import PostTreatmentBundleBanner from '@/components/PostTreatmentBundleBanner';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const categoryLabel =
    product.category === 'mental-health'
      ? 'Mental Health Balm'
      : 'Post Treatment Skincare';

  return {
    title: `${product.name} — ${categoryLabel}`,
    description: product.longDescription || product.description,
    openGraph: {
      title: `${product.name} | Botanical Aid`,
      description: product.description,
      type: 'website',
      url: `https://www.botanicalaid.com.au/products/${product.slug}`,
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Botanical Aid`,
      description: product.description,
    },
    alternates: {
      canonical: `https://www.botanicalaid.com.au/products/${product.slug}`,
    },
  };
}

function ProductJsonLd({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.longDescription || product.description,
    image: `https://www.botanicalaid.com.au${product.image}`,
    url: `https://www.botanicalaid.com.au/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Botanical Aid',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      url: `https://www.botanicalaid.com.au/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Botanical Aid',
      },
    },
    category:
      product.category === 'mental-health'
        ? 'Mental Health Balms'
        : 'Post Treatment Skincare',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const categoryLabel =
    product.category === 'mental-health'
      ? 'Mental Health Range'
      : 'Post Treatment Skincare';
  const categoryPath =
    product.category === 'mental-health'
      ? '/mental-healthrange'
      : '/post-treatment-skincare';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.botanicalaid.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabel,
        item: `https://www.botanicalaid.com.au${categoryPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://www.botanicalaid.com.au/products/${product.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getProductsByCategory(product.category).filter(
    (p) => p.id !== product.id,
  );

  return (
    <div className="container mx-auto px-4 lg:px-6 py-12">
      <ProductJsonLd slug={slug} />
      <BreadcrumbJsonLd slug={slug} />
      <ProductDetail product={product} />

      {product.category === 'post-treatment' && (
        <div className="mt-10">
          <PostTreatmentBundleBanner />
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
