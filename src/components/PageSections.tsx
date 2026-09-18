import Image from 'next/image';
import Link from 'next/link';
import type { PageSection } from '@/lib/pageSections';
import { markdownLiteToHtml } from '@/lib/markdownLite';
import type { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

/**
 * Renders CMS blocks. Every block gets stable class hooks — `.cms-section`,
 * `.cms-section--<type>`, `.cms-section--<type>-<n>` — so a page's Custom CSS can target
 * any individual block without a code change.
 */

const DEFAULT_BACKGROUND: Record<PageSection['type'], 'white' | 'cream'> = {
  markdown: 'white',
  cardGrid: 'cream',
  steps: 'white',
  checklist: 'white',
  faq: 'white',
  imageText: 'white',
  button: 'white',
  productGrid: 'cream',
};

const BG_CLASS = { white: 'bg-white', cream: 'bg-[#f7f9fb]' } as const;

/** "Pure **botanical** care" → brand-coloured span. */
function Accent({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <span key={i} className="cms-accent text-[#0d9488]">{part}</span> : part
      )}
    </>
  );
}

function Eyebrow({ text }: { text?: string }) {
  if (!text) return null;
  return <div className="cms-eyebrow text-xs font-bold tracking-widest uppercase text-[#7c3aed] mb-3">{text}</div>;
}

function Section({ section, children }: { section: PageSection; children: React.ReactNode }) {
  const bg = BG_CLASS[section.background ?? DEFAULT_BACKGROUND[section.type]];
  return (
    <section className={`py-12 ${bg}`}>
      <div className="container mx-auto px-4 lg:px-6">{children}</div>
    </section>
  );
}

function Heading({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <h2 className="text-2xl lg:text-3xl font-bold text-[#1a3a8f] mb-4">
      <Accent text={children} />
    </h2>
  );
}

export default function PageSections({
  sections,
  products = [],
}: {
  sections: PageSection[];
  products?: Product[];
}) {
  return (
    <>
      {sections.map((section, i) => {
        const typeIndex = sections.slice(0, i + 1).filter((s) => s.type === section.type).length;
        const cls = ['cms-section', `cms-section--${section.type}`, `cms-section--${section.type}-${typeIndex}`, section.className]
          .filter((c): c is string => Boolean(c))
          .join(' ');
        return (
          <div key={i} className={cls}>
            {renderBlock(section, products)}
          </div>
        );
      })}
    </>
  );
}

function renderBlock(section: PageSection, products: Product[]) {
  switch (section.type) {
    case 'markdown':
      return (
        <Section section={section}>
          <Eyebrow text={section.eyebrow} />
          <Heading>{section.heading}</Heading>
          <div
            className="prose max-w-3xl text-gray-700 leading-relaxed [&_h2]:text-[#1a3a8f] [&_h3]:text-[#1a3a8f] [&_a]:text-[#1a3a8f] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: markdownLiteToHtml(section.content) }}
          />
        </Section>
      );

    case 'cardGrid':
      return (
        <Section section={section}>
          <Eyebrow text={section.eyebrow} />
          <Heading>{section.heading}</Heading>
          {section.subheading && <p className="text-gray-600 mb-8 max-w-2xl">{section.subheading}</p>}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.cards.map((card, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                {card.icon && <div className="text-3xl mb-3">{card.icon}</div>}
                <h3 className="font-semibold text-[#1a3a8f] mb-2">{card.title}</h3>
                {card.description && <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>}
              </div>
            ))}
          </div>
          {section.footnote && <p className="text-xs text-gray-500 mt-6">{section.footnote}</p>}
        </Section>
      );

    case 'steps':
      return (
        <Section section={section}>
          <Eyebrow text={section.eyebrow} />
          <Heading>{section.heading}</Heading>
          {section.intro && <p className="text-gray-600 mb-8 max-w-2xl">{section.intro}</p>}
          <ol className="space-y-6 max-w-3xl">
            {section.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-none w-8 h-8 rounded-full bg-[#1a3a8f] text-white font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-[#1a3a8f]">{step.title}</h3>
                  {step.body && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{step.body}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      );

    case 'checklist':
      return (
        <Section section={section}>
          <Eyebrow text={section.eyebrow} />
          <Heading>{section.heading}</Heading>
          {section.intro && <p className="text-gray-600 mb-6 max-w-2xl">{section.intro}</p>}
          <ul className="space-y-3 max-w-2xl">
            {section.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span aria-hidden className="flex-none text-[#0d9488] font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      );

    case 'faq':
      return (
        <Section section={section}>
          <Eyebrow text={section.eyebrow} />
          <Heading>{section.heading}</Heading>
          <div className="max-w-3xl divide-y divide-gray-200 border-t border-b border-gray-200">
            {section.items.map((item, i) => (
              // <details> keeps answers in the DOM for search engines and needs no JS
              <details key={i} className="group py-4">
                <summary className="flex justify-between items-center cursor-pointer font-medium text-[#1a3a8f] list-none">
                  {item.question}
                  <span aria-hidden className="ml-4 text-xl leading-none group-open:hidden">+</span>
                  <span aria-hidden className="ml-4 text-xl leading-none hidden group-open:inline">−</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      );

    case 'imageText':
      return (
        <Section section={section}>
          <div className={`grid gap-8 lg:grid-cols-2 items-center ${section.imagePosition === 'right' ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50">
              <Image src={section.image} alt={section.imageAlt ?? ''} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div>
              <Eyebrow text={section.eyebrow} />
              <Heading>{section.heading}</Heading>
              {section.body && (
                <div
                  className="prose text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: markdownLiteToHtml(section.body) }}
                />
              )}
            </div>
          </div>
        </Section>
      );

    case 'button':
      return (
        <Section section={section}>
          <div className="text-center">
            <Link
              href={section.link}
              className="inline-block px-8 py-3 rounded text-white font-bold hover:brightness-110 transition-all"
              style={{ backgroundColor: '#1a3a8f' }}
            >
              {section.text}
            </Link>
          </div>
        </Section>
      );

    case 'productGrid': {
      const chosen = section.slugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is Product => Boolean(p));
      if (chosen.length === 0) return null;
      return (
        <Section section={section}>
          <Eyebrow text={section.eyebrow} />
          <Heading>{section.heading}</Heading>
          {section.intro && <p className="text-gray-600 mb-8 max-w-2xl">{section.intro}</p>}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {chosen.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      );
    }
  }
}
