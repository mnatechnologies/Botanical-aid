import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import ProductForm, { type ProductFormValues, type IngredientValue, type VariantValue } from './ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  const [{ data }, { data: variantRows }] = await Promise.all([
    supabase
      .from('products')
      .select('id, slug, name, description, long_description, price, original_price, size, usage_instructions, stock, is_active, image_url, warnings, disclaimers, ingredients')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('product_variants')
      .select('variant_key, name, quantity, discount_percent, price, total_price, sort_order')
      .eq('product_id', id)
      .order('sort_order'),
  ]);

  if (!data) notFound();

  const ingredients: IngredientValue[] = Array.isArray(data.ingredients)
    ? (data.ingredients as Record<string, unknown>[]).map((i) => ({
        name: String(i.name ?? ''),
        description: String(i.description ?? ''),
        image: typeof i.image === 'string' ? i.image : '',
      }))
    : [];

  // Rows created before variant_key existed come back null; derive one and keep it unique,
  // because the save upserts on (product_id, variant_key).
  const usedKeys = new Set<string>();
  const uniqueKey = (candidate: string, index: number) => {
    let key = candidate;
    if (usedKeys.has(key)) key = `${candidate}-${index + 1}`;
    while (usedKeys.has(key)) key = `${key}x`;
    usedKeys.add(key);
    return key;
  };

  const variants: VariantValue[] = (variantRows ?? []).map((v, i) => ({
    variant_key: uniqueKey(
      (v.variant_key as string) || (Number(v.quantity ?? 1) === 1 ? 'single' : `bundle-${v.quantity}`),
      i
    ),
    name: v.name as string,
    quantity: Number(v.quantity ?? 1),
    discount_percent: Number(v.discount_percent ?? 0),
    price: Number(v.price ?? 0),
    total_price: Number(v.total_price ?? Number(v.price ?? 0) * Number(v.quantity ?? 1)),
    sort_order: i,
  })) as VariantValue[];

  const product: ProductFormValues = {
    id: data.id as string,
    slug: data.slug as string,
    name: data.name as string,
    description: (data.description as string) ?? '',
    long_description: (data.long_description as string) ?? '',
    price: Number(data.price),
    original_price: data.original_price === null ? '' : String(Number(data.original_price)),
    size: (data.size as string) ?? '',
    usage_instructions: (data.usage_instructions as string) ?? '',
    stock: Number(data.stock ?? 0),
    is_active: Boolean(data.is_active),
    image_url: (data.image_url as string) ?? '',
    warnings: ((data.warnings as string[]) ?? []).join('\n'),
    disclaimers: ((data.disclaimers as string[]) ?? []).join('\n'),
    ingredients,
    variants,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="text-sm text-[#1a3a8f] hover:underline">← Back to products</Link>
        <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className="text-sm text-[#1a3a8f] hover:underline">
          View on the site ↗
        </a>
      </div>
      <h1 className="text-2xl font-bold text-[#1a3a8f]">{product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
