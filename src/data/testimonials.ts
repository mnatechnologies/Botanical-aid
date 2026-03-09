export interface Testimonial {
  name: string;
  location: string;
  date: string;
  rating: number;
  quote: string;
  product: string;
  category: 'mental-health' | 'post-treatment';
}

export const testimonials: Testimonial[] = [
  // ── Mental Health Range — Anxiety Cream ──
  {
    name: 'Karen',
    location: 'NSW',
    date: 'June 2025',
    rating: 5,
    quote: 'A lifesaver for anxiety! I apply it before stressful meetings, and it helps me stay centered.',
    product: 'Anxiety Cream',
    category: 'mental-health',
  },
  {
    name: 'Rick',
    location: 'NSW',
    date: 'May 2025',
    rating: 5,
    quote: 'I was skeptical, but it truly helps! I feel calmer, my breathing slows, and I can refocus.',
    product: 'Anxiety Cream',
    category: 'mental-health',
  },
  {
    name: 'Belinda',
    location: 'SA',
    date: 'May 2025',
    rating: 5,
    quote: 'I carry this everywhere! Whether it\'s work stress or social anxiety, this cream helps me feel more in control. It absorbs quickly, smells amazing, and provides an immediate sense of relief.',
    product: 'Anxiety Cream',
    category: 'mental-health',
  },
  {
    name: 'Dan',
    location: 'NSW',
    date: 'April 2025',
    rating: 5,
    quote: 'I was caught in traffic and started to feel anxious so I used the cream and it calmed me down\u2026 never leaving home without it!',
    product: 'Anxiety Cream',
    category: 'mental-health',
  },
  // ── Mental Health Range — Grief Cream ──
  {
    name: 'Dave',
    location: 'VIC',
    date: 'May 2025',
    rating: 5,
    quote: 'This cream became a small but powerful part of my healing process. The scent and texture helped me feel comforted during difficult moments.',
    product: 'Grief Cream',
    category: 'mental-health',
  },
  {
    name: 'Jenny',
    location: 'SA',
    date: 'February 2025',
    rating: 5,
    quote: 'This cream provided a subtle but meaningful form of support in my grief journey. Its comforting scent and soothing ingredients helped bring moments of relief when my heart felt heavy from losing my fur baby.',
    product: 'Grief Cream',
    category: 'mental-health',
  },
  {
    name: 'Tereasa',
    location: 'NSW',
    date: 'February 2024',
    rating: 5,
    quote: 'A beautiful, nurturing product that brings comfort when words aren\'t enough when dealing with a break up.',
    product: 'Grief Cream',
    category: 'mental-health',
  },
  // ── Mental Health Range — Focus and Clarity Cream ──
  {
    name: 'Chez',
    location: 'SA',
    date: 'May 2025',
    rating: 5,
    quote: 'This helped me power through work with clear thinking and better attention to detail. Highly recommend!',
    product: 'Focus and Clarity Cream',
    category: 'mental-health',
  },
  {
    name: 'Raafat',
    location: 'NSW',
    date: 'May 2025',
    rating: 5,
    quote: 'I was feeling mentally scattered and needed something to help me refocus. After using this product, I noticed my thoughts became clearer, and I was able to concentrate for much longer without feeling drained. Perfect for intense work sessions!',
    product: 'Focus and Clarity Cream',
    category: 'mental-health',
  },
  // ── Mental Health Range — Depression Cream ──
  {
    name: 'Don',
    location: 'NSW',
    date: 'April 2025',
    rating: 5,
    quote: 'This cream became part of my self-care routine. The soothing scent and texture helped me feel more at ease on difficult days.',
    product: 'Depression Cream',
    category: 'mental-health',
  },
  {
    name: 'Maryanne',
    location: 'NSW',
    date: 'March 2025',
    rating: 5,
    quote: 'Not a cure, but definitely a support. The ritual of using it reminds me to slow down and take care of myself.',
    product: 'Depression Cream',
    category: 'mental-health',
  },
  {
    name: 'Nina',
    location: 'SA',
    date: 'February 2025',
    rating: 5,
    quote: 'During emotionally tough days, applying this cream gives me a sense of peace. The ingredients feel gentle, the experience feels nurturing, and it serves as a reminder to practice self-care in a way that actually helps.',
    product: 'Depression Cream',
    category: 'mental-health',
  },
  // ── Post Treatment Skincare — Post Cosmetic Cream ──
  {
    name: 'Maria',
    location: 'NSW',
    date: 'June 2025',
    rating: 5,
    quote: 'I\'ve tried several creams after cosmetic treatments, but this one stands out! The cream instantly soothed my post-laser redness, and within days, my skin looked even-toned and hydrated. Highly recommend!',
    product: 'Post Cosmetic Cream',
    category: 'post-treatment',
  },
  {
    name: 'Veronica',
    location: 'NSW',
    date: 'June 2025',
    rating: 5,
    quote: 'Collagen injections left my skin feeling slightly sensitive and sore but this cream worked wonders. It calmed irritation, improved skin texture, and gave me the perfect hydration boost!',
    product: 'Post Cosmetic Cream',
    category: 'post-treatment',
  },
  {
    name: 'Robert',
    location: 'NSW',
    date: 'May 2025',
    rating: 5,
    quote: 'Skin removal laser treatment leaves my skin feeling dry, red and irritated I had various creams to help but nothing works as good as PCC',
    product: 'Post Cosmetic Cream',
    category: 'post-treatment',
  },
  // ── Post Treatment Skincare — Post Lip Filler Balm ──
  {
    name: 'Danielle',
    location: 'NSW',
    date: 'June 2025',
    rating: 5,
    quote: 'I normally get swelling and stinging after lip fillers, after using post lip filler balm the stinging went away and was very hydrating and soothing\u2014no more dryness or tightness.',
    product: 'Post Lip Filler Balm',
    category: 'post-treatment',
  },
  {
    name: 'Tanya',
    location: 'VIC',
    date: 'May 2025',
    rating: 5,
    quote: 'A must-have for post-filler care! My lips felt nourished, and the healing process was so much smoother.',
    product: 'Post Lip Filler Balm',
    category: 'post-treatment',
  },
  {
    name: 'Andrea',
    location: 'SA',
    date: 'April 2025',
    rating: 5,
    quote: 'I was worried about irritation, but this balm kept my lips soft and protected. Definitely part of my routine now!',
    product: 'Post Lip Filler Balm',
    category: 'post-treatment',
  },
  {
    name: 'Veronica',
    location: 'NSW',
    date: 'March 2025',
    rating: 5,
    quote: 'Lightweight, non-sticky, and incredibly soothing. My lips healed beautifully!',
    product: 'Post Lip Filler Balm',
    category: 'post-treatment',
  },
  {
    name: 'Pat',
    location: 'NSW',
    date: 'February 2025',
    rating: 5,
    quote: 'The perfect post-filler product! No cracking, no discomfort\u2014just smooth, healthy lips. I continue to use this as my every day lip balm.',
    product: 'Post Lip Filler Balm',
    category: 'post-treatment',
  },
  // ── Post Treatment Skincare — Post Surgery Care Cream ──
  {
    name: 'Victoria',
    location: 'NSW',
    date: 'June 2025',
    rating: 5,
    quote: 'I had to undergo lipedema surgery on my outer thigh and knees and using the cream made a huge difference the bruises faded much faster and the swelling was noticeable reduced.',
    product: 'Post Surgery Care Cream',
    category: 'post-treatment',
  },
  {
    name: 'Bernadette',
    location: 'NSW',
    date: 'May 2025',
    rating: 5,
    quote: 'I underwent a whole body tuck and used different restorative creams however nothing was more effective with my recovery than the post surgery cream it worked wonders on my healing process.',
    product: 'Post Surgery Care Cream',
    category: 'post-treatment',
  },
  {
    name: 'Rose',
    location: 'VIC',
    date: 'April 2025',
    rating: 5,
    quote: 'Six months after surgery, my incision was still red, raised, and sensitive. After using this cream, the redness disappeared, the area smoothed out, and the scar became barely noticeable. My skin now feels healthy and even\u2014I\'m so impressed with the results!',
    product: 'Post Surgery Care Cream',
    category: 'post-treatment',
  },
];

export const faqSections = [
  {
    category: 'Botanical Aid',
    items: [
      {
        question: 'What are mental health balms, and how do they work?',
        answer:
          'Our mental health balms are crafted with a blend of homeopathic remedies and natural essential oils designed to support emotional well being. They work by promoting relaxation, reducing stress, and encouraging a sense of calm when applied to pulse points or used in mindfulness practices.',
      },
      {
        question: 'Are these balms safe for children?',
        answer:
          'Yes, our mental health balms are formulated with gentle, natural ingredients. However, we recommend consulting a healthcare professional before using them on children, especially if your child has known sensitivities.',
      },
      {
        question: 'How do I use mental health balms?',
        answer:
          'Simply apply a small amount to your pulse points (e.g., wrists, temples, or behind the ears) or massage onto your chest. The soothing aroma and therapeutic properties work best when inhaled deeply during moments of stress or anxiety.',
      },
      {
        question: 'What are post-cosmetic surgery creams, and how can they help?',
        answer:
          'Our post-cosmetic surgery creams are specially formulated to aid the skin\'s natural recovery process. Enriched with homeopathic ingredients and nourishing oils, they help soothe the skin, reduce inflammation, and promote healing after surgical procedures.',
      },
      {
        question: 'Are your products free from harmful chemicals?',
        answer:
          'Absolutely! All our products are made with pure, natural ingredients and are free from parabens, sulfates, artificial fragrances, and harsh chemicals.',
      },
      {
        question: 'Can the post-surgery cream be used on sensitive skin?',
        answer:
          'Yes, our creams are designed with sensitive skin in mind, using gentle, non-irritating ingredients to support your skin\'s recovery. We always recommend performing a patch test before applying it to larger areas.',
      },
      {
        question: 'Are your products vegan and cruelty-free?',
        answer:
          'Yes, we take pride in creating products that are both vegan and cruelty-free, ensuring ethical and sustainable practices.',
      },
      {
        question: 'How soon after surgery can I use the post-cosmetic surgery cream?',
        answer:
          'We recommend consulting your surgeon or healthcare provider before using any topical product after surgery. Generally, our creams can be used once your skin has begun to heal and your healthcare professional approves.',
      },
      {
        question: 'What makes your products different from others?',
        answer:
          'Our products combine the wisdom of homeopathy with the power of natural ingredients to create holistic remedies that nurture the mind, body, and skin. Every formulation is crafted with care to provide safe, effective, and ethical solutions for your well-being.',
      },
      {
        question: 'Where can I purchase your products?',
        answer:
          'You can purchase our products directly from our website or through selected retailers.',
      },
      {
        question: 'Can I use your mental health balms alongside other treatments?',
        answer:
          'Yes, our mental health balms can be used as a complementary approach to existing treatments. However, if you\'re under medical care, we recommend discussing this with your healthcare provider.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Yes, we currently ship all over the world, however currency exchange and delivery will alter.',
      },
      {
        question: 'What is your refund policy?',
        answer:
          'We are confident in the quality of our products. However, if you encounter any issues, please refer to our Returns Policy for details on claims and refunds.',
      },
      {
        question: 'What should I do if symptoms persist or worsen?',
        answer:
          'If symptoms persist or worsen, it is important to seek guidance from a healthcare professional or specialist. While our products are designed to support well-being, they should not replace professional medical care for serious or ongoing conditions.',
      },
    ],
  },
  {
    category: 'Homeopathy',
    items: [
      {
        question: 'What is homeopathy?',
        answer:
          'Homeopathy is a holistic system of medicine based on the principle of "like cures like." It uses highly diluted natural substances to stimulate the body\'s own healing mechanisms.',
      },
      {
        question: 'How does homeopathy work?',
        answer:
          'Homeopathy works by activating the body\'s self-healing processes. Remedies are carefully selected based on the individual\'s symptoms and overall health, aiming to restore balance and well-being.',
      },
      {
        question: 'What are homeopathic remedies made from?',
        answer:
          'Homeopathic remedies are derived from natural sources such as plants, minerals, and animal substances. They are diluted and prepared using precise methods to ensure safety and effectiveness.',
      },
      {
        question: 'Is homeopathy safe?',
        answer:
          'Yes, homeopathy is generally safe when used correctly. Remedies are highly diluted, making them non-toxic and suitable for people of all ages, including children and pregnant women.',
      },
      {
        question: 'What conditions can homeopathy treat?',
        answer:
          'Homeopathy can support a wide range of conditions, including stress, anxiety, allergies, digestive issues, skin problems, and chronic illnesses. It is often used as a complementary therapy alongside conventional medicine.',
      },
      {
        question: 'How are homeopathic remedies taken?',
        answer:
          'Homeopathic remedies are typically taken in the form of small pellets, tablets, liquid drops, or creams. The dosage and frequency depend on the individual\'s condition and should be guided by a qualified homeopath.',
      },
      {
        question: 'Can I use homeopathy alongside conventional medicine?',
        answer:
          'Yes, homeopathy is often used as a complementary therapy. However, it\'s important to consult both your homeopath and healthcare provider to ensure safe and effective treatment.',
      },
      {
        question: 'How long does it take for homeopathy to work?',
        answer:
          'The time frame varies depending on the individual and condition being treated. Acute issues may respond quickly, while chronic conditions may take longer to improve.',
      },
      {
        question: 'Are homeopathic remedies regulated?',
        answer:
          'Yes, in many countries, including Australia, homeopathic remedies are regulated to ensure their quality, safety, and accuracy. Homeopathic remedies are regulated in Australia, but not in the same way as conventional medicines. They fall under the broader category of complementary medicines and are overseen by the Therapeutic Goods Administration (TGA), though the profession itself is largely self-regulated.',
      },
      {
        question: 'Is homeopathy suitable for children?',
        answer:
          'Absolutely! Homeopathy is gentle and non-invasive, making it an excellent option for treating children\'s physical and emotional health concerns.',
      },
      {
        question: 'What should I do if symptoms persist or worsen?',
        answer:
          'If symptoms persist or worsen, consult a qualified homeopath or healthcare professional for further guidance. Homeopathy aims to support, but serious conditions require proper medical attention.',
      },
    ],
  },
];
