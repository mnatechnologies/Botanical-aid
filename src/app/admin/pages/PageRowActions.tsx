'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setPagePublished, duplicatePage, deletePage } from '../actions';

const btn = 'px-3 py-1.5 text-sm rounded border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer disabled:opacity-50';

export default function PageRowActions({ id, published, title }: { id: string; published: boolean; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, success: string) =>
    startTransition(async () => {
      const result = await fn();
      if (result.ok) { toast.success(success); router.refresh(); }
      else toast.error(result.error ?? 'Something went wrong');
    });

  return (
    <div className="flex items-center gap-2 flex-none">
      <button className={btn} disabled={pending} onClick={() => run(() => setPagePublished(id, !published), published ? 'Page hidden' : 'Page published')}>
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <button className={btn} disabled={pending} onClick={() => run(() => duplicatePage(id), 'Copy created')}>
        Duplicate
      </button>
      <button
        className={`${btn} text-red-600`}
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
          run(() => deletePage(id), 'Page deleted');
        }}
      >
        Delete
      </button>
    </div>
  );
}
