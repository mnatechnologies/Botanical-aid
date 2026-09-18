'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { listMedia, uploadMedia, type MediaItem } from '@/app/admin/actions';

/**
 * Pick an image already in storage, or upload a new one. Used for product photos,
 * ingredient thumbnails and images inside page blocks, so nobody has to paste a URL.
 */
export default function MediaPicker({
  value,
  onChange,
  prefix,
  label = 'Image',
}: {
  value: string;
  onChange: (url: string) => void;
  prefix: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || items !== null) return;
    startTransition(async () => {
      const own = await listMedia(prefix);
      const shared = prefix === 'pages' ? [] : await listMedia('pages');
      setItems([...own, ...shared]);
    });
  }, [open, items, prefix]);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error('Choose an image first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.set('file', file);
    const result = await uploadMedia(prefix, formData);
    setUploading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (result.url) {
      onChange(result.url);
      setItems(null);           // refetch so the new file appears in the list
      toast.success('Image uploaded');
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-gray-600">{label}</span>

      <div className="flex items-start gap-3">
        <div className="relative w-24 h-24 flex-none rounded border border-[#e5e7eb] bg-gray-50 overflow-hidden">
          {value ? (
            <Image src={value} alt="" fill sizes="96px" className="object-contain p-1" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-400">No image</span>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 text-sm rounded border border-[#1a3a8f] text-[#1a3a8f] cursor-pointer">
              {open ? 'Close' : 'Choose image'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="px-3 py-1.5 text-sm rounded border border-[#e5e7eb] text-gray-600 cursor-pointer">
                Remove
              </button>
            )}
          </div>

          {open && (
            <div className="border border-[#e5e7eb] rounded p-3 space-y-3 bg-gray-50">
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="text-xs flex-1" />
                <button type="button" onClick={upload} disabled={uploading} className="px-3 py-1.5 text-sm rounded bg-[#1a3a8f] text-white disabled:opacity-50 cursor-pointer">
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>

              {items === null && <p className="text-xs text-gray-500">Loading images…</p>}
              {items?.length === 0 && <p className="text-xs text-gray-500">Nothing uploaded yet.</p>}

              {items && items.length > 0 && (
                <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto">
                  {items.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => { onChange(item.url); setOpen(false); }}
                      title={item.name}
                      className={`relative aspect-square rounded border bg-white overflow-hidden cursor-pointer ${value === item.url ? 'border-[#1a3a8f] ring-2 ring-[#1a3a8f]' : 'border-[#e5e7eb]'}`}
                    >
                      <Image src={item.url} alt="" fill sizes="80px" className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image address"
            className="w-full px-3 py-1.5 rounded-md border border-[#e5e7eb] text-xs focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]"
          />
        </div>
      </div>
    </div>
  );
}
