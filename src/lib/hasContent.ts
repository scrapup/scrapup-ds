import type { ReactNode } from 'react';

/**
 * True when a slot has something to render (D-07): undefined, null, booleans, '' and arrays
 * without renderable items are empty.
 */
export function hasContent(node: ReactNode): boolean {
  if (Array.isArray(node)) return node.some((item: ReactNode) => hasContent(item));
  return node !== undefined && node !== null && typeof node !== 'boolean' && node !== '';
}
