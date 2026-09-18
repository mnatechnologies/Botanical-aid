import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import PageForm from '../PageForm';

export const dynamic = 'force-dynamic';

export default async function NewPage() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('products').select('slug, name').order('sort_order');

  return (
    <div className="space-y-6">
      <Link href="/admin/pages" className="text-sm text-[#1a3a8f] hover:underline">← Back to pages</Link>
      <h1 className="text-2xl font-bold text-[#1a3a8f]">New page</h1>
      <PageForm
        products={(data ?? []) as { slug: string; name: string }[]}
        initial={{
          title: '', slug: '', hero_subtitle: '', meta_title: '', meta_description: '',
          custom_css: '', published: false, sections: [],
        }}
      />
    </div>
  );
}
