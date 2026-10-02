import type { ReactNode } from 'react';

/** True when a slot has something to render; undefined, null, booleans and '' are empty (D-07). */
export function hasContent(node: ReactNode): boolean {
  return node !== undefined && node !== null && typeof node !== 'boolean' && node !== '';
}
