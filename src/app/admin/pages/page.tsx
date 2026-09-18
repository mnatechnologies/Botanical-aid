import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import PageRowActions from './PageRowActions';

export const dynamic = 'force-dynamic';

type Row = { id: string; slug: string; title: string; published: boolean; updated_at: string };

export default async function AdminPagesList() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title, published, updated_at')
    .order('updated_at', { ascending: false });

  const pages = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a8f]">Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Extra pages you create yourself, on top of the main website pages.</p>
        </div>
        <Link href="/admin/pages/new" className="h-10 px-4 rounded-md bg-[#1a3a8f] text-white text-sm font-semibold inline-flex items-center">
          New page
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">Could not load pages: {error.message}</p>}

      {!error && pages.length === 0 && (
        <p className="text-sm text-gray-600">No pages yet. Create one and it appears on the website at its own address.</p>
      )}

      <div className="space-y-3">
        {pages.map((page) => (
          <div key={page.id} className="bg-white border border-[#e5e7eb] rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/admin/pages/${page.id}`} className="font-medium text-[#1a3a8f] hover:underline truncate">
                  {page.title}
                </Link>
                <span className={`text-xs px-2 py-0.5 rounded-full ${page.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {page.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                /{page.slug} · updated {new Date(page.updated_at).toLocaleDateString('en-AU')}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-none">
              <a href={`/admin/pages/${page.id}/preview`} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm rounded border border-[#e5e7eb] hover:bg-gray-50">
                Preview
              </a>
              <PageRowActions id={page.id} published={page.published} title={page.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
