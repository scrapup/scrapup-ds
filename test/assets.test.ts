import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');
const LOGOS_DIR = join(ROOT, 'assets/logos');

// SHA-256 of the original design project files (assets/logos/*), captured when they were copied
// into this repo (TF-83-02). The files are byte-identical copies: never re-encode, resize or optimize.
const LOGO_SHA256_BY_FILE: Record<string, string> = {
  'scrapup-avatar.png': '3f55946425844c1441d2bb56ca0b84b4b19b76487f9ddb563f1f16a736cc8c25',
  'scrapup-favicon.png': '3ddf3814fdc9ad50f446a903d776a9f1ed509699e66fdaf10b9b493d1287d431',
  'scrapup-social.png': '9139ab479ade612623ca5af3be3edc6e8f0aae9b5cb2bd26702f815faded53b5',
  'scrapup-square.gif': '4f9f5fad9a671937fa53353e247d838fb3dc959308dc5bc019abf78b78508ea0',
  'scrapup-wordmark-dark.png': 'c94efd7229e7920492e81f5ce87e72e14e6bd6ca1e3edc0bf5e6439ff665177d',
  'scrapup-wordmark-light.png': '711c8078c6f3a56f5a04f9d340b72a7d28533842f0cc71b03731ae95378be8a3',
  'scrapup-wordmark.gif': '109c733bfa7428057df9609983afed20bc61a120cef59080d2671423a0082edd',
};
const LOGO_FILES = Object.keys(LOGO_SHA256_BY_FILE);

// Accepted leading bytes per file extension (latin1 so binary signatures compare as strings).
const SIGNATURES_BY_EXTENSION: Record<string, readonly string[]> = {
  '.png': ['\x89PNG\r\n\x1a\n'],
  '.gif': ['GIF87a', 'GIF89a'],
};

interface PackageManifest {
  files: string[];
}

function readLogo(name: string): Buffer {
  return readFileSync(join(LOGOS_DIR, name));
}

function sha256Of(name: string): string {
  return createHash('sha256').update(readLogo(name)).digest('hex');
}

describe('brand assets', () => {
  it('ships exactly the pinned logos and no unverified file', () => {
    expect(readdirSync(LOGOS_DIR).sort()).toEqual([...LOGO_FILES].sort());
  });

  it.each(LOGO_FILES)('ships %s with a valid image signature', (name) => {
    const accepted = SIGNATURES_BY_EXTENSION[extname(name)] ?? [];
    expect(accepted, `no signature mapped for ${name}`).not.toEqual([]);
    const bytes = readLogo(name);
    const signatureLength = accepted[0]?.length ?? 0;
    expect(accepted).toContain(bytes.subarray(0, signatureLength).toString('latin1'));
  });

  it.each(Object.entries(LOGO_SHA256_BY_FILE))('keeps %s byte-identical to the design project', (name, sha256) => {
    expect(sha256Of(name)).toBe(sha256);
  });

  it.each(LOGO_FILES)('resolves %s through the public specifier @scrapup/ds/assets/logos (RN-12)', (name) => {
    expect(fileURLToPath(import.meta.resolve(`@scrapup/ds/assets/logos/${name}`))).toBe(join(LOGOS_DIR, name));
  });

  it('packs the assets directory', () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as PackageManifest;
    expect(manifest.files).toContain('assets');
  });
});
