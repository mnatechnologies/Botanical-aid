'use client';

import type { ItemField } from '@/lib/pageCopyRegistry';

/**
 * Repeater for a list field (FAQ questions, card rows, and anything else stored as an
 * array). Item shape comes from the registry's itemFields, which are derived from the
 * defaults — so a new list field gets a usable editor with no extra work here.
 */

const inputCls =
  'w-full px-3 py-2 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]';
const smallBtn =
  'px-2 py-1 text-xs rounded border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer disabled:opacity-40';

type Item = Record<string, unknown>;

export default function ListFieldEditor({
  value,
  onChange,
  itemFields,
  addLabel = 'Add item',
}: {
  value: unknown[];
  onChange: (next: unknown[]) => void;
  itemFields?: ItemField[];
  addLabel?: string;
}) {
  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  // list of plain strings
  if (!itemFields || itemFields.length === 0) {
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={String(item ?? '')}
              onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
              className={inputCls}
            />
            <button type="button" className={smallBtn} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" className={smallBtn} disabled={i === value.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" className={`${smallBtn} text-red-600`} onClick={() => remove(i)}>×</button>
          </div>
        ))}
        <button type="button" className={smallBtn} onClick={() => onChange([...value, ''])}>+ {addLabel}</button>
      </div>
    );
  }

  const blank: Item = Object.fromEntries(itemFields.map((f) => [f.key, f.type === 'boolean' ? false : '']));

  return (
    <div className="space-y-3">
      {(value as Item[]).map((item, i) => (
        <div key={i} className="border border-dashed border-[#e5e7eb] rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" className={smallBtn} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
              <button type="button" className={smallBtn} disabled={i === value.length - 1} onClick={() => move(i, 1)}>↓</button>
              <button type="button" className={`${smallBtn} text-red-600`} onClick={() => remove(i)}>Remove</button>
            </div>
          </div>

          {itemFields.map((field) => {
            const current = (item ?? {})[field.key];
            const update = (next: unknown) =>
              onChange(value.map((x, j) => (j === i ? { ...(x as Item), [field.key]: next } : x)));

            if (field.type === 'boolean') {
              return (
                <label key={field.key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={Boolean(current)} onChange={(e) => update(e.target.checked)} className="w-4 h-4" />
                  {field.label}
                </label>
              );
            }

            return (
              <label key={field.key} className="block space-y-1">
                <span className="text-xs font-medium text-gray-600">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea rows={3} value={String(current ?? '')} onChange={(e) => update(e.target.value)} className={inputCls} />
                ) : (
                  <input value={String(current ?? '')} onChange={(e) => update(e.target.value)} className={inputCls} />
                )}
              </label>
            );
          })}
        </div>
      ))}

      <button type="button" className={smallBtn} onClick={() => onChange([...value, { ...blank }])}>
        + {addLabel}
      </button>
    </div>
  );
}
