'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { adjustStock } from './actions';

export default function StockControls({ productId, stock }: { productId: string; stock: number }) {
  const [value, setValue] = useState(stock);
  const [pending, startTransition] = useTransition();

  function change(delta: number) {
    startTransition(async () => {
      const result = await adjustStock(productId, delta);
      if (result.ok) {
        setValue((v) => Math.max(0, v + delta));
        toast.success('Stock updated');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => change(-1)} disabled={pending || value === 0}
        className="w-7 h-7 rounded border border-[#e5e7eb] disabled:opacity-40 cursor-pointer"
        aria-label="Reduce stock by one"
      >
        −
      </button>
      <span className={`w-10 text-center font-medium ${value === 0 ? 'text-red-600' : value < 10 ? 'text-orange-600' : ''}`}>
        {value}
      </span>
      <button
        onClick={() => change(1)} disabled={pending}
        className="w-7 h-7 rounded border border-[#e5e7eb] disabled:opacity-40 cursor-pointer"
        aria-label="Increase stock by one"
      >
        +
      </button>
    </div>
  );
}
