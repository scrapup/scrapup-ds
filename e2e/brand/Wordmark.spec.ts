import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Brand/Wordmark', () => {
  test('renders "scrap" in light ink and "up" in the accent', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--default');
    const mark = page.getByRole('img', { name: 'scrapup' });
    await expect(mark).toHaveText('scrapup');
    await expect(mark).toHaveCSS('color', COLOR.fg2);
    await expect(mark).toHaveCSS('font-size', '24px');
    await expect(mark).toHaveCSS('font-weight', '700');
    await expect(page.locator('.su-wordmark__up')).toHaveCSS('color', COLOR.neon);
  });

  test('animates "up" with the flicker by default (RN-18)', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--default');
    const up = page.locator('.su-wordmark__up');
    await expect(up).toHaveCSS('animation-name', 'scrapupFlicker');
    await expect(up).toHaveCSS('animation-duration', '7s');
    await expect(up).toHaveCSS('animation-iteration-count', 'infinite');
  });

  test('renders static when flicker is off (RN-18)', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--static');
    await expect(page.locator('.su-wordmark__up')).toHaveCSS('animation-name', 'none');
  });

  test('renders the showcase size at 66px', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--showcase');
    await expect(page.locator('.su-wordmark')).toHaveCSS('font-size', '66px');
  });

  test('renders the paper tone with a neon-light "up"', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--on-paper');
    await expect(page.locator('.su-wordmark')).toHaveCSS('color', COLOR.paperInk);
    await expect(page.locator('.su-wordmark__up')).toHaveCSS('color', COLOR.neonLight);
  });

  test('is a keyboard-focusable link with a visible focus ring when href is set', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--link');
    await page.keyboard.press('Tab');
    const link = page.getByRole('link', { name: 'scrapup' });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    await expect(link).toHaveCSS('outline-color', COLOR.cyan);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['brand-wordmark--all-variants', 'brand-wordmark--on-paper']);
});
