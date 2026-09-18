'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SectionsEditor from '@/components/SectionsEditor';
import type { PageSection } from '@/lib/pageSections';
import { createPage, updatePage, type PageInput } from '../actions';

const inputCls =
  'w-full px-3 py-2 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]';

export type PageFormValues = {
  id?: string;
  title: string;
  slug: string;
  hero_subtitle: string;
  meta_title: string;
  meta_description: string;
  custom_css: string;
  published: boolean;
  sections: PageSection[];
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function PageForm({
  initial,
  products,
}: {
  initial: PageFormValues;
  products: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<PageFormValues>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  const set = <K extends keyof PageFormValues>(key: K, value: PageFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input: PageInput = {
      title: form.title,
      slug: form.slug,
      hero_subtitle: form.hero_subtitle,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      custom_css: form.custom_css,
      published: form.published,
      sections: form.sections,
    };

    startTransition(async () => {
      const result = form.id ? await updatePage(form.id, input) : await createPage(input);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(form.published ? 'Saved and live on the site.' : 'Saved as a draft.');
      if (!form.id && result.id) router.push(`/admin/pages/${result.id}`);
      else router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium block">Page title</label>
          <input
            id="title" required value={form.title}
            onChange={(e) => {
              set('title', e.target.value);
              if (!slugTouched) set('slug', slugify(e.target.value));
            }}
            className={inputCls}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="slug" className="text-sm font-medium block">Web address</label>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">botanicalaid.com.au/</span>
            <input
              id="slug" required value={form.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
              className={inputCls}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="hero_subtitle" className="text-sm font-medium block">Line under the title</label>
          <input id="hero_subtitle" value={form.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Page content</h2>
        <SectionsEditor value={form.sections} onChange={(next) => set('sections', next)} productSlugs={products} />
      </div>

      <details className="bg-white border border-[#e5e7eb] rounded-lg p-6">
        <summary className="cursor-pointer text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Search engines and styling
        </summary>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label htmlFor="meta_title" className="text-sm font-medium block">Title in search results</label>
            <input id="meta_title" value={form.meta_title} placeholder={form.title} onChange={(e) => set('meta_title', e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <label htmlFor="meta_description" className="text-sm font-medium block">Description in search results</label>
            <textarea id="meta_description" rows={2} value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <label htmlFor="custom_css" className="text-sm font-medium block">Custom CSS for this page</label>
            <p className="text-xs text-gray-500">
              Each block above shows its own hook, e.g. <code>.cms-section--faq</code>. Leave blank unless you know CSS.
            </p>
            <textarea id="custom_css" rows={6} value={form.custom_css} onChange={(e) => set('custom_css', e.target.value)} className={`${inputCls} font-mono text-xs`} />
          </div>
        </div>
      </details>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4" />
          Published — visible on the website
        </label>
        <button type="submit" disabled={pending} className="h-11 px-6 rounded-md bg-[#1a3a8f] text-white font-semibold disabled:opacity-50 cursor-pointer">
          {pending ? 'Saving…' : 'Save page'}
        </button>
        {form.id && (
          <a href={`/admin/pages/${form.id}/preview`} target="_blank" rel="noreferrer" className="text-sm text-[#1a3a8f] hover:underline">
            Preview ↗
          </a>
        )}
        {form.published && form.slug && (
          <a href={`/${form.slug}`} target="_blank" rel="noreferrer" className="text-sm text-[#1a3a8f] hover:underline">
            View live page ↗
          </a>
        )}
      </div>
    </form>
  );
}
