import type { Product, ProductVariant, Ingredient } from '@/types/product';
import { products as staticProducts } from '@/data/products';
import { createClient } from '@supabase/supabase-js';

/**
 * Anon, cookie-free client: these reads are public, and staying out of cookies()
 * keeps the storefront statically renderable. Admin writes call revalidatePath(),
 * so edits still appear straight away.
 */
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Storefront product reads.
 *
 * Source of truth is Supabase (edited in /admin). If the table is empty or
 * unreachable we fall back to the hardcoded list in src/data/products.ts so the
 * shop never renders empty — that fallback is also what runs before the seed
 * script has been run.
 *
 * Public `id` is the slug, not the uuid, because the cart, the bundle rules and
 * the old static data all key off the slug.
 */

type VariantRow = {
  variant_key: string | null;
  name: string;
  quantity: number;
  discount_percent: number | string;
  price: number | string;
  total_price: number | string | null;
  sort_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price: number | string;
  original_price: number | string | null;
  category: 'mental-health' | 'post-treatment';
  image_url: string | null;
  ingredients: Ingredient[] | null;
  usage_instructions: string;
  size: string;
  max_quantity: number | null;
  warnings: string[] | null;
  disclaimers: string[] | null;
  sort_order: number;
  product_variants: VariantRow[] | null;
};

const num = (v: number | string | null | undefined, fallback = 0): number =>
  v === null || v === undefined ? fallback : typeof v === 'number' ? v : parseFloat(v);

function mapVariant(row: VariantRow, productPrice: number): ProductVariant {
  const quantity = row.quantity || 1;
  const unitPrice = num(row.price, productPrice);
  return {
    id: row.variant_key || `variant-${row.sort_order}`,
    label: row.name,
    quantity,
    discountPercent: num(row.discount_percent),
    unitPrice,
    totalPrice: num(row.total_price, unitPrice * quantity),
  };
}

function mapProduct(row: ProductRow): Product {
  const price = num(row.price);
  const variants = (row.product_variants ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => mapVariant(v, price));

  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    price,
    originalPrice: row.original_price === null ? undefined : num(row.original_price),
    category: row.category,
    image: row.image_url ?? '',
    ingredients: row.ingredients ?? [],
    usage: row.usage_instructions,
    size: row.size,
    variants: variants.length
      ? variants
      : [{ id: 'single', label: 'One-time purchase', quantity: 1, discountPercent: 0, unitPrice: price, totalPrice: price }],
    maxQuantity: row.max_quantity ?? undefined,
    warning: row.warnings?.length ? row.warnings : undefined,
    disclaimer: row.disclaimers?.length ? row.disclaimers : undefined,
  };
}

const SELECT = `
  id, slug, name, description, long_description, price, original_price, category,
  image_url, ingredients, usage_instructions, size, max_quantity, warnings,
  disclaimers, sort_order,
  product_variants ( variant_key, name, quantity, discount_percent, price, total_price, sort_order )
`;

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from('products')
      .select(SELECT)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data?.length) return staticProducts;
    return (data as unknown as ProductRow[]).map(mapProduct);
  } catch {
    return staticProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from('products')
      .select(SELECT)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) return staticProducts.find((p) => p.slug === slug);
    return mapProduct(data as unknown as ProductRow);
  } catch {
    return staticProducts.find((p) => p.slug === slug);
  }
}
