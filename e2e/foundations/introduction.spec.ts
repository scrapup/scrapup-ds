import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { gotoStory } from '../support/story';

test.describe('Foundations/Introduction', () => {
  test('renders the story from the built catalog', async ({ page }) => {
    await gotoStory(page, 'foundations-introduction--default');
    await expect(page.getByRole('heading', { level: 1, name: 'probe heading that does not exist' })).toBeVisible();
  });

  for (const url of ['https://fonts.googleapis.com/css2?family=Inter', 'https://fonts.gstatic.com/s/inter.woff2']) {
    test(`aborts the Google Fonts request ${new URL(url).host}`, async ({ page }) => {
      await gotoStory(page, 'foundations-introduction--default');
      const failed = page.waitForEvent('requestfailed', (request) => request.url() === url);
      await page.evaluate(async (target) => {
        await fetch(target, { mode: 'no-cors' }).catch(() => undefined);
      }, url);
      // net::ERR_FAILED is what route.abort() produces; an offline runner reports a DNS/connection error.
      expect((await failed).failure()?.errorText).toBe('net::ERR_FAILED');
    });
  }

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'foundations-introduction--default');
    await expectNoA11yViolations(page);
  });
});
