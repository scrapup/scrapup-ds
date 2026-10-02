import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const BLOCKING = new Set(['critical', 'serious']);
// WCAG 1.4.3: text that is part of a logo or brand name has no contrast requirement.
const LOGOTYPE = '.su-wordmark';

/** Fails on critical or serious axe violations inside the story root (logotype contrast exempt). */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();
  const blocking = results.violations
    .filter((violation) => BLOCKING.has(violation.impact ?? ''))
    .flatMap((violation) =>
      violation.nodes
        .filter((node) => violation.id !== 'color-contrast' || !node.target.join(' ').includes(LOGOTYPE))
        .map((node) => `${violation.id}: ${violation.help} (${node.target.join(' ')})`),
    );
  expect(blocking, `axe critical/serious violations:\n${blocking.join('\n')}`).toEqual([]);
}
