import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/design-tokens.json';

const TOKENS_DIR = join(import.meta.dirname, '../src/tokens');
const TOKEN_FILES = ['fonts', 'colors', 'typography', 'spacing', 'effects', 'base'];

function read(name: string): string {
  return readFileSync(join(TOKENS_DIR, `${name}.css`), 'utf8');
}

function withoutComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Custom properties declared in the token sources (name → raw value). */
function declaredTokens(): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const file of readdirSync(TOKENS_DIR).filter((name) => name.endsWith('.css'))) {
    const css = withoutComments(readFileSync(join(TOKENS_DIR, file), 'utf8'));
    for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      const [, name, value] = match;
      if (name && value) tokens.set(name, value.trim());
    }
  }
  return tokens;
}

describe('token layer', () => {
  it('ships every token source file', () => {
    const files = readdirSync(TOKENS_DIR).map((name) => name.replace(/\.css$/, ''));
    expect(files.sort()).toEqual([...TOKEN_FILES].sort());
  });

  it.each(Object.entries(fixture))('keeps %s with the design project value', (name, value) => {
    expect(declaredTokens().get(name)).toBe(value);
  });

  it('removes the prefers-reduced-motion override (OP-03)', () => {
    for (const name of TOKEN_FILES) expect(read(name)).not.toMatch(/prefers-reduced-motion/);
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
    const tokens = declaredTokens();
    for (const name of ['--font-display', '--font-body', '--font-mono']) {
      expect(tokens.get(name)).toMatch(/,(sans-serif|monospace)$/);
    }
  });
});
