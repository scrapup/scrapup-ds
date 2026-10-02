import axe from 'axe-core';
import { expect } from 'vitest';

const BLOCKING = new Set(['critical', 'serious']);
// WCAG 1.4.3: text that is part of a logo or brand name has no contrast requirement.
const LOGOTYPE = '.su-wordmark';

/** Runs axe-core on a rendered container and fails on critical or serious violations. */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, { resultTypes: ['violations'] });
  const blocking = results.violations
    .filter((violation) => BLOCKING.has(violation.impact ?? ''))
    .flatMap((violation) =>
      violation.nodes
        .filter((node) => violation.id !== 'color-contrast' || !node.target.join(' ').includes(LOGOTYPE))
        .map((node) => `${violation.id}: ${violation.help} (${node.target.join(' ')})`),
    );
  expect(blocking, `axe critical/serious violations:\n${blocking.join('\n')}`).toEqual([]);
}
