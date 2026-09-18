'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MediaPicker from '@/components/admin/MediaPicker';
import { updateProduct, saveProductIngredients, saveProductVariants } from '../../actions';

export type IngredientValue = { name: string; description: string; image?: string };
export type VariantValue = {
  variant_key: string;
  name: string;
  quantity: number;
  discount_percent: number;
  price: number;
  total_price: number;
};

export type ProductFormValues = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  original_price: string;
  size: string;
  usage_instructions: string;
  stock: number;
  is_active: boolean;
  image_url: string;
  warnings: string;
  disclaimers: string;
  ingredients: IngredientValue[];
  variants: VariantValue[];
};

const field = 'w-full px-3 py-2 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]';
const smallBtn = 'px-2 py-1 text-xs rounded border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer';

function Label({ htmlFor, children, help }: { htmlFor?: string; children: React.ReactNode; help?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm font-medium block">{children}</label>
      {help && <p className="text-xs text-gray-500">{help}</p>}
    </div>
  );
}

export default function ProductForm({ product }: { product: ProductFormValues }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(product.image_url);
  const [ingredients, setIngredients] = useState<IngredientValue[]>(product.ingredients);
  const [variants, setVariants] = useState<VariantValue[]>(product.variants);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const details = await updateProduct(product.id, formData);
      if (!details.ok) {
        toast.error(details.error);
        return;
      }

      const ing = await saveProductIngredients(product.id, ingredients.filter((i) => i.name.trim() !== ''));
      if (!ing.ok) {
        toast.error(ing.error);
        return;
      }

      if (variants.length > 0) {
        const vars = await saveProductVariants(product.id, variants);
        if (!vars.ok) {
          toast.error(vars.error);
          router.refresh();
          return;
        }
      }

      toast.success('Saved. The website is updated.');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[2fr_1fr] items-start">
      <div className="space-y-6">
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name">Product name</Label>
            <input id="name" name="name" defaultValue={product.name} required className={field} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Price ($)</Label>
              <input id="price" name="price" type="number" step="0.01" min="0" defaultValue={product.price} required className={field} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="original_price" help="Shown crossed out. Blank for none.">Was price ($)</Label>
              <input id="original_price" name="original_price" type="number" step="0.01" min="0" defaultValue={product.original_price} className={field} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="size" help="e.g. 50ml bottle">Size</Label>
              <input id="size" name="size" defaultValue={product.size} className={field} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" help="The one-liner under the product name.">Short description</Label>
            <textarea id="description" name="description" rows={2} defaultValue={product.description} className={field} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="long_description">Full description</Label>
            <textarea id="long_description" name="long_description" rows={6} defaultValue={product.long_description} className={field} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="usage_instructions">How to use</Label>
            <textarea id="usage_instructions" name="usage_instructions" rows={4} defaultValue={product.usage_instructions} className={field} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="warnings" help="One per line.">Warnings</Label>
            <textarea id="warnings" name="warnings" rows={5} defaultValue={product.warnings} className={field} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="disclaimers" help="One paragraph per line.">Disclaimer</Label>
            <textarea id="disclaimers" name="disclaimers" rows={5} defaultValue={product.disclaimers} className={field} />
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600">Advanced</summary>
            <div className="mt-3 space-y-1">
              <Label htmlFor="slug" help="The web address of this product. Changing it breaks existing links.">Web address (slug)</Label>
              <input id="slug" name="slug" defaultValue={product.slug} className={field} />
            </div>
          </details>
        </div>

        {/* Ingredients */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
          <Label help="Shown on the product page. Drag-free ordering: use the arrows.">Ingredients</Label>

          {ingredients.map((ingredient, i) => (
            <div key={i} className="border border-dashed border-[#e5e7eb] rounded p-3 space-y-3">
              <div className="flex gap-2">
                <input
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => setIngredients(ingredients.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  className={field}
                />
                <button type="button" className={smallBtn} disabled={i === 0}
                  onClick={() => { const next = [...ingredients]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; setIngredients(next); }}>↑</button>
                <button type="button" className={smallBtn} disabled={i === ingredients.length - 1}
                  onClick={() => { const next = [...ingredients]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; setIngredients(next); }}>↓</button>
                <button type="button" className={`${smallBtn} text-red-600`}
                  onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}>×</button>
              </div>

              <textarea
                rows={2}
                placeholder="What it does"
                value={ingredient.description}
                onChange={(e) => setIngredients(ingredients.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                className={field}
              />

              <MediaPicker
                label="Ingredient photo"
                prefix="ingredients"
                value={ingredient.image ?? ''}
                onChange={(url) => setIngredients(ingredients.map((x, j) => (j === i ? { ...x, image: url } : x)))}
              />
            </div>
          ))}

          <button type="button" className={smallBtn}
            onClick={() => setIngredients([...ingredients, { name: '', description: '', image: '' }])}>
            + Add ingredient
          </button>
        </div>

        {/* Variants / bundle pricing */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
          <Label help="What the customer can pick in the Add to bag menu. Total is what they pay for that quantity.">
            Purchase options
          </Label>

          {variants.length === 0 && (
            <p className="text-sm text-gray-500">No options yet — customers buy a single unit at the price above.</p>
          )}

          {variants.map((variant, i) => (
            <div key={`${variant.variant_key}-${i}`} className="border border-dashed border-[#e5e7eb] rounded p-3 grid sm:grid-cols-[2fr_repeat(3,1fr)_auto] gap-2 items-end">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Label</span>
                <input value={variant.name} onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, name: e.target.value } : v)))} className={field} />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Quantity</span>
                <input type="number" min="1" value={variant.quantity}
                  onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, quantity: Number(e.target.value) } : v)))} className={field} />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Price each</span>
                <input type="number" step="0.01" min="0" value={variant.price}
                  onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, price: Number(e.target.value) } : v)))} className={field} />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Total</span>
                <input type="number" step="0.01" min="0" value={variant.total_price}
                  onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, total_price: Number(e.target.value) } : v)))} className={field} />
              </div>
              <button type="button" className={`${smallBtn} text-red-600 h-9`} onClick={() => setVariants(variants.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}

          <button
            type="button"
            className={smallBtn}
            onClick={() => {
              const quantity = (variants.at(-1)?.quantity ?? 0) + 1;
              const base = quantity === 1 ? 'single' : `bundle-${quantity}`;
              const taken = new Set(variants.map((v) => v.variant_key));
              let key = base;
              while (taken.has(key)) key = `${key}-2`;
              setVariants([...variants, {
                variant_key: key,
                name: quantity === 1 ? 'One-time purchase' : `${quantity} × ${product.name}`,
                quantity,
                discount_percent: 0,
                price: product.price,
                total_price: Number((product.price * quantity).toFixed(2)),
              }]);
            }}
          >
            + Add purchase option
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
          <MediaPicker label="Product photo" prefix={product.slug} value={imageUrl} onChange={setImageUrl} />
          <input type="hidden" name="image_url" value={imageUrl} />
          <p className="text-xs text-gray-500">Use a square photo at least 1000 × 1000 pixels.</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="stock">Stock on hand</Label>
            <input id="stock" name="stock" type="number" min="0" defaultValue={product.stock} className={field} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked={product.is_active} className="w-4 h-4" />
            Show this product on the website
          </label>
        </div>

        <button type="submit" disabled={pending} className="w-full h-11 rounded-md bg-[#1a3a8f] text-white font-semibold disabled:opacity-50 cursor-pointer">
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
