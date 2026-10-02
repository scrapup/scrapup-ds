import axe from 'axe-core';
import { expect } from 'vitest';

const BLOCKING = new Set(['critical', 'serious']);

/** Runs axe-core on a rendered container and fails on critical or serious violations. */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, { resultTypes: ['violations'] });
  const blocking = results.violations
    .filter((violation) => BLOCKING.has(violation.impact ?? ''))
    .map((violation) => `${violation.id}: ${violation.help}`);
  expect(blocking, `axe critical/serious violations:\n${blocking.join('\n')}`).toEqual([]);
}
