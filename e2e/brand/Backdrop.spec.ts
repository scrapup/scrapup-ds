import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Brand/Backdrop', () => {
  test('paints the ink stage with ambient glow, scanlines and cyan frame marks', async ({ page }) => {
    await gotoStory(page, 'brand-backdrop--default');
    await expect(page.locator('.su-backdrop')).toHaveCSS('background-color', COLOR.ink);
    await expect(page.locator('.su-backdrop__ambient')).toHaveCSS('background-image', /radial-gradient/);
    await expect(page.locator('.su-backdrop__scanlines')).toHaveCSS('opacity', '0.5');
    const mark = page.locator('.su-backdrop__mark--left');
    await expect(mark).toHaveCSS('border-left-color', COLOR.cyan);
    await expect(mark).toHaveCSS('border-radius', '0px');
    await expect(page.locator('.su-backdrop__site')).toHaveText('SCRAPUP.DEV');
  });

  test('keeps decorative layers out of pointer events', async ({ page }) => {
    await gotoStory(page, 'brand-backdrop--default');
    for (const selector of ['.su-backdrop__ambient', '.su-backdrop__scanlines', '.su-backdrop__frame']) {
      await expect(page.locator(selector)).toHaveCSS('pointer-events', 'none');
    }
  });

  test('fills the viewport when full-height', async ({ page }) => {
    await gotoStory(page, 'brand-backdrop--default');
    const { height, viewport } = await page
      .locator('.su-backdrop')
      .evaluate((element) => ({ height: element.getBoundingClientRect().height, viewport: window.innerHeight }));
    expect(height).toBeGreaterThanOrEqual(viewport);
  });

  test('renders without marks and scanlines in the plain variant', async ({ page }) => {
    await gotoStory(page, 'brand-backdrop--plain');
    await expect(page.locator('.su-backdrop__frame')).toHaveCount(0);
    await expect(page.locator('.su-backdrop__scanlines')).toHaveCount(0);
    await expect(page.getByText('Backdrop content')).toBeVisible();
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'brand-backdrop--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['brand-backdrop--default', 'brand-backdrop--all-variants']);
});
