import type { Product, ProductVariant } from '@/types/product';

/**
 * Mental Health bundle pricing (Intro Offer):
 *   1× $19.95 | 2× $35.95 | 3× $51.95 | 4× $67.95
 * Intro price: $19.95 (was $24.95)
 * Savings = $3.95 per additional unit beyond the first.
 */
function makeMHVariants(name: string, basePrice: number): ProductVariant[] {
  const bundleTotals = [basePrice, 35.95, 51.95, 67.95];
  return bundleTotals.map((total, i) => {
    const qty = i + 1;
    const rrp = basePrice * qty;
    const discountPct = qty > 1 ? Math.round(((rrp - total) / rrp) * 100) : 0;
    return {
      id: qty === 1 ? 'single' : `bundle-${qty}`,
      label:
        qty === 1
          ? 'One-time purchase'
          : qty === 4
            ? `4 × ${name} (Complete Stock Bundle)`
            : `${qty} × ${name}`,
      quantity: qty,
      discountPercent: discountPct,
      unitPrice: parseFloat((total / qty).toFixed(2)),
      totalPrice: total,
    };
  });
}

function makeSingleVariant(price: number): ProductVariant[] {
  return [
    {
      id: 'single',
      label: 'One-time purchase',
      quantity: 1,
      discountPercent: 0,
      unitPrice: price,
      totalPrice: price,
    },
  ];
}

/** Post-treatment bundle: 15 % off when all three products are in the cart. */
export const POST_TREATMENT_BUNDLE = {
  productIds: ['post-surgery-care-cream', 'post-cosmetic-cream', 'post-lip-filler-balm'] as const,
  discountPercent: 15,
  label: 'Post Treatment Bundle Discount',
};

/* ── shared warning & disclaimer ──────────────────────────────── */

const MENTAL_HEALTH_WARNING = [
  'Always read the label and follow the directions for use.',
  'For external use only.',
  'Not to be taken orally.',
  'If symptoms persist consult your health practitioner.',
  'Avoid contact with eyes and open wounds.',
  'Do NOT replace cream with your medications.',
  'Should complement professional mental health treatment, not replace it.',
];

const MENTAL_HEALTH_DISCLAIMER = [
  'Our natural health products are designed to complement wellbeing and self-care. They are not intended to replace prescribed psychotherapy medications or ongoing psychotherapy sessions.',
  'It is essential that individuals continue to follow the treatment plan recommended by their healthcare providers, including psychiatrists, psychologists, and general practitioners. These professionals play a critical role in monitoring progress, adjusting care when needed, and ensuring safety.',
  'Natural products may provide supportive benefits, but they should always be used alongside — not as a substitute for — evidence-based medical treatments.',
  'If you are currently undergoing treatment or taking prescribed medication, please consult your healthcare professional before introducing any new products into your routine.',
];

const POST_TREATMENT_WARNING = [
  'For external use only.',
  'Patch test recommended before first use.',
  'Avoid contact with eyes.',
  'Consult your healthcare provider if pregnant or breastfeeding.',
  'Not a substitute for medical treatment.',
  'Store in a cool, dry place away from direct sunlight.',
];

export const products: Product[] = [
  // ── Mental Health Range ───────────────────────────────────────
  {
    id: 'focus-and-clarity',
    slug: 'focus-and-clarity',
    name: 'Focus & Clarity',
    description: 'A unique blend of homeopathic remedies and natural oils, designed to enhance mental sharpness and concentration.',
    longDescription: 'Focus and Clarity Cream is a unique blend of homeopathic remedies and natural oils, designed to enhance mental sharpness and concentration. This product harnesses the power of nature to support cognitive function, helping you stay focused, productive, and mentally clear throughout the day.',
    price: 19.95,
    originalPrice: 24.95,
    category: 'mental-health',
    image: '/assets/focus-clarity.jpg',
    ingredients: [
      {
        name: 'Lycopodium',
        description: 'A homeopathic remedy derived from the spores of the clubmoss plant, often used to support mental clarity and focus. It is believed to help individuals experiencing mental fatigue, lack of confidence, or difficulty concentrating. Lycopodium is known for its ability to enhance cognitive function and promote a sense of calm.',
        image: '/assets/ingredients/lycopodium.jpg',
      },
      {
        name: 'Baryta Carbonica',
        description: 'A homeopathic remedy that supports focus and clarity by addressing mental fog and forgetfulness. It also promotes emotional balance, improving confidence and decisiveness. Commonly used for developmental delays and age-related cognitive decline, this remedy offers holistic support for mental sharpness and clarity.',
      },
      {
        name: 'Kali Phosphoricum',
        description: 'A homeopathic remedy that supports focus and clarity by enhancing memory, concentration, and mental sharpness. It helps reduce stress and nervous tension, revitalises the nervous system, and is ideal for mental exhaustion caused by overwork or emotional strain.',
      },
      {
        name: 'Lavender Floral Water',
        description: 'Known for its calming properties, lavender floral water helps improve concentration by reducing stress and anxiety. It promotes better sleep quality, which in turn supports mental clarity and focus during the day.',
        image: '/assets/ingredients/lavender.jpg',
      },
      {
        name: 'Sage Oil',
        description: 'Stimulates the brain to enhance focus and concentration. It helps reduce mental fatigue and is rich in antioxidants that support overall cognitive health.',
        image: '/assets/ingredients/sage-oil.jpg',
      },
      {
        name: 'Lemon Floral Water',
        description: 'With its fresh citrus aroma, lemon floral water stimulates the mind and uplifts mood. It helps reduce mental fatigue and promotes a sense of alertness and clarity.',
        image: '/assets/ingredients/lemon-floral.jpg',
      },
      {
        name: 'Orange Floral Water',
        description: 'An uplifting citrus aroma that reduces stress and anxiety while boosting mood and energy levels. It helps create a positive and focused mindset.',
        image: '/assets/ingredients/orange-floral.png',
      },
    ],
    usage: 'Apply a small amount of cream to your temples, chest, and wrists. These areas are especially receptive to calming and clarifying effects. Take a moment to breathe deeply and allow the cream to absorb — about 20 minutes is ideal. You can reapply as needed, up to four times a day, for continued support.\n\nIf symptoms persist or feel overwhelming, it\'s always best to check in with your healthcare practitioner to make sure you\'re getting the care you need.',
    size: '30g bottle',
    variants: makeMHVariants('Focus & Clarity Cream', 19.95),
    maxQuantity: 4,
    warning: MENTAL_HEALTH_WARNING,
    disclaimer: MENTAL_HEALTH_DISCLAIMER,
  },
  {
    id: 'grief',
    slug: 'grief',
    name: 'Grief',
    description: 'A gentle, nurturing blend of natural oils and homeopathic remedies designed to provide comfort and emotional support during times of loss and sadness.',
    longDescription: 'Our Grief relief cream is a gentle, nurturing blend of natural oils and homeopathic remedies designed to provide comfort and emotional support during times of loss and sadness. This carefully formulated product combines traditional homeopathic principles with aromatherapy to create a soothing experience that supports emotional healing.',
    price: 19.95,
    originalPrice: 24.95,
    category: 'mental-health',
    image: '/assets/grief.jpg',
    ingredients: [
      {
        name: 'Ignatia Amara',
        description: 'A homeopathic remedy derived from St. Ignatius bean seeds, used to support emotional healing during grief and loss. It helps ease feelings of sadness, emotional shock, and the sense of heaviness that accompanies bereavement.',
        image: '/assets/ingredients/ignatia-amara.png',
      },
      {
        name: 'Natrum Muriaticum',
        description: 'A gentle remedy for navigating grief that helps release suppressed emotions, eases heartbreak and loneliness, and addresses physical symptoms like fatigue or headaches that often accompany emotional distress.',
      },
      {
        name: 'Neroli Oil',
        description: 'An essential oil from bitter orange blossoms, powerful for emotional healing during grief. Its calming and uplifting aroma reduces sadness and anxiety, and helps lower stress hormones like cortisol.',
      },
      {
        name: 'Ylang Ylang',
        description: 'A deeply soothing essential oil for grief comfort. Its sweet floral aroma balances emotions and calms the heart, promoting a sense of peace and acceptance.',
        image: '/assets/ingredients/ylang-ylang.jpg',
      },
      {
        name: 'Rose Oil',
        description: 'A deeply comforting essential oil for emotional healing. Its gentle floral aroma soothes the heart and reduces sadness, promoting emotional resilience and self-compassion.',
        image: '/assets/ingredients/rose-oil.png',
      },
    ],
    usage: 'Gently massage a small amount of the cream onto temples, chest, and wrists. Allow 20 minutes, then reapply as needed. The product can be used up to 4 times a day for ongoing support.\n\nFor persistent symptoms, consult with your healthcare practitioner to ensure your wellbeing.',
    size: '30g bottle',
    variants: makeMHVariants('Grief Cream', 19.95),
    maxQuantity: 4,
    warning: MENTAL_HEALTH_WARNING,
    disclaimer: MENTAL_HEALTH_DISCLAIMER,
  },
  {
    id: 'mild-anxiety',
    slug: 'mild-anxiety',
    name: 'Mild Anxiety',
    description: 'A calming blend of homeopathic remedies and essential oils designed to help soothe everyday stress and mild anxiety naturally.',
    longDescription: 'Our Mild Anxiety relief cream harnesses the calming properties of nature to help manage everyday stress and mild anxiety. The combination of carefully selected homeopathic remedies and essential oils creates a deeply relaxing experience that promotes a sense of peace and tranquility.',
    price: 19.95,
    originalPrice: 24.95,
    category: 'mental-health',
    image: '/assets/mild-anxiety.jpg',
    ingredients: [
      {
        name: 'Argentum Nitricum',
        description: 'A homeopathic remedy from silver nitrate, effective for managing anticipatory anxiety, performance anxiety, and panic attacks. It also addresses fears of heights, crowds, and enclosed spaces.',
        image: '/assets/ingredients/lycopodium.jpg',
      },
      {
        name: 'Arsenicum Album',
        description: 'A homeopathic remedy for anxiety with restlessness and fear. Used for health anxiety and fear of being alone, it helps with excessive worry about small matters and promotes a sense of calm.',
      },
      {
        name: 'Kali Phosphoricum',
        description: 'Known for its calming effects on the nervous system, helping manage anxiety and stress. Particularly beneficial for mental exhaustion and irritability from overwork or emotional strain.',
      },
      {
        name: 'Bergamot Oil',
        description: 'Known for its calming and uplifting properties, bergamot oil reduces stress and anxiety by promoting relaxation and improving mood.',
        image: '/assets/ingredients/bergamot.jpg',
      },
      {
        name: 'Ylang Ylang',
        description: 'An essential oil with calming and mood-enhancing properties that helps reduce anxiety and improves overall well-being.',
        image: '/assets/ingredients/ylang-ylang.jpg',
      },
      {
        name: 'Clary Sage',
        description: 'With calming and soothing properties, clary sage reduces anxiety and stress. It promotes relaxation and improves sleep quality by easing nervous tension.',
        image: '/assets/ingredients/clary-sage.jpg',
      },
    ],
    usage: 'Gently massage a small amount of the cream onto temples, chest, and wrists. Allow 20 minutes, then reapply as needed. The product can be used up to 4 times a day for ongoing support.\n\nFor persistent symptoms, consult with your healthcare practitioner to ensure your wellbeing.',
    size: '30g bottle',
    variants: makeMHVariants('Mild Anxiety Cream', 19.95),
    maxQuantity: 4,
    warning: MENTAL_HEALTH_WARNING,
    disclaimer: MENTAL_HEALTH_DISCLAIMER,
  },
  {
    id: 'mild-depression',
    slug: 'mild-depression',
    name: 'Mild Depression',
    description: 'An uplifting blend of homeopathic remedies and essential oils formulated to help brighten mood and support emotional well-being naturally.',
    longDescription: 'Our Mild Depression relief cream is crafted with mood-lifting essential oils and homeopathic remedies to help brighten your day naturally. This carefully formulated blend promotes emotional well-being and a positive outlook, supporting you through low periods with the power of nature.',
    price: 19.95,
    originalPrice: 24.95,
    category: 'mental-health',
    image: '/assets/mild-depression.jpg',
    ingredients: [
      {
        name: 'Pulsatilla',
        description: 'Derived from the pasqueflower, this homeopathic remedy addresses emotional imbalances including depression symptoms. It is suited for mood swings and tearfulness, providing gentle and nurturing effects.',
        image: '/assets/ingredients/lycopodium.jpg',
      },
      {
        name: 'Ignatia Amara',
        description: 'From St. Ignatius bean seeds, widely used for depression linked to grief or emotional shock. Often referred to as "Natural Prozac" for its ability to address suppressed emotions.',
      },
      {
        name: 'Natrum Muriaticum',
        description: 'A homeopathic remedy from sodium chloride, used for depression linked to grief and emotional sensitivity. Suited for those who prefer solitude and tend to suppress their feelings.',
      },
      {
        name: 'Kali Phosphoricum',
        description: 'Renowned for emotional and mental wellbeing support, particularly for depression from exhaustion or overwork. Known as a "nerve tonic" for its ability to calm the nervous system.',
      },
      {
        name: 'Lavender Oil',
        description: 'Helps with depression by improving mood, reducing stress and anxiety, and promoting better sleep quality.',
        image: '/assets/ingredients/lavender.jpg',
      },
      {
        name: 'Chamomile Oil',
        description: 'Relieves anxiety and stress, improves mood, and promotes restful sleep — all of which are essential for managing mild depression.',
        image: '/assets/ingredients/chamomile.jpg',
      },
      {
        name: 'Ginger Oil',
        description: 'Provides mental health support with its warming and stimulating properties that uplift mood and reduce feelings of sadness.',
        image: '/assets/ingredients/ginger-oil.jpg',
      },
    ],
    usage: 'Apply a small amount of cream to temples, chest, and wrists. These areas are especially receptive to calming and clarifying effects. Take a moment to breathe deeply and allow the cream to absorb — about 20 minutes is ideal. You can reapply as needed, up to four times a day.\n\nIf symptoms persist, consult with your healthcare practitioner to ensure proper care.',
    size: '30g bottle',
    variants: makeMHVariants('Mild Depression Cream', 19.95),
    maxQuantity: 4,
    warning: MENTAL_HEALTH_WARNING,
    disclaimer: MENTAL_HEALTH_DISCLAIMER,
  },

  // ── Post Treatment Skincare Range ─────────────────────────────
  {
    id: 'post-cosmetic-cream',
    slug: 'post-cosmetic-cream',
    name: 'Post Cosmetic Cream',
    description: 'Specially formulated to aid the skin\'s natural recovery process after cosmetic procedures such as Botox, fillers, and laser treatments.',
    longDescription: 'Our Post Cosmetic Cream is specially formulated to aid the skin\'s natural recovery process following cosmetic procedures. Enriched with homeopathic remedies and natural botanical ingredients, this gentle cream helps soothe irritation, reduce redness and swelling, and promote healthy skin recovery after treatments like Botox, dermal fillers, laser therapy, and chemical peels.',
    price: 49.96,
    category: 'post-treatment',
    image: '/assets/post-cosmetic-cream.jpg',
    ingredients: [
      {
        name: 'Calendula',
        description: 'A powerful homeopathic remedy known for its anti-inflammatory and healing properties. Calendula helps soothe irritation, reduce redness, and promote the natural regeneration of skin tissue.',
        image: '/assets/ingredients/calendula.jpg',
      },
      {
        name: 'Ginger Infusion',
        description: 'Rich in antioxidants, ginger enhances circulation and aids in reducing swelling, while also providing a subtle warming effect to comfort the skin.',
      },
      {
        name: 'Frangipani Extract',
        description: 'Known for its deeply hydrating and rejuvenating properties, frangipani adds a touch of luxury while helping to calm and restore balance to the skin.',
      },
      {
        name: 'Arnica Montana',
        description: 'A flowering herb used for centuries for healing. It reduces bruising and swelling from injuries and surgeries, eases muscle pain, and has powerful anti-inflammatory properties.',
        image: '/assets/ingredients/arnica.jpg',
      },
    ],
    usage: 'Apply a small amount to clean, dry skin over the treated area, gently massaging until absorbed. Can be used up to 4 times a day.',
    size: '30g bottle',
    variants: makeSingleVariant(49.96),
    warning: POST_TREATMENT_WARNING,
  },
  {
    id: 'post-lip-filler-balm',
    slug: 'post-lip-filler-balm',
    name: 'Post Lip Filler Balm',
    description: 'A healing lip balm specifically designed for post lip filler care, providing nourishment and supporting the natural healing process.',
    longDescription: 'Our Post Lip Filler Balm is perfect for post-lip treatment recovery and daily nourishment. Specially formulated with healing natural ingredients, this balm provides intense hydration while supporting the natural healing process after lip filler procedures. Helps reduce swelling, stinging, and discomfort.',
    price: 6.95,
    category: 'post-treatment',
    image: '/assets/post-lip-balm.jpg',
    ingredients: [
      {
        name: 'Calendula Coconut Oil',
        description: 'A soothing base ingredient that combines the healing properties of calendula with the nourishing benefits of coconut oil for post-procedure lip care.',
      },
      {
        name: 'Lanolin',
        description: 'A naturally derived moisturiser that provides deep hydration and creates a protective barrier on the lips.',
      },
      {
        name: 'Almond Sweet Oil',
        description: 'A gentle, nourishing oil that softens and hydrates the delicate skin of the lips.',
      },
      {
        name: 'Cocoa Butter',
        description: 'Rich and moisturising, cocoa butter helps protect and heal dry or damaged lip tissue.',
      },
      {
        name: 'Beeswax',
        description: 'A natural wax that locks in moisture and provides a protective barrier while allowing the skin to breathe.',
      },
      {
        name: 'Shea Butter',
        description: 'A deeply nourishing butter rich in vitamins A and E that promotes healing and hydration.',
      },
      {
        name: 'Vitamin E Acetate',
        description: 'A potent antioxidant that supports skin health, reduces inflammation, and helps protect against environmental damage.',
      },
    ],
    usage: 'Apply liberally to lips as needed. Especially recommended immediately after and in the days following lip filler procedures.',
    size: '10g',
    variants: makeSingleVariant(6.95),
    warning: POST_TREATMENT_WARNING,
  },
  {
    id: 'post-surgery-care-cream',
    slug: 'post-surgery-care-cream',
    name: 'Post Surgery Care Cream',
    description: 'An intensive recovery cream designed to support healing after surgical procedures, helping to reduce scarring, bruising, and inflammation.',
    longDescription: 'Our Post Surgery Care Cream is our most advanced post-treatment formulation, designed to support the body\'s natural healing process following surgical procedures. This intensive cream combines powerful homeopathic remedies with botanical extracts to help reduce scarring, bruising, swelling, and inflammation while promoting healthy tissue regeneration.',
    price: 69.95,
    category: 'post-treatment',
    image: '/assets/post-surgery-care.jpg',
    ingredients: [
      {
        name: 'Calendula',
        description: 'Also known as Calendula officinalis or "pot marigold," a vibrant flowering plant celebrated for its healing properties. Its anti-inflammatory action reduces redness and swelling, accelerates skin repair for cuts, burns, and abrasions, provides antimicrobial protection, and deeply hydrates and rejuvenates the skin.',
        image: '/assets/ingredients/calendula.jpg',
      },
      {
        name: 'Arnica Montana',
        description: 'A flowering herb used for centuries for healing. It reduces bruising and swelling from injuries and surgeries, eases muscle pain and soreness, contains helenalin for powerful anti-inflammatory effects, and supports wound healing in diluted forms.',
        image: '/assets/ingredients/arnica.jpg',
      },
      {
        name: 'Ginger Infusion',
        description: 'Rich in antioxidants, ginger enhances circulation, reduces swelling, and provides a subtle warming effect to comfort and soothe the skin.',
      },
      {
        name: 'Frangipani Extract',
        description: 'Known for its deeply hydrating and rejuvenating properties, frangipani helps calm and restore balance to the skin during the recovery process.',
      },
    ],
    usage: 'Apply a thin layer to clean skin around the surgical area twice daily or as directed by your practitioner. Do not apply to open wounds or stitches. Wait until initial healing is complete.',
    size: '50ml bottle',
    variants: makeSingleVariant(69.95),
    warning: POST_TREATMENT_WARNING,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}
