import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

const NEON = 'rgb(255, 122, 51)';
const NEON_LIGHT = 'rgb(232, 100, 31)';

test.describe('Brand/Wordmark', () => {
  test('renders "scrap" in light ink and "up" in the accent', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--default');
    const mark = page.locator('.su-wordmark');
    await expect(mark).toHaveText('scrapup');
    await expect(mark).toHaveCSS('color', 'rgb(236, 238, 244)');
    await expect(mark).toHaveCSS('font-size', '24px');
    await expect(mark).toHaveCSS('font-weight', '700');
    await expect(page.locator('.su-wordmark__up')).toHaveCSS('color', NEON);
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

  test('uses the showcase size and the paper tone', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--showcase');
    await expect(page.locator('.su-wordmark')).toHaveCSS('font-size', '66px');
    await gotoStory(page, 'brand-wordmark--on-paper');
    await expect(page.locator('.su-wordmark')).toHaveCSS('color', 'rgb(26, 23, 20)');
    await expect(page.locator('.su-wordmark__up')).toHaveCSS('color', NEON_LIGHT);
  });

  test('is a keyboard-focusable link with a visible focus ring when href is set', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--link');
    await page.keyboard.press('Tab');
    const link = page.getByRole('link', { name: 'scrapup' });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    await expect(link).toHaveCSS('outline-color', 'rgb(53, 230, 224)');
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'brand-wordmark--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['brand-wordmark--all-variants', 'brand-wordmark--on-paper']);
});
