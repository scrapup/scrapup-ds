export type HighlightParts = [before: string, match: string, after: string];

/**
 * Splits `text` around the first case-sensitive occurrence of `highlight`.
 * Returns `null` when `highlight` is empty or not found, so callers render the plain text.
 */
export function splitHighlight(text: string, highlight?: string): HighlightParts | null {
  if (!highlight) return null;
  const start = text.indexOf(highlight);
  if (start === -1) return null;
  const end = start + highlight.length;
  return [text.slice(0, start), highlight, text.slice(end)];
}
