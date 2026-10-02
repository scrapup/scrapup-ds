import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const BLOCKING = new Set(['critical', 'serious']);

/** Fails on critical or serious axe violations inside the story root. */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();
  const blocking = results.violations
    .filter((violation) => BLOCKING.has(violation.impact ?? ''))
    .map((violation) => `${violation.id}: ${violation.help}`);
  expect(blocking, `axe critical/serious violations:\n${blocking.join('\n')}`).toEqual([]);
}
