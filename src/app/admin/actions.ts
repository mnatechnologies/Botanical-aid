'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type ActionResult = { ok: true } | { ok: false; error: string };

const lines = (v: FormDataEntryValue | null): string[] =>
  String(v ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug can only use lowercase letters, numbers and hyphens'),
  description: z.string().max(1000),
  long_description: z.string().max(10000),
  price: z.number().nonnegative(),
  original_price: z.number().nonnegative().nullable(),
  size: z.string().max(100),
  usage_instructions: z.string().max(5000),
  stock: z.number().int().min(0),
  is_active: z.boolean(),
  image_url: z.string().max(500),
});

function revalidateStorefront(slug: string) {
  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/mental-health-range');
  revalidatePath('/post-treatment-skincare');
}

export async function updateProduct(productId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const rawPrice = Number(formData.get('price'));
  const rawOriginal = String(formData.get('original_price') ?? '').trim();

  const parsed = ProductSchema.safeParse({
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    description: String(formData.get('description') ?? ''),
    long_description: String(formData.get('long_description') ?? ''),
    price: rawPrice,
    original_price: rawOriginal === '' ? null : Number(rawOriginal),
    size: String(formData.get('size') ?? ''),
    usage_instructions: String(formData.get('usage_instructions') ?? ''),
    stock: Number(formData.get('stock') ?? 0),
    is_active: formData.get('is_active') === 'on',
    image_url: String(formData.get('image_url') ?? ''),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? 'Some fields need fixing.' };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('products')
    .update({
      ...parsed.data,
      warnings: lines(formData.get('warnings')),
      disclaimers: lines(formData.get('disclaimers')),
    })
    .eq('id', productId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateStorefront(parsed.data.slug);
  revalidatePath('/admin');
  return { ok: true };
}

/** Stock is also moved by the order trigger, so adjust by a delta rather than overwriting. */
export async function adjustStock(productId: string, delta: number): Promise<ActionResult> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data: current, error: readError } = await supabase
    .from('products')
    .select('stock, slug')
    .eq('id', productId)
    .single();

  if (readError || !current) return { ok: false, error: readError?.message ?? 'Product not found' };

  const next = Math.max(0, (current.stock as number) + delta);
  const { error } = await supabase.from('products').update({ stock: next }).eq('id', productId);
  if (error) return { ok: false, error: error.message };

  revalidateStorefront(current.slug as string);
  revalidatePath('/admin');
  return { ok: true };
}

export async function setProductActive(productId: string, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId)
    .select('slug')
    .single();

  if (error) return { ok: false, error: error.message };

  revalidateStorefront(data.slug as string);
  revalidatePath('/admin');
  return { ok: true };
}

export async function uploadProductImage(productId: string, formData: FormData): Promise<ActionResult & { url?: string }> {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose an image first.' };
  if (!file.type.startsWith('image/')) return { ok: false, error: 'That file is not an image.' };
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: 'Images must be under 8MB.' };

  const supabase = createSupabaseAdminClient();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);

  const { data, error } = await supabase
    .from('products')
    .update({ image_url: publicUrl })
    .eq('id', productId)
    .select('slug')
    .single();

  if (error) return { ok: false, error: error.message };

  revalidateStorefront(data.slug as string);
  revalidatePath('/admin');
  return { ok: true, url: publicUrl };
}

export async function updateSiteCopy(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const updates: { key: string; value: string }[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('copy:')) continue;
    updates.push({ key: key.slice(5), value: String(value) });
  }

  for (const { key, value } of updates) {
    const { error } = await supabase.from('site_copy').update({ value }).eq('key', key);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/copy');
  return { ok: true };
}

/**
 * One-off import: copies the products currently hardcoded in src/data/products.ts
 * into Supabase so the CMS starts with real data. Safe to re-run — it upserts by slug
 * and leaves any edits to columns it doesn't own alone.
 */

/** Absolute origin of this deployment, used to pull /public assets over HTTP. */
async function siteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

/**
 * Copies a bundled /public image into the product-images bucket so every product
 * photo lives in storage and can be replaced from the CMS. Returns the original
 * path unchanged if anything goes wrong — a missing photo must not fail the import.
 */
async function copyLocalImageToBucket(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  localPath: string,
  destination: string
): Promise<string> {
  if (!localPath || !localPath.startsWith('/')) return localPath;

  try {
    const res = await fetch(`${await siteOrigin()}${localPath}`);
    if (!res.ok) return localPath;

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const bytes = new Uint8Array(await res.arrayBuffer());
    const ext = (localPath.split('.').pop() || 'jpg').toLowerCase();
    const storagePath = `${destination}.${ext}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(storagePath, bytes, { contentType, upsert: true });
    if (error) return localPath;

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(storagePath);
    return publicUrl;
  } catch {
    return localPath;
  }
}

export async function importStaticProducts(): Promise<ActionResult & { count?: number }> {
  await requireAdmin();

  const { products: staticProducts } = await import('@/data/products');
  const supabase = createSupabaseAdminClient();
  let count = 0;

  for (const [index, product] of staticProducts.entries()) {
    const imageUrl = await copyLocalImageToBucket(supabase, product.image, `${product.slug}/imported`);

    // ingredient thumbnails move into storage too, so they can be replaced from the CMS
    const ingredients = await Promise.all(
      product.ingredients.map(async (ingredient) => ({
        ...ingredient,
        image: ingredient.image
          ? await copyLocalImageToBucket(
              supabase,
              ingredient.image,
              `ingredients/${ingredient.image.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ingredient.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            )
          : undefined,
      }))
    );
    const { data: row, error } = await supabase
      .from('products')
      .upsert(
        {
          slug: product.slug,
          name: product.name,
          description: product.description,
          long_description: product.longDescription,
          price: product.price,
          original_price: product.originalPrice ?? null,
          category: product.category,
          image_url: imageUrl,
          ingredients,
          usage_instructions: product.usage,
          size: product.size,
          symptoms: [],
          warnings: product.warning ?? [],
          disclaimers: product.disclaimer ?? [],
          max_quantity: product.maxQuantity ?? 10,
          sort_order: index,
          is_active: true,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (error || !row) return { ok: false, error: error?.message ?? 'Import failed' };

    for (const [vIndex, variant] of product.variants.entries()) {
      const { error: variantError } = await supabase.from('product_variants').upsert(
        {
          product_id: row.id,
          variant_key: variant.id,
          name: variant.label,
          quantity: variant.quantity,
          discount_percent: variant.discountPercent,
          price: variant.unitPrice,
          total_price: variant.totalPrice,
          sort_order: vIndex,
          is_default: vIndex === 0,
        },
        { onConflict: 'product_id,variant_key' }
      );
      if (variantError) return { ok: false, error: variantError.message };
    }

    count += 1;
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin');
  return { ok: true, count };
}

/* ── Page wording overrides ─────────────────────────────────── */

/**
 * Saves only the fields that differ from the in-code defaults. Unknown keys are dropped
 * and blank values are omitted, so clearing a field falls back to the default rather
 * than rendering an empty heading.
 */
export async function savePageOverrides(
  slug: string,
  blocks: Record<string, unknown>
): Promise<ActionResult> {
  await requireAdmin();

  const { PAGE_COPY_REGISTRY, isKnownCopySlug } = await import('@/lib/pageCopyRegistry');
  if (!isKnownCopySlug(slug)) return { ok: false, error: 'Unknown page' };

  const fieldByKey = new Map(PAGE_COPY_REGISTRY[slug].fields.map((f) => [f.key, f]));
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(blocks)) {
    const field = fieldByKey.get(key);
    if (!field) continue;
    if (field.type === 'list') {
      if (Array.isArray(value) && value.length > 0) clean[key] = value;
    } else if (typeof value === 'string' && value.trim().length > 0) {
      clean[key] = value;
    }
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('page_overrides')
    .upsert({ slug, blocks: clean, published: true }, { onConflict: 'slug' });

  if (error) return { ok: false, error: error.message };

  const { PAGE_COPY_REGISTRY: registry } = await import('@/lib/pageCopyRegistry');
  revalidatePath(registry[slug].path);
  if (slug === 'global') revalidatePath('/', 'layout');
  revalidatePath('/admin/content');
  return { ok: true };
}

/* ── CMS pages ──────────────────────────────────────────────── */

const PageSchema = z.object({
  title: z.string().min(1, 'Give the page a title').max(200),
  slug: z.string().min(1, 'Give the page a web address').max(200)
    .regex(/^[a-z0-9][a-z0-9-/]*$/, 'Web address can only use lowercase letters, numbers, hyphens and /'),
  hero_subtitle: z.string().max(500),
  meta_title: z.string().max(200),
  meta_description: z.string().max(500),
  custom_css: z.string().max(20000),
  published: z.boolean(),
});

export type PageInput = z.infer<typeof PageSchema> & { sections: unknown };

async function writePage(input: PageInput, id?: string): Promise<ActionResult & { id?: string }> {
  await requireAdmin();

  const parsed = PageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Some fields need fixing.' };

  // Reserved: these are real routes in the app and must not be shadowed by a CMS page.
  const RESERVED = ['admin', 'products', 'cart', 'checkout', 'about', 'contact', 'faq', 'privacy', 'terms', 'returns', 'testimonials', 'mental-health-range', 'post-treatment-skincare', 'api'];
  if (RESERVED.includes(parsed.data.slug.split('/')[0])) {
    return { ok: false, error: `"${parsed.data.slug}" clashes with an existing page on the site. Pick another web address.` };
  }

  const { parsePageSections } = await import('@/lib/pageSections');
  const sections = parsePageSections(input.sections);

  const supabase = createSupabaseAdminClient();
  const row = {
    ...parsed.data,
    meta_title: parsed.data.meta_title || null,
    meta_description: parsed.data.meta_description || null,
    custom_css: parsed.data.custom_css || null,
    hero_subtitle: parsed.data.hero_subtitle || null,
    sections,
  };

  const query = id
    ? supabase.from('pages').update(row).eq('id', id).select('id').single()
    : supabase.from('pages').insert(row).select('id').single();

  const { data, error } = await query;
  if (error) {
    if (error.code === '23505') return { ok: false, error: 'Another page already uses that web address.' };
    return { ok: false, error: error.message };
  }

  revalidatePath(`/${parsed.data.slug}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/pages');
  return { ok: true, id: data.id as string };
}

export async function createPage(input: PageInput) { return writePage(input); }
export async function updatePage(id: string, input: PageInput) { return writePage(input, id); }

export async function setPagePublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('pages').update({ published }).eq('id', id).select('slug').single();
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/${data.slug as string}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/pages');
  return { ok: true };
}

export async function duplicatePage(id: string): Promise<ActionResult & { id?: string }> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data: source, error: readError } = await supabase.from('pages').select('*').eq('id', id).single();
  if (readError || !source) return { ok: false, error: readError?.message ?? 'Page not found' };

  const suffix = Math.random().toString(36).slice(2, 6);
  const { data, error } = await supabase
    .from('pages')
    .insert({
      slug: `${source.slug}-copy-${suffix}`,
      title: `${source.title} (copy)`,
      hero_subtitle: source.hero_subtitle,
      sections: source.sections,
      meta_title: source.meta_title,
      meta_description: source.meta_description,
      custom_css: source.custom_css,
      published: false,
    })
    .select('id')
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/pages');
  return { ok: true, id: data.id as string };
}

export async function deletePage(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('pages').delete().eq('id', id).select('slug').single();
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/${data.slug as string}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/pages');
  return { ok: true };
}

/* ── Media library ──────────────────────────────────────────── */

export type MediaItem = { path: string; url: string; name: string };

/**
 * All site images live in the product-images bucket under a prefix:
 * `<product-slug>/` for product photos, `ingredients/`, `pages/` for page content.
 * (The bucket keeps its original name because renaming it would break live URLs.)
 */
const MEDIA_BUCKET = 'product-images';

export async function listMedia(prefix: string): Promise<MediaItem[]> {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(prefix, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

  if (error || !data) return [];

  return data
    .filter((f) => f.id !== null) // folders come back with a null id
    .map((file) => {
      const path = prefix ? `${prefix}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      return { path, url: publicUrl, name: file.name };
    });
}

export async function uploadMedia(prefix: string, formData: FormData): Promise<ActionResult & { url?: string }> {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose an image first.' };
  if (!file.type.startsWith('image/')) return { ok: false, error: 'That file is not an image.' };
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: 'Images must be under 8MB.' };

  const supabase = createSupabaseAdminClient();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
  const path = `${prefix ? `${prefix}/` : ''}${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: error.message };

  const { data: { publicUrl } } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { ok: true, url: publicUrl };
}

/* ── Ingredients and variants ───────────────────────────────── */

const IngredientSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  image: z.string().max(500).optional(),
});

const VariantSchema = z.object({
  variant_key: z.string().min(1).max(60),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
  discount_percent: z.number().min(0).max(100),
  price: z.number().nonnegative(),
  total_price: z.number().nonnegative(),
});

export type VariantInput = z.infer<typeof VariantSchema>;

export async function saveProductIngredients(productId: string, ingredients: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = z.array(IngredientSchema).safeParse(ingredients);
  if (!parsed.success) return { ok: false, error: 'Every ingredient needs a name.' };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .update({ ingredients: parsed.data })
    .eq('id', productId)
    .select('slug')
    .single();

  if (error) return { ok: false, error: error.message };

  revalidateStorefront(data.slug as string);
  return { ok: true };
}

/**
 * Variants are matched on variant_key, so bundle rows keep their identity (and their
 * link from past orders) across saves. Rows the admin removed are deleted, unless an
 * order still references them — those are left in place and reported.
 */
export async function saveProductVariants(productId: string, variants: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = z.array(VariantSchema).safeParse(variants);
  if (!parsed.success) {
    return { ok: false, error: 'Check the bundle rows — each needs a label, a quantity and prices.' };
  }

  const keys = parsed.data.map((v) => v.variant_key);
  if (new Set(keys).size !== keys.length) return { ok: false, error: 'Two bundles have the same key.' };

  const supabase = createSupabaseAdminClient();

  const { data: product, error: productError } = await supabase
    .from('products').select('slug').eq('id', productId).single();
  if (productError || !product) return { ok: false, error: productError?.message ?? 'Product not found' };

  const rows = parsed.data.map((v, i) => ({
    product_id: productId,
    variant_key: v.variant_key,
    name: v.name,
    quantity: v.quantity,
    discount_percent: v.discount_percent,
    price: v.price,
    total_price: v.total_price,
    sort_order: i,
    is_default: i === 0,
  }));

  const { error: upsertError } = await supabase
    .from('product_variants')
    .upsert(rows, { onConflict: 'product_id,variant_key' });
  if (upsertError) return { ok: false, error: upsertError.message };

  const { data: existing } = await supabase
    .from('product_variants').select('id, variant_key').eq('product_id', productId);

  const stale = (existing ?? []).filter((row) => !keys.includes(row.variant_key as string));
  let kept = 0;
  for (const row of stale) {
    const { error } = await supabase.from('product_variants').delete().eq('id', row.id);
    if (error?.code === '23503') kept += 1;      // referenced by an order line
    else if (error) return { ok: false, error: error.message };
  }

  revalidateStorefront(product.slug as string);

  if (kept > 0) {
    return { ok: false, error: `Saved, but ${kept} bundle${kept > 1 ? 's' : ''} could not be removed because past orders reference them.` };
  }
  return { ok: true };
}
