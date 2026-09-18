/**
 * Small markdown subset shared by the CMS page renderer and the admin preview, so what
 * an editor sees is what ships. Deliberately not a full parser: headings, lists, quotes,
 * bold, italic, links, paragraphs. Raw HTML is passed through untouched.
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function looksLikeBlockHtml(src: string): boolean {
  return /^\s*<(p|div|section|h[1-6]|ul|ol|table|figure)\b/i.test(src.trim());
}

function inline(src: string): string {
  return escapeHtml(src)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
}

export function markdownLiteToHtml(src: string): string {
  if (!src?.trim()) return '';
  if (looksLikeBlockHtml(src)) return src;

  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];

  const closeList = () => {
    if (listType) { out.push(`</${listType}>`); listType = null; }
  };
  const closeParagraph = () => {
    if (paragraph.length) { out.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; }
  };

  for (const rawLine of src.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim();

    if (line === '') { closeParagraph(); closeList(); continue; }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeParagraph(); closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      closeParagraph();
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      closeParagraph();
      if (listType !== 'ol') { closeList(); out.push('<ol>'); listType = 'ol'; }
      out.push(`<li>${inline(numbered[1])}</li>`);
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      closeParagraph(); closeList();
      out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
      continue;
    }

    paragraph.push(line);
  }

  closeParagraph();
  closeList();
  return out.join('\n');
}
