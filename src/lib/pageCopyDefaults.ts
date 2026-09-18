import { faqSections } from '@/data/testimonials';

const FAQ_BOTANICAL = faqSections.find((s) => s.category === 'Botanical Aid')?.items ?? [];
const FAQ_HOMEOPATHY = faqSections.find((s) => s.category === 'Homeopathy')?.items ?? [];

/**
 * Single source of truth for the wording on the hardcoded pages.
 *
 * The pages render `text(b, 'key', D.key)`; the admin Page Wording editor shows these
 * as the placeholder for each field. Change a default here and both move together —
 * the editor keeps showing "(default)" for anyone who hasn't overridden that field.
 */

export const PAGE_COPY_DEFAULTS = {
  global: {
    announcement_bar: 'FREE Shipping for orders over $99',
    phone_number: '1300 895 132',
    free_shipping_threshold: '99',
  },

  home: {
    meta_title: 'Botanical Aid | Natural Wellness Products',
    meta_description:
      'Botanical Aid offers natural wellness products including mental health balms for anxiety, grief, depression & focus, plus post-treatment skincare for cosmetic surgery recovery.',
    hero_slide1_headline: 'Healing Through ',
    hero_slide1_subheadline: "Nature's Touch",
    hero_slide1_description: 'Soothe your soul and skin with our plant-based care.',
    hero_slide2_headline: 'Botanical Aid. Pure',
    hero_slide2_subheadline: 'Care. Naturally',
    hero_slide2_description: 'Soothe your soul and skin with our plant-based care.',
    hero_slide3_headline: 'Pure Care,',
    hero_slide3_subheadline: 'Naturally',
    hero_slide3_description: 'Homeopathic blends and botanical oils, made in Australia.',
    hero_cta_label: 'SHOP NOW',
    category_heading: 'Gentle remedies for your body & mind',
    images_hero_slide1_image: '/assets/banner04.webp',
    images_hero_slide1_mobile_image: '/assets/banner04mobile.png',
    images_hero_slide2_image: '/assets/banner02.webp',
    images_hero_slide2_mobile_image: '/assets/banner02mobile.png',
    images_mental_health_circle_image: '/assets/category-mental-health.png',
    images_post_treatment_circle_image: '/assets/category-post-treatment.png',
    images_why_choose_us_image: '/assets/why-choose-us.jpg',
    about_eyebrow: 'About',
    about_heading: 'About Botanical Aid',
    about_body:
      'At Botanical Aid, we believe in the power of nature to nurture and heal. Our products are lovingly formulated with pure, natural ingredients to enhance therapeutic effects, the way nature intended.',
  },

  'mental-health-range': {
    meta_title: 'Mental Health Range | Botanical Aid',
    meta_description:
      "Explore Botanical Aid's Mental Health range — natural homeopathic balms and creams to support anxiety, grief, depression, focus and emotional well-being.",
    hero_badge: 'MENTAL HEALTH RANGE',
    hero_h1: 'Find The Light And Set Your Mind Free With Botanical Aid.',
    hero_intro:
      'Our Mental Health range allow you to experience the profound healing that natural remedies provide, helping you achieve a balanced, harmonious, and healthier life.',
    hero_cta_label: 'EXPLORE',
    products_heading: 'Mental Health Range',
  },

  products: {
    meta_title: 'Shop Natural Wellness Products | Botanical Aid',
    meta_description:
      "Browse Botanical Aid's full range of natural wellness products. Mental health balms for anxiety, grief, depression & focus. Post-treatment skincare for cosmetic surgery recovery.",
    hero_title: 'Shop',
    products_heading: 'Our Products',
    products_intro: 'Explore our full range of natural wellness products.',
  },

  faq: {
    meta_title: 'FAQs | Botanical Aid',
    meta_description:
      'Answers to common questions about Botanical Aid mental health balms, post-treatment skincare and homeopathy.',
    page_heading: 'FAQ – Frequently Asked Questions',
    page_intro:
      'Botanical aid and natural products harness the power of plant-based ingredients to support health and wellness. These remedies, derived from herbs, roots, and essential oils, have been used for centuries to promote balance and vitality.',
    botanical_items: FAQ_BOTANICAL,
    homeopathy_items: FAQ_HOMEOPATHY,
  },

  'post-treatment-skincare': {
    meta_title: 'Post Treatment Skincare | Botanical Aid',
    meta_description:
      'Post-treatment skincare for cosmetic surgery and injectable recovery — soothing, plant-based creams and balms made in Australia.',
    hero_badge: 'POST TREATMENT SKINCARE',
    hero_h1: 'Comfort For Today, Confidence Tomorrow',
    hero_intro:
      'Our Post Treatment range is formulated to support your skin through recovery, soothing and nourishing it when it needs it most.',
    hero_cta_label: 'EXPLORE',
    products_heading: 'Post Treatment Skincare',
  },
} as const;

export type PageCopySlug = keyof typeof PAGE_COPY_DEFAULTS;
export type PageCopyDefaults = Record<string, unknown>;

export const PAGE_COPY_DEFAULTS_MAP: Record<string, PageCopyDefaults> =
  PAGE_COPY_DEFAULTS as unknown as Record<string, PageCopyDefaults>;
