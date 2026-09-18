import { list, type PageBlocks } from '@/lib/pageContent';
import { PAGE_COPY_DEFAULTS } from '@/lib/pageCopyDefaults';

export type FaqEntry = { question: string; answer: string };
export type FaqSection = { category: string; items: FaqEntry[] };

/**
 * FAQ content for the home page and /faq, with any wording overrides applied.
 * Both pages read the same 'faq' overrides, so an edit shows up in both places.
 */
export function faqSectionsFrom(blocks: PageBlocks): { botanical: FaqSection[]; homeopathy: FaqSection[] } {
  const D = PAGE_COPY_DEFAULTS.faq;
  return {
    botanical: [{ category: 'Botanical Aid', items: list<FaqEntry>(blocks, 'botanical_items', [...D.botanical_items]) }],
    homeopathy: [{ category: 'Homeopathy', items: list<FaqEntry>(blocks, 'homeopathy_items', [...D.homeopathy_items]) }],
  };
}
