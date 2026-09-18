'use client';

import MediaPicker from '@/components/admin/MediaPicker';
import {
  SECTION_TYPES,
  SECTION_TYPE_LABELS,
  type PageSection,
  type CardItem,
  type StepItem,
  type FaqItem,
} from '@/lib/pageSections';

/**
 * Block builder for CMS pages. Draft state is allowed to be incomplete — empty rows and
 * half-filled blocks are stripped by parsePageSections() when the page is saved.
 */

const inputCls =
  'w-full px-3 py-2 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]';
const smallBtn =
  'px-2 py-1 text-xs rounded border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer disabled:opacity-40';

function newSection(type: PageSection['type']): PageSection {
  switch (type) {
    case 'markdown': return { type, heading: '', content: '' };
    case 'cardGrid': return { type, heading: '', subheading: '', cards: [{ icon: '', title: '', description: '' }], footnote: '' };
    case 'steps': return { type, heading: '', intro: '', steps: [{ title: '', body: '' }] };
    case 'checklist': return { type, heading: '', intro: '', items: [] };
    case 'faq': return { type, heading: '', items: [{ question: '', answer: '' }] };
    case 'imageText': return { type, heading: '', body: '', image: '', imageAlt: '', imagePosition: 'left' };
    case 'button': return { type, text: '', link: '' };
    case 'productGrid': return { type, heading: '', intro: '', slugs: [] };
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

export default function SectionsEditor({
  value,
  onChange,
  productSlugs = [],
}: {
  value: PageSection[];
  onChange: (next: PageSection[]) => void;
  productSlugs?: { slug: string; name: string }[];
}) {
  const update = (index: number, next: PageSection) => onChange(value.map((s, i) => (i === index ? next : s)));
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.map((section, i) => (
        <div key={i} className="bg-white border border-[#e5e7eb] rounded-lg">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#e5e7eb] bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#1a3a8f]">
                {i + 1}. {SECTION_TYPE_LABELS[section.type]}
              </span>
              <code className="text-[11px] text-gray-500">.cms-section--{section.type}</code>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={smallBtn} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className={smallBtn} aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(i)} className={`${smallBtn} text-red-600`}>Remove</button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {'eyebrow' in section && (
              <Field label="Small label above the heading (optional)">
                <input value={section.eyebrow ?? ''} onChange={(e) => update(i, { ...section, eyebrow: e.target.value })} className={inputCls} />
              </Field>
            )}

            {section.type === 'markdown' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Text — blank line between paragraphs, ## for a sub-heading, - for a bullet">
                  <textarea rows={8} value={section.content} onChange={(e) => update(i, { ...section, content: e.target.value })} className={inputCls} />
                </Field>
              </>
            )}

            {section.type === 'cardGrid' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Intro line">
                  <input value={section.subheading ?? ''} onChange={(e) => update(i, { ...section, subheading: e.target.value })} className={inputCls} />
                </Field>
                {section.cards.map((card: CardItem, ci) => (
                  <div key={ci} className="border border-dashed border-[#e5e7eb] rounded p-3 space-y-2">
                    <div className="flex gap-2">
                      <input placeholder="Icon (emoji)" value={card.icon ?? ''} onChange={(e) => update(i, { ...section, cards: section.cards.map((c, j) => (j === ci ? { ...c, icon: e.target.value } : c)) })} className={`${inputCls} w-24`} />
                      <input placeholder="Title" value={card.title} onChange={(e) => update(i, { ...section, cards: section.cards.map((c, j) => (j === ci ? { ...c, title: e.target.value } : c)) })} className={inputCls} />
                      <button type="button" onClick={() => update(i, { ...section, cards: section.cards.filter((_, j) => j !== ci) })} className={`${smallBtn} text-red-600`}>×</button>
                    </div>
                    <textarea rows={2} placeholder="Description" value={card.description ?? ''} onChange={(e) => update(i, { ...section, cards: section.cards.map((c, j) => (j === ci ? { ...c, description: e.target.value } : c)) })} className={inputCls} />
                  </div>
                ))}
                <button type="button" onClick={() => update(i, { ...section, cards: [...section.cards, { icon: '', title: '', description: '' }] })} className={smallBtn}>+ Add card</button>
              </>
            )}

            {section.type === 'steps' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                {section.steps.map((step: StepItem, si) => (
                  <div key={si} className="border border-dashed border-[#e5e7eb] rounded p-3 space-y-2">
                    <div className="flex gap-2">
                      <input placeholder={`Step ${si + 1} title`} value={step.title} onChange={(e) => update(i, { ...section, steps: section.steps.map((s, j) => (j === si ? { ...s, title: e.target.value } : s)) })} className={inputCls} />
                      <button type="button" onClick={() => update(i, { ...section, steps: section.steps.filter((_, j) => j !== si) })} className={`${smallBtn} text-red-600`}>×</button>
                    </div>
                    <textarea rows={2} placeholder="Detail" value={step.body ?? ''} onChange={(e) => update(i, { ...section, steps: section.steps.map((s, j) => (j === si ? { ...s, body: e.target.value } : s)) })} className={inputCls} />
                  </div>
                ))}
                <button type="button" onClick={() => update(i, { ...section, steps: [...section.steps, { title: '', body: '' }] })} className={smallBtn}>+ Add step</button>
              </>
            )}

            {section.type === 'checklist' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Items — one per line">
                  <textarea rows={6} value={section.items.join('\n')} onChange={(e) => update(i, { ...section, items: e.target.value.split('\n') })} className={inputCls} />
                </Field>
              </>
            )}

            {section.type === 'faq' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                {section.items.map((item: FaqItem, qi) => (
                  <div key={qi} className="border border-dashed border-[#e5e7eb] rounded p-3 space-y-2">
                    <div className="flex gap-2">
                      <input placeholder="Question" value={item.question} onChange={(e) => update(i, { ...section, items: section.items.map((q, j) => (j === qi ? { ...q, question: e.target.value } : q)) })} className={inputCls} />
                      <button type="button" onClick={() => update(i, { ...section, items: section.items.filter((_, j) => j !== qi) })} className={`${smallBtn} text-red-600`}>×</button>
                    </div>
                    <textarea rows={3} placeholder="Answer" value={item.answer} onChange={(e) => update(i, { ...section, items: section.items.map((q, j) => (j === qi ? { ...q, answer: e.target.value } : q)) })} className={inputCls} />
                  </div>
                ))}
                <button type="button" onClick={() => update(i, { ...section, items: [...section.items, { question: '', answer: '' }] })} className={smallBtn}>+ Add question</button>
              </>
            )}

            {section.type === 'imageText' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Text">
                  <textarea rows={5} value={section.body ?? ''} onChange={(e) => update(i, { ...section, body: e.target.value })} className={inputCls} />
                </Field>
                <MediaPicker
                  label="Image"
                  prefix="pages"
                  value={section.image}
                  onChange={(url) => update(i, { ...section, image: url })}
                />
                <div className="flex gap-3">
                  <Field label="Image description (for screen readers)">
                    <input value={section.imageAlt ?? ''} onChange={(e) => update(i, { ...section, imageAlt: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Image side">
                    <select value={section.imagePosition ?? 'left'} onChange={(e) => update(i, { ...section, imagePosition: e.target.value as 'left' | 'right' })} className={inputCls}>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                </div>
              </>
            )}

            {section.type === 'button' && (
              <div className="flex gap-3">
                <Field label="Button text">
                  <input value={section.text} onChange={(e) => update(i, { ...section, text: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Goes to (e.g. /products)">
                  <input value={section.link} onChange={(e) => update(i, { ...section, link: e.target.value })} className={inputCls} />
                </Field>
              </div>
            )}

            {section.type === 'productGrid' && (
              <>
                <Field label="Heading">
                  <input value={section.heading ?? ''} onChange={(e) => update(i, { ...section, heading: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Intro line">
                  <input value={section.intro ?? ''} onChange={(e) => update(i, { ...section, intro: e.target.value })} className={inputCls} />
                </Field>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-600">Products to show</span>
                  <div className="grid sm:grid-cols-2 gap-1">
                    {productSlugs.map((p) => (
                      <label key={p.slug} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={section.slugs.includes(p.slug)}
                          onChange={(e) =>
                            update(i, {
                              ...section,
                              slugs: e.target.checked
                                ? [...section.slugs, p.slug]
                                : section.slugs.filter((s) => s !== p.slug),
                            })
                          }
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Field label="Background">
              <select value={section.background ?? ''} onChange={(e) => update(i, { ...section, background: (e.target.value || undefined) as 'white' | 'cream' | undefined })} className={inputCls}>
                <option value="">Default</option>
                <option value="white">White</option>
                <option value="cream">Tinted</option>
              </select>
            </Field>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-2">
        {SECTION_TYPES.map((type) => (
          <button key={type} type="button" onClick={() => onChange([...value, newSection(type)])} className="px-3 py-1.5 text-sm rounded border border-[#1a3a8f] text-[#1a3a8f] hover:bg-[#1a3a8f]/5 cursor-pointer">
            + {SECTION_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
