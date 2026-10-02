import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';
import { blockingViolations } from '../../test/a11y-policy';

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 200;

// The Storybook a11y addon runs axe in the same iframe after each render; a concurrent run fails
// with "Axe is already running", so that error alone is retried.
async function analyze(page: Page, attempt = 1): Promise<AxeResults> {
  try {
    return await new AxeBuilder({ page }).include('#storybook-root').analyze();
  } catch (error) {
    if (attempt >= MAX_ATTEMPTS || !String(error).includes('Axe is already running')) throw error;
    await page.waitForTimeout(RETRY_DELAY_MS);
    return analyze(page, attempt + 1);
  }
}

/** Fails on critical or serious axe violations inside the story root (logotype contrast exempt). */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const blocking = blockingViolations((await analyze(page)).violations);
  expect(blocking, `axe critical/serious violations:\n${blocking.join('\n')}`).toEqual([]);
}
