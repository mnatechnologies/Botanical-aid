import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { parsePageSections, collectProductSlugs } from '@/lib/pageSections';
import { getProducts } from '@/lib/products-db';
import PageSections from '@/components/PageSections';

/**
 * Draft preview. Renders an unpublished page exactly as the live route would, but behind
 * the admin auth check — so nothing is exposed publicly and no preview cookie is needed.
 */
export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  const { data: page } = await supabase
    .from('pages')
    .select('slug, title, hero_subtitle, sections, custom_css, published')
    .eq('id', id)
    .maybeSingle();

  if (!page) notFound();

  const sections = parsePageSections(page.sections);
  const products = collectProductSlugs(sections).length > 0 ? await getProducts() : [];

  return (
    <div className="-mx-4 -my-8">
      <div className="sticky top-0 z-30 bg-[#1a3a8f] text-white text-sm">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-4">
          <span>
            Preview — {page.published ? 'this page is live' : 'this page is a draft and is not on the website yet'}
          </span>
          <div className="flex items-center gap-4">
            <Link href={`/admin/pages/${id}`} className="underline">Back to editing</Link>
            <Link href="/admin/pages" className="underline">All pages</Link>
          </div>
        </div>
      </div>

      {page.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: String(page.custom_css).replace(/<\/style/gi, '<\\/style') }} />
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
