import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PageSections from '@/components/PageSections';
import { parsePageSections, collectSectionFaqItems, collectProductSlugs } from '@/lib/pageSections';
import { getProducts } from '@/lib/products-db';

/**
 * Renders pages the client builds in /admin/pages. Unpublished pages 404.
 * revalidate keeps these statically cached; saving a page in the admin calls
 * revalidatePath() for its slug, so edits appear immediately rather than in a minute.
 */
export const revalidate = 300;

const SITE = 'https://www.botanicalaid.com.au';

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

async function loadPage(slug: string) {
  try {
    const { data } = await publicClient()
      .from('pages')
      .select('slug, title, hero_subtitle, sections, meta_title, meta_description, custom_css')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadPage(slug.join('/'));
  if (!page) return { title: 'Page not found' };

  return {
    title: (page.meta_title as string) || (page.title as string),
    description: (page.meta_description as string) || undefined,
    alternates: { canonical: `${SITE}/${slug.join('/')}` },
    openGraph: {
      title: (page.meta_title as string) || (page.title as string),
      description: (page.meta_description as string) || undefined,
      url: `${SITE}/${slug.join('/')}`,
      type: 'website',
      locale: 'en_AU',
    },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await loadPage(slug.join('/'));
  if (!page) notFound();

  const sections = parsePageSections(page.sections);
  const faqItems = collectSectionFaqItems(sections);
  const needsProducts = collectProductSlugs(sections).length > 0;
  const products = needsProducts ? await getProducts() : [];

  return (
    <div>
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }),
          }}
        />
      )}

      {page.custom_css && (
        <style
          // admin-authored only; the guard stops the value closing the tag early
          dangerouslySetInnerHTML={{ __html: String(page.custom_css).replace(/<\/style/gi, '<\\/style') }}
        />
      )}

      <section className="py-14 bg-[#1a3a8f]">
        <div className="container mx-auto px-4 lg:px-6">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">{page.title as string}</h1>
          {page.hero_subtitle && <p className="mt-4 text-white/80 max-w-2xl">{page.hero_subtitle as string}</p>}
        </div>
      </section>

      <PageSections sections={sections} products={products} />
    </div>
  );
}
