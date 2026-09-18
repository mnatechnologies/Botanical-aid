'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { importStaticProducts } from './actions';

/**
 * Re-runnable: upserts by slug and re-uploads each product photo into the
 * product-images bucket. Existing edits to fields the import owns (name, price,
 * description, size, photo) are overwritten, which is why it confirms first.
 */
export default function ImportButton({ hasProducts }: { hasProducts: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run() {
    if (
      hasProducts &&
      !window.confirm(
        'Re-import the products from the website?\n\nThis overwrites the name, price, size, description and photo of each product with what is in the site code, and copies the photos into storage. Stock levels and hidden/visible settings are kept.'
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await importStaticProducts();
      if (result.ok) {
        toast.success(`Imported ${result.count} products and their photos`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <button
      onClick={run}
      disabled={pending}
      className={
        hasProducts
          ? 'h-10 px-4 rounded-md border border-[#1a3a8f] text-[#1a3a8f] text-sm font-semibold disabled:opacity-50 cursor-pointer'
          : 'h-10 px-4 rounded-md bg-[#1a3a8f] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer'
      }
    >
      {pending
        ? 'Importing…'
        : hasProducts
          ? 'Re-import products from the website'
          : 'Import products from the website'}
    </button>
  );
}
