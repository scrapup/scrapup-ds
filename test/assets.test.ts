import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');
const LOGOS_DIR = join(ROOT, 'assets/logos');

// SHA-256 of the design project files (assets/logos/*), verified at import time (TF-83-02).
// The files are byte-identical copies: never re-encode, resize or optimize them.
const LOGOS: Record<string, string> = {
  'scrapup-avatar.png': '3f55946425844c1441d2bb56ca0b84b4b19b76487f9ddb563f1f16a736cc8c25',
  'scrapup-favicon.png': '3ddf3814fdc9ad50f446a903d776a9f1ed509699e66fdaf10b9b493d1287d431',
  'scrapup-social.png': '9139ab479ade612623ca5af3be3edc6e8f0aae9b5cb2bd26702f815faded53b5',
  'scrapup-square.gif': '4f9f5fad9a671937fa53353e247d838fb3dc959308dc5bc019abf78b78508ea0',
  'scrapup-wordmark-dark.png': 'c94efd7229e7920492e81f5ce87e72e14e6bd6ca1e3edc0bf5e6439ff665177d',
  'scrapup-wordmark-light.png': '711c8078c6f3a56f5a04f9d340b72a7d28533842f0cc71b03731ae95378be8a3',
  'scrapup-wordmark.gif': '109c733bfa7428057df9609983afed20bc61a120cef59080d2671423a0082edd',
};

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const GIF_SIGNATURES = ['GIF87a', 'GIF89a'];

interface PackageManifest {
  exports: Record<string, unknown>;
  files: string[];
}

function readLogo(name: string): Buffer {
  return readFileSync(join(LOGOS_DIR, name));
}

describe('brand assets', () => {
  it.each(Object.keys(LOGOS))('ships %s with a valid image signature', (name) => {
    const bytes = readLogo(name);
    expect(bytes.length).toBeGreaterThan(0);
    if (name.endsWith('.png')) expect(bytes.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
    else expect(GIF_SIGNATURES).toContain(bytes.subarray(0, 6).toString('ascii'));
  });

  it.each(Object.entries(LOGOS))('keeps %s byte-identical to the design project', (name, sha256) => {
    expect(createHash('sha256').update(readLogo(name)).digest('hex')).toBe(sha256);
  });

  it('exposes the assets through the package exports and files (RN-12)', () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as PackageManifest;
    expect(manifest.exports['./assets/*']).toBe('./assets/*');
    expect(manifest.files).toContain('assets');
  });
});
