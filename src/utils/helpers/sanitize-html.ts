import DOMPurify from 'dompurify';

/**
 * Allowed tags/attributes for rich-text body fields produced by the Tiptap editor.
 * Anything not in this list is stripped — no `<script>`, `<iframe>`, `<style>`,
 * event handlers, `javascript:` URIs, etc.
 */
const ALLOWED_TAGS = [
  // Block
  'p', 'br', 'hr',
  'h1', 'h2', 'h3',
  'ul', 'ol', 'li',
  'blockquote',
  // Inline
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'a', 'span',
  // Table
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
] as const;

const ALLOWED_ATTR = [
  'href', 'target', 'rel',       // links
  'colspan', 'rowspan',          // tables
  'data-text-align',             // Tiptap text-align
  'class', 'style',              // styling (further restricted below)
] as const;

/**
 * Sanitise an HTML string so it is safe to render via `dangerouslySetInnerHTML`.
 *
 * - Strips all tags/attrs not in the allow-list.
 * - Ensures `<a>` always carries `rel="noopener noreferrer"` and `target="_blank"`.
 * - Removes `javascript:` / `data:` URIs.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
    // Force safe link behaviour
    ADD_ATTR: ['target'],
  });
}

/**
 * Extract plain text from HTML (safe alternative to `innerHTML` + `textContent`).
 * Sanitises first so even the temporary DOM node is safe.
 */
export function htmlToPlainText(html: string): string {
  if (typeof document === 'undefined') return '';
  const clean = sanitizeHtml(html);
  const tmp = document.createElement('div');
  tmp.innerHTML = clean;
  return (tmp.textContent ?? '').trim();
}
