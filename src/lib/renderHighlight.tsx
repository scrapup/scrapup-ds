import type { ReactNode } from 'react';
import { splitHighlight } from './splitHighlight';

/** Renders `text` with its first `highlight` occurrence wrapped in a span; plain text when not found. */
export function renderHighlight(text: string, highlight: string | undefined, className: string): ReactNode {
  const parts = splitHighlight(text, highlight);
  if (!parts) return text;
  return (
    <>
      {parts[0]}
      <span className={className}>{parts[1]}</span>
      {parts[2]}
    </>
  );
}
