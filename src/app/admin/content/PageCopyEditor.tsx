'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { savePageOverrides } from '../actions';
import type { PageCopySpec } from '@/lib/pageCopyRegistry';
import ListFieldEditor from './ListFieldEditor';
import MediaPicker from '@/components/admin/MediaPicker';

const inputCls =
  'w-full px-3 py-2 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]';

const sameAsDefault = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function PageCopyEditor({
  slug,
  pages,
  spec,
  defaults,
  saved,
}: {
  slug: string;
  pages: { slug: string; label: string; path: string }[];
  spec: PageCopySpec;
  defaults: Record<string, unknown>;
  saved: Record<string, unknown>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Text fields hold the override only, so an empty box means "use the original", with the
  // original shown as the placeholder. Lists have to be seeded with real content to edit.
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      spec.fields.filter((f) => f.type !== 'list').map((f) => [f.key, typeof saved[f.key] === 'string' ? (saved[f.key] as string) : ''])
    )
  );
  const [lists, setLists] = useState<Record<string, unknown[]>>(() =>
    Object.fromEntries(
      spec.fields
        .filter((f) => f.type === 'list')
        .map((f) => [f.key, Array.isArray(saved[f.key]) ? (saved[f.key] as unknown[]) : ((defaults[f.key] as unknown[]) ?? [])])
    )
  );

  const groups = [...new Set(spec.fields.map((f) => f.group))];

  function save(nextTexts = texts, nextLists = lists) {
    const blocks: Record<string, unknown> = {};

    for (const field of spec.fields) {
      if (field.type === 'list') {
        const items = (nextLists[field.key] ?? []).filter((item) =>
          typeof item === 'string'
            ? item.trim() !== ''
            : Object.values((item ?? {}) as Record<string, unknown>).some((v) => (typeof v === 'string' ? v.trim() !== '' : v !== undefined))
        );
        if (items.length === 0) continue;                       // nothing ⇒ fall back to the original list
        if (sameAsDefault(items, defaults[field.key])) continue; // unchanged ⇒ don't store a copy
        blocks[field.key] = items;
      } else {
        const raw = (nextTexts[field.key] ?? '').trim();
        if (raw && raw !== defaults[field.key]) blocks[field.key] = raw;
      }
    }

    startTransition(async () => {
      const result = await savePageOverrides(slug, blocks);
      if (result.ok) {
        toast.success('Saved. The website is updated.');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <select
          value={slug}
          onChange={(e) => router.push(`/admin/content?page=${e.target.value}`)}
          className={`${inputCls} max-w-xs`}
        >
          {pages.map((p) => (
            <option key={p.slug} value={p.slug}>{p.label}</option>
          ))}
        </select>
        <a href={spec.path} target="_blank" rel="noreferrer" className="text-sm text-[#1a3a8f] hover:underline">
          View page ↗
        </a>
      </div>

      <div className="space-y-6 max-w-2xl">
        {groups.map((group) => (
          <div key={group} className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{group}</h2>

            {spec.fields.filter((f) => f.group === group).map((field) => {
              if (field.type === 'list') {
                const changed = !sameAsDefault(lists[field.key], defaults[field.key]);
                return (
                  <div key={field.key} className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {field.label}
                        {changed && <span className="ml-2 text-xs font-normal text-[#7c3aed]">edited</span>}
                      </span>
                      <button
                        type="button"
                        disabled={!changed}
                        onClick={() => {
                          if (!window.confirm('Put this list back to the original wording? Your changes to it will be lost.')) return;
                          setLists({ ...lists, [field.key]: (defaults[field.key] as unknown[]) ?? [] });
                        }}
                        className="text-xs text-gray-500 hover:underline cursor-pointer disabled:text-gray-300 disabled:no-underline disabled:cursor-default"
                      >
                        Reset to original
                      </button>
                    </div>
                    <ListFieldEditor
                      value={lists[field.key] ?? []}
                      onChange={(next) => setLists({ ...lists, [field.key]: next })}
                      itemFields={field.itemFields}
                      addLabel={field.itemFields?.some((f) => f.key === 'question') ? 'Add question' : 'Add item'}
                    />
                  </div>
                );
              }

              const placeholder = typeof defaults[field.key] === 'string' ? (defaults[field.key] as string) : '';
              const isOverridden = (texts[field.key] ?? '').trim() !== '';

              if (field.type === 'image') {
                return (
                  <div key={field.key} className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {field.label}
                        {isOverridden && <span className="ml-2 text-xs font-normal text-[#7c3aed]">changed</span>}
                      </span>
                      <button
                        type="button"
                        disabled={!isOverridden}
                        onClick={() => {
                          const next = { ...texts, [field.key]: '' };
                          setTexts(next);
                          save(next);
                        }}
                        className="text-xs text-gray-500 hover:underline cursor-pointer disabled:text-gray-300 disabled:no-underline disabled:cursor-default"
                      >
                        Reset to original
                      </button>
                    </div>
                    <MediaPicker
                      label=""
                      prefix="pages"
                      value={texts[field.key] || placeholder}
                      onChange={(url) => setTexts({ ...texts, [field.key]: url })}
                    />
                  </div>
                );
              }

              return (
                <div key={field.key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={field.key} className="text-sm font-medium">{field.label}</label>
                    {isOverridden && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = { ...texts, [field.key]: '' };
                          setTexts(next);
                          save(next);
                        }}
                        className="text-xs text-gray-500 hover:underline cursor-pointer"
                      >
                        Reset to original
                      </button>
                    )}
                  </div>
                  {field.type === 'text' ? (
                    <input
                      id={field.key}
                      value={texts[field.key] ?? ''}
                      placeholder={placeholder}
                      onChange={(e) => setTexts({ ...texts, [field.key]: e.target.value })}
                      className={inputCls}
                    />
                  ) : (
                    <textarea
                      id={field.key}
                      rows={3}
                      value={texts[field.key] ?? ''}
                      placeholder={placeholder}
                      onChange={(e) => setTexts({ ...texts, [field.key]: e.target.value })}
                      className={inputCls}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button
        onClick={() => save()}
        disabled={pending}
        className="h-11 px-6 rounded-md bg-[#1a3a8f] text-white font-semibold disabled:opacity-50 cursor-pointer"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}
