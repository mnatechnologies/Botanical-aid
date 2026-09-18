/**
 * Block model for CMS pages.
 *
 * `pages.sections` is jsonb, so nothing about its shape is guaranteed. Everything that
 * reads it goes through parsePageSections(), which drops anything malformed rather than
 * throwing: a bad block disappears, the page still renders. Adding a block type means
 * editing three files in this order — this one, PageSections.tsx, SectionsEditor.tsx.
 */

export type SectionBackground = 'white' | 'cream';

export interface CardItem { icon?: string; title: string; description?: string }
export interface StepItem { title: string; body?: string }
export interface FaqItem { question: string; answer: string }

interface SectionBase {
  background?: SectionBackground;
  className?: string;
  eyebrow?: string;
}

export interface MarkdownSection extends SectionBase { type: 'markdown'; heading?: string; content: string }
export interface CardGridSection extends SectionBase { type: 'cardGrid'; heading?: string; subheading?: string; cards: CardItem[]; footnote?: string }
export interface StepsSection extends SectionBase { type: 'steps'; heading?: string; intro?: string; steps: StepItem[] }
export interface ChecklistSection extends SectionBase { type: 'checklist'; heading?: string; intro?: string; items: string[] }
export interface FaqSection extends SectionBase { type: 'faq'; heading?: string; items: FaqItem[] }
export interface ImageTextSection extends SectionBase { type: 'imageText'; heading?: string; body?: string; image: string; imageAlt?: string; imagePosition?: 'left' | 'right' }
export interface ButtonSection extends SectionBase { type: 'button'; text: string; link: string }
export interface ProductGridSection extends SectionBase { type: 'productGrid'; heading?: string; intro?: string; slugs: string[] }

export type PageSection =
  | MarkdownSection
  | CardGridSection
  | StepsSection
  | ChecklistSection
  | FaqSection
  | ImageTextSection
  | ButtonSection
  | ProductGridSection;

export const SECTION_TYPES = [
  'markdown', 'cardGrid', 'steps', 'checklist', 'faq', 'imageText', 'button', 'productGrid',
] as const;

export const SECTION_TYPE_LABELS: Record<PageSection['type'], string> = {
  markdown: 'Text',
  cardGrid: 'Card grid',
  steps: 'Numbered steps',
  checklist: 'Checklist',
  faq: 'FAQ',
  imageText: 'Image + text',
  button: 'Button',
  productGrid: 'Products',
};

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const optStr = (v: unknown): string | undefined => {
  const s = str(v).trim();
  return s === '' ? undefined : s;
};
const background = (v: unknown): SectionBackground | undefined =>
  v === 'white' || v === 'cream' ? v : undefined;
const objects = (v: unknown): Record<string, unknown>[] =>
  (Array.isArray(v) ? v : []).filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x));

export function parsePageSections(value: unknown): PageSection[] {
  if (!Array.isArray(value)) return [];
  const sections: PageSection[] = [];

  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const s = raw as Record<string, unknown>;
    const base = {
      background: background(s.background),
      className: optStr(s.className),
      eyebrow: optStr(s.eyebrow),
    };

    switch (s.type) {
      case 'markdown': {
        const content = str(s.content);
        const heading = optStr(s.heading);
        if (content.trim() === '' && !heading) continue;
        sections.push({ type: 'markdown', heading, content, ...base });
        break;
      }
      case 'cardGrid': {
        const cards = objects(s.cards)
          .map((c) => ({ icon: optStr(c.icon), title: str(c.title), description: optStr(c.description) }))
          .filter((c) => c.title.trim() !== '');
        if (cards.length === 0) continue;
        sections.push({ type: 'cardGrid', heading: optStr(s.heading), subheading: optStr(s.subheading), cards, footnote: optStr(s.footnote), ...base });
        break;
      }
      case 'steps': {
        const steps = objects(s.steps)
          .map((x) => ({ title: str(x.title), body: optStr(x.body) }))
          .filter((x) => x.title.trim() !== '');
        if (steps.length === 0) continue;
        sections.push({ type: 'steps', heading: optStr(s.heading), intro: optStr(s.intro), steps, ...base });
        break;
      }
      case 'checklist': {
        const items = (Array.isArray(s.items) ? s.items : []).map(str).map((x) => x.trim()).filter(Boolean);
        if (items.length === 0) continue;
        sections.push({ type: 'checklist', heading: optStr(s.heading), intro: optStr(s.intro), items, ...base });
        break;
      }
      case 'faq': {
        const items = objects(s.items)
          .map((x) => ({ question: str(x.question), answer: str(x.answer) }))
          .filter((x) => x.question.trim() !== '' && x.answer.trim() !== '');
        if (items.length === 0) continue;
        sections.push({ type: 'faq', heading: optStr(s.heading), items, ...base });
        break;
      }
      case 'imageText': {
        const image = str(s.image).trim();
        if (image === '') continue;
        sections.push({
          type: 'imageText',
          heading: optStr(s.heading),
          body: optStr(s.body),
          image,
          imageAlt: optStr(s.imageAlt),
          imagePosition: s.imagePosition === 'right' ? 'right' : 'left',
          ...base,
        });
        break;
      }
      case 'button': {
        const text = str(s.text).trim();
        const link = str(s.link).trim();
        if (text === '' || link === '') continue;
        sections.push({ type: 'button', text, link, ...base });
        break;
      }
      case 'productGrid': {
        const slugs = (Array.isArray(s.slugs) ? s.slugs : []).map(str).map((x) => x.trim()).filter(Boolean);
        if (slugs.length === 0) continue;
        sections.push({ type: 'productGrid', heading: optStr(s.heading), intro: optStr(s.intro), slugs, ...base });
        break;
      }
      default:
        break; // unknown type — dropped, so older deployments survive newer blocks
    }
  }

  return sections;
}

/** FAQ blocks feed FAQPage structured data on the rendered page. */
export function collectSectionFaqItems(sections: PageSection[]): FaqItem[] {
  return sections.flatMap((s) => (s.type === 'faq' ? s.items : []));
}

/** Product slugs referenced anywhere on the page, so the renderer can fetch them once. */
export function collectProductSlugs(sections: PageSection[]): string[] {
  const slugs = sections.flatMap((s) => (s.type === 'productGrid' ? s.slugs : []));
  return [...new Set(slugs)];
}
