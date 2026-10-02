import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR, NEON_GLOW } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Surfaces/Panel', () => {
  test('renders the default glass panel with square corners and md padding', async ({ page }) => {
    await gotoStory(page, 'surfaces-panel--default');
    const panel = page.locator('.su-panel');
    await expect(panel).toHaveCSS('border-radius', '0px');
    await expect(panel).toHaveCSS('padding', '24px');
    await expect(panel).toHaveCSS('background-image', /linear-gradient/);
  });

  test('glows the strong variant from the accent', async ({ page }) => {
    await gotoStory(page, 'surfaces-panel--strong');
    const panel = page.locator('.su-panel');
    await expect(panel).toHaveCSS('padding', '42px');
    await expect(panel).toHaveCSS('box-shadow', NEON_GLOW);
  });

  test('draws the edge variant with a solid accent border and glow', async ({ page }) => {
    await gotoStory(page, 'surfaces-panel--edge');
    const panel = page.locator('.su-panel');
    await expect(panel).toHaveCSS('border-top-color', COLOR.neon);
    await expect(panel).toHaveCSS('box-shadow', NEON_GLOW);
  });

  test('draws the dashed "not ours / not yet" border', async ({ page }) => {
    await gotoStory(page, 'surfaces-panel--dashed');
    const panel = page.locator('.su-panel');
    await expect(panel).toHaveCSS('border-top-style', 'dashed');
    await expect(panel).toHaveCSS('border-top-color', COLOR.lineStrong);
  });

  test('adds the 2px accent edge', async ({ page }) => {
    await gotoStory(page, 'surfaces-panel--accent-edge');
    const panel = page.locator('.su-panel');
    await expect(panel).toHaveCSS('border-left-width', '2px');
    await expect(panel).toHaveCSS('border-left-color', COLOR.cyan);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'surfaces-panel--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['surfaces-panel--all-variants']);
});
