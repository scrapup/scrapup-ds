import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as publicApi from '../src/index';

const ROOT = join(import.meta.dirname, '..');

// Spec §7: exactly these 23 components, by group (RN-06).
const CATALOG: Record<string, readonly string[]> = {
  brand: ['Wordmark', 'Backdrop'],
  actions: ['Button', 'LangSwitch'],
  navigation: ['TopBar', 'Footer'],
  content: ['Hero', 'SectionHeader', 'Eyebrow', 'StatusPill', 'Callout', 'Tag', 'CodeChip', 'FlowLine'],
  surfaces: ['Panel', 'StatCard', 'FeatureCard', 'StatementList', 'ValueStatement'],
  process: ['MilestoneAxis', 'PhaseSteps'],
  forms: ['WaitlistForm'],
  feedback: ['GlitchCode'],
};
const ENTRIES = Object.entries(CATALOG).flatMap(([group, names]) => names.map((name) => ({ group, name })));

describe('component catalog', () => {
  it('lists exactly 23 components', () => {
    expect(ENTRIES).toHaveLength(23);
  });

  it('exports exactly the catalog from the public API (no extra component)', () => {
    expect(Object.keys(publicApi).sort()).toEqual(ENTRIES.map(({ name }) => name).sort());
  });

  it.each(ENTRIES)('ships $group/$name with a story, a unit test and an e2e spec', ({ group, name }) => {
    const dir = join(ROOT, 'src/components', group, name);
    expect(existsSync(join(dir, `${name}.stories.tsx`))).toBe(true);
    expect(existsSync(join(dir, `${name}.test.tsx`))).toBe(true);
    expect(existsSync(join(ROOT, 'e2e', group, `${name}.spec.ts`))).toBe(true);
  });
});
