import axe from 'axe-core';
import { expect } from 'vitest';
import { blockingViolations } from './a11y-policy';

/** Runs axe-core on a rendered container and fails on critical or serious violations. */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, { resultTypes: ['violations'] });
  const blocking = blockingViolations(results.violations);
  expect(blocking, `axe critical/serious violations:\n${blocking.join('\n')}`).toEqual([]);
}
