import { describe, expect, it } from 'vitest';
import { resolveOption } from './resolveOption';

const SIZES = ['sm', 'md', 'lg'] as const;

describe('resolveOption', () => {
  it('returns the value when it is allowed', () => {
    expect(resolveOption('lg', SIZES, 'md')).toBe('lg');
  });

  it('returns the fallback for an unknown string (D-05)', () => {
    expect(resolveOption('huge', SIZES, 'md')).toBe('md');
  });

  it('returns the fallback for undefined and non-string values', () => {
    expect(resolveOption(undefined, SIZES, 'md')).toBe('md');
    expect(resolveOption(42, SIZES, 'md')).toBe('md');
    expect(resolveOption(null, SIZES, 'md')).toBe('md');
  });
});
