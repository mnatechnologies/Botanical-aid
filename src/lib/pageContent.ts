import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * Page copy overrides.
 *
 * Every hardcoded marketing page keeps its wording in `PAGE_COPY_DEFAULTS` and renders
 * it through `text(b, key, D.key)` / `list(b, key, D.key)`. The CMS stores only the
 * strings someone has actually changed, in `page_overrides.blocks`.
 *
 * Every failure path returns the in-code default: table missing, no published row,
 * wrong type, empty string. So the rendered output is identical to the pre-CMS site
 * until an override is saved, and a bad save can never blank out a page.
 */

export type PageBlocks = Record<string, unknown>;

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function getPageOverrides(slug: string): Promise<PageBlocks> {
  try {
    const { data, error } = await publicClient()
      .from('page_overrides')
      .select('blocks')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data || typeof data.blocks !== 'object' || data.blocks === null) return {};
    return data.blocks as PageBlocks;
  } catch {
    return {};
  }
}

/** Request-memoised: several components on one page share a single query. */
export const getPageOverridesCached = cache(getPageOverrides);

export function text(blocks: PageBlocks, key: string, fallback: string): string {
  const value = blocks[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

export function list<T>(blocks: PageBlocks, key: string, fallback: T[]): T[] {
  const value = blocks[key];
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}
