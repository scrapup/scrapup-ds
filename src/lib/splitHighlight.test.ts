import { describe, expect, it } from 'vitest';
import { splitHighlight } from './splitHighlight';

describe('splitHighlight', () => {
  it('splits the text around the first match', () => {
    expect(splitHighlight('from scrap to forged delivery', 'forged')).toEqual([
      'from scrap to ',
      'forged',
      ' delivery',
    ]);
  });

  it('uses the first occurrence only', () => {
    expect(splitHighlight('a b a', 'a')).toEqual(['', 'a', ' b a']);
  });

  it('is case-sensitive', () => {
    expect(splitHighlight('Forged', 'forged')).toBeNull();
  });

  it('returns null when the highlight is missing, empty or absent from the text', () => {
    expect(splitHighlight('title')).toBeNull();
    expect(splitHighlight('title', '')).toBeNull();
    expect(splitHighlight('title', 'nope')).toBeNull();
  });
});
