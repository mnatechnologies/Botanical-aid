import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { PAGE_COPY_REGISTRY, PAGE_COPY_SLUGS } from '@/lib/pageCopyRegistry';
import { PAGE_COPY_DEFAULTS_MAP } from '@/lib/pageCopyDefaults';
import PageCopyEditor from './PageCopyEditor';

export const dynamic = 'force-dynamic';

export default async function PageCopyPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();

  const { page } = await searchParams;
  const slug = page && PAGE_COPY_SLUGS.includes(page) ? page : PAGE_COPY_SLUGS[0];

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('page_overrides').select('blocks').eq('slug', slug).maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3a8f]">Website content</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit the text on the existing pages. Leave a box empty to keep the wording shown in grey.
        </p>
      </div>

      <PageCopyEditor
        slug={slug}
        pages={PAGE_COPY_SLUGS.map((s) => ({ slug: s, label: PAGE_COPY_REGISTRY[s].label, path: PAGE_COPY_REGISTRY[s].path }))}
        spec={PAGE_COPY_REGISTRY[slug]}
        defaults={PAGE_COPY_DEFAULTS_MAP[slug] as Record<string, unknown>}
        saved={(data?.blocks ?? {}) as Record<string, unknown>}
      />
    </div>
  );
}
