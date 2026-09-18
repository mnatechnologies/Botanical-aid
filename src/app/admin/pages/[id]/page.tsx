import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { parsePageSections } from '@/lib/pageSections';
import PageForm from '../PageForm';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  const [{ data: page }, { data: products }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).maybeSingle(),
    supabase.from('products').select('slug, name').order('sort_order'),
  ]);

  if (!page) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/pages" className="text-sm text-[#1a3a8f] hover:underline">← Back to pages</Link>
      <h1 className="text-2xl font-bold text-[#1a3a8f]">{page.title as string}</h1>
      <PageForm
        products={(products ?? []) as { slug: string; name: string }[]}
        initial={{
          id: page.id as string,
          title: (page.title as string) ?? '',
          slug: (page.slug as string) ?? '',
          hero_subtitle: (page.hero_subtitle as string) ?? '',
          meta_title: (page.meta_title as string) ?? '',
          meta_description: (page.meta_description as string) ?? '',
          custom_css: (page.custom_css as string) ?? '',
          published: Boolean(page.published),
          sections: parsePageSections(page.sections),
        }}
      />
    </div>
  );
}
