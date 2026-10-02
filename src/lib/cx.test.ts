import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class names with a single space', () => {
    expect(cx('su-a', 'su-b')).toBe('su-a su-b');
  });

  it('drops false, null, undefined and empty strings', () => {
    expect(cx('su-a', false, null, undefined, '', 'su-b')).toBe('su-a su-b');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cx(false, undefined)).toBe('');
  });
});
