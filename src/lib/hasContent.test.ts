import { describe, expect, it } from 'vitest';
import { hasContent } from './hasContent';

describe('hasContent', () => {
  it.each([undefined, null, false, true, '', [], [null, false, '']])('treats %j as an empty slot (D-07)', (node) => {
    expect(hasContent(node)).toBe(false);
  });

  it.each(['label', 0, '★', ['a'], [null, 'b']])('treats %j as content', (node) => {
    expect(hasContent(node)).toBe(true);
  });
});
