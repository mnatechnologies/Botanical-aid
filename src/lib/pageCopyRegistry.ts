import { PAGE_COPY_DEFAULTS_MAP, type PageCopyDefaults } from '@/lib/pageCopyDefaults';

/**
 * Field specs for the admin Page Wording editor.
 *
 * Specs are derived from PAGE_COPY_DEFAULTS, so adding a default to a page makes a
 * field appear in the editor with no registry edit. Hand-written entries in
 * HAND_WRITTEN override the derived ones where a page needs nicer labels or grouping.
 */

export type CopyFieldType = 'text' | 'textarea' | 'list' | 'image';

export interface ItemField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'boolean';
}

export interface CopyField {
  key: string;
  label: string;
  type: CopyFieldType;
  group: string;
  itemFields?: ItemField[];
}

export interface PageCopySpec {
  slug: string;
  label: string;
  path: string;
  fields: CopyField[];
}

const FIELD_LABELS: Record<string, string> = {
  images_hero_slide1_image: 'Hero slide 1 — picture',
  images_hero_slide1_mobile_image: 'Hero slide 1 — picture on phones',
  images_hero_slide2_image: 'Hero slide 2 — picture',
  images_hero_slide2_mobile_image: 'Hero slide 2 — picture on phones',
  images_mental_health_circle_image: 'Mental Health circle',
  images_post_treatment_circle_image: 'Post Treatment circle',
  images_why_choose_us_image: 'Why Choose Us picture',
};

const PAGE_LABELS: Record<string, { label: string; path: string }> = {
  global: { label: 'Site-wide', path: '/' },
  home: { label: 'Home page', path: '/' },
  'mental-health-range': { label: 'Mental Health Range', path: '/mental-health-range' },
  'post-treatment-skincare': { label: 'Post Treatment Skincare', path: '/post-treatment-skincare' },
  products: { label: 'Shop page', path: '/products' },
  faq: { label: 'FAQs', path: '/faq' },
};

const GROUP_LABELS: Record<string, string> = {
  images: 'Pictures',
  botanical: 'Questions — Botanical Aid',
  homeopathy: 'Questions — Homeopathy',
  page: 'Page',
  meta: 'Search engines',
  hero: 'Hero',
  category: 'Categories',
  about: 'About section',
  products: 'Products',
  announcement: 'Site-wide',
  phone: 'Site-wide',
  free: 'Site-wide',
};

function humanize(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b(h1|cta|seo)\b/gi, (m) => m.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function autoField(key: string, value: unknown): CopyField {
  const prefix = key.split('_')[0];
  const group = GROUP_LABELS[prefix] ?? humanize(prefix);

  if (Array.isArray(value)) {
    let itemFields: ItemField[] | undefined;
    const first = value[0];
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      itemFields = Object.entries(first as Record<string, unknown>).map(([k, v]) => ({
        key: k,
        label: humanize(k),
        type:
          typeof v === 'boolean'
            ? ('boolean' as const)
            : typeof v === 'string' && v.length > 60
              ? ('textarea' as const)
              : ('text' as const),
      }));
    }
    return { key, label: humanize(key), type: 'list', group, itemFields };
  }

  if (/(_image|_photo|_banner)$/.test(key)) {
    return { key, label: FIELD_LABELS[key] ?? humanize(key), type: 'image', group };
  }

  const str = typeof value === 'string' ? value : '';
  const longish = str.length > 60 || /(body|intro|description|para|answer|note)/.test(key);
  return { key, label: humanize(key), type: longish ? 'textarea' : 'text', group };
}

/** Visual order; anything not listed falls to the end in its own order. */
const FIELD_ORDER = [
  'meta_title',
  'meta_description',
  'announcement_bar',
  'phone_number',
  'free_shipping_threshold',
  'hero_badge',
  'hero_h1',
  'hero_intro',
  'hero_slide1_headline',
  'hero_slide1_subheadline',
  'hero_slide1_description',
  'hero_slide2_headline',
  'hero_slide2_subheadline',
  'hero_slide2_description',
  'hero_slide3_headline',
  'hero_slide3_subheadline',
  'hero_slide3_description',
  'hero_cta_label',
  'category_heading',
  'products_heading',
  'about_eyebrow',
  'about_heading',
  'about_body',
  'images_hero_slide1_image',
  'images_hero_slide1_mobile_image',
  'images_hero_slide2_image',
  'images_hero_slide2_mobile_image',
  'images_mental_health_circle_image',
  'images_post_treatment_circle_image',
  'images_why_choose_us_image',
];

function orderFields(fields: CopyField[]): CopyField[] {
  return [...fields].sort((a, b) => {
    const ai = FIELD_ORDER.indexOf(a.key);
    const bi = FIELD_ORDER.indexOf(b.key);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function autoSpec(slug: string, defaults: PageCopyDefaults): PageCopySpec {
  const meta = PAGE_LABELS[slug] ?? { label: humanize(slug), path: `/${slug}` };
  return {
    slug,
    label: meta.label,
    path: meta.path,
    fields: orderFields(Object.entries(defaults).map(([key, value]) => autoField(key, value))),
  };
}

export const PAGE_COPY_REGISTRY: Record<string, PageCopySpec> = Object.fromEntries(
  Object.entries(PAGE_COPY_DEFAULTS_MAP).map(([slug, defaults]) => [slug, autoSpec(slug, defaults)])
);

export const PAGE_COPY_SLUGS = Object.keys(PAGE_COPY_REGISTRY);

export function isKnownCopySlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(PAGE_COPY_REGISTRY, slug);
}

export function defaultsFor(slug: string): PageCopyDefaults {
  return PAGE_COPY_DEFAULTS_MAP[slug] ?? {};
}
