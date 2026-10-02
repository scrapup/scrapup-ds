import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Runs against the built package. Skipped locally when dist/ is absent; CI sets
// REQUIRE_DIST=1 after `npm run build` so a missing build fails instead of skipping.
const DIST = join(import.meta.dirname, '../dist');
const hasDist = existsSync(DIST);
const isRequired = process.env.REQUIRE_DIST === '1';

function read(file: string): string {
  return readFileSync(join(DIST, file), 'utf8');
}

describe.skipIf(!hasDist && !isRequired)('build output', () => {
  it('starts dist/styles.css with the Google Fonts @import (it must be the first rule)', () => {
    expect(read('styles.css')).toMatch(/^@import\s*(url\()?["']?https:\/\/fonts\.googleapis\.com\//);
  });

  it('ships the tokens and base inside dist/styles.css', () => {
    const css = read('styles.css');
    expect(css).toContain('--su-neon:');
    expect(css).toMatch(/(^|})body\{/);
  });

  it('keeps dist/tokens.css token-only: no fonts, no element or universal selectors', () => {
    const css = read('tokens.css');
    expect(css).toContain('--su-neon:');
    expect(css).not.toMatch(/@import/);
    expect(css).not.toMatch(/(^|[},])\s*(\*|html|body|a|input)\b[^{]*\{/);
  });

  it('keeps the brand keyframes and drops the reduced-motion override', () => {
    for (const file of ['styles.css', 'tokens.css']) {
      const css = read(file);
      expect(css).toMatch(/@keyframes scrapupFlicker/);
      expect(css).not.toMatch(/prefers-reduced-motion/);
    }
  });
});
