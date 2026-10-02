import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/design-tokens.json';

const TOKENS_DIR = join(import.meta.dirname, '../src/tokens');
// Ported 1:1 from the design project (parity fixture) …
const TOKEN_FILES = ['fonts', 'colors', 'typography', 'spacing', 'effects', 'base'];
// … and tokens added by this package for values components used inline (plan §3.2).
const EXTENSION_FILE = 'extensions';

function read(name: string): string {
  return readFileSync(join(TOKENS_DIR, `${name}.css`), 'utf8');
}

function withoutComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Custom properties declared in the given token sources (name → raw value); fails on duplicates. */
function declaredTokens(files: readonly string[]): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const file of files) {
    for (const match of withoutComments(read(file)).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      const [, name, value] = match;
      if (!name || !value) continue;
      if (tokens.has(name)) throw new Error(`Token ${name} is declared more than once`);
      tokens.set(name, value.trim());
    }
  }
  return tokens;
}

const DECLARED = declaredTokens(TOKEN_FILES);
const EXTENDED = declaredTokens([EXTENSION_FILE]);

describe('token layer', () => {
  it('ships every token source file', () => {
    const files = readdirSync(TOKENS_DIR).map((name) => name.replace(/\.css$/, ''));
    expect(files.sort()).toEqual([...TOKEN_FILES, EXTENSION_FILE].sort());
  });

  it.each(Object.entries(fixture))('keeps %s with the design project value', (name, value) => {
    expect(DECLARED.get(name)).toBe(value);
  });

  it('declares exactly the fixture tokens (additions go through the fixture)', () => {
    expect([...DECLARED.keys()].sort()).toEqual(Object.keys(fixture).sort());
  });

  it('adds extension tokens only under new names', () => {
    expect(EXTENDED.size).toBeGreaterThan(0);
    for (const name of EXTENDED.keys()) expect(Object.keys(fixture)).not.toContain(name);
  });

  it('derives every color-mix token from the accent (RN-09)', () => {
    const mixed = [...DECLARED, ...EXTENDED].filter(([, value]) => value.includes('color-mix('));
    expect(mixed.length).toBeGreaterThan(0);
    for (const [name, value] of mixed) expect([name, value]).toEqual([name, expect.stringContaining('var(--accent)')]);
  });

  it('removes the prefers-reduced-motion override (OP-03)', () => {
    for (const name of [...TOKEN_FILES, EXTENSION_FILE]) expect(read(name)).not.toMatch(/prefers-reduced-motion/);
  });

  it.each(['scrapupFlicker', 'scrapupGlitchC', 'scrapupGlitchM', 'scrapupGlitchSlice'])(
    'keeps the brand keyframes %s',
    (keyframes) => {
      expect(read('effects')).toMatch(new RegExp(`@keyframes ${keyframes}\\s*\\{`));
    },
  );

  it('loads the webfonts from Google Fonts with display=swap (RN-11)', () => {
    expect(withoutComments(read('fonts')).trim()).toMatch(
      /^@import url\("https:\/\/fonts\.googleapis\.com\/css2\?[^"]+&display=swap"\);$/,
    );
  });

  it('ends every font stack in a generic family', () => {
    for (const name of ['--font-display', '--font-body', '--font-mono']) {
      expect(DECLARED.get(name)).toMatch(/,(sans-serif|monospace)$/);
    }
  });
});
