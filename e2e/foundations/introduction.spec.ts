import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { gotoStory } from '../support/story';

test.describe('Foundations/Introduction', () => {
  test('renders the story from the built catalog', async ({ page }) => {
    await gotoStory(page, 'foundations-introduction--default');
    await expect(page.getByRole('heading', { level: 1, name: 'scrapup design system' })).toBeVisible();
  });

  test('aborts Google Fonts requests', async ({ page }) => {
    await gotoStory(page, 'foundations-introduction--default');
    const blocked = await page.evaluate(async () => {
      try {
        await fetch('https://fonts.googleapis.com/css2?family=Inter', { mode: 'no-cors' });
        return false;
      } catch {
        return true;
      }
    });
    expect(blocked).toBe(true);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'foundations-introduction--default');
    await expectNoA11yViolations(page);
  });
});
