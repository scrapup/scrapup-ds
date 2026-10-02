import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR, NEON_GLOW } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Surfaces/StatCard', () => {
  test('renders the glowing neon value in the display face', async ({ page }) => {
    await gotoStory(page, 'surfaces-statcard--default');
    const value = page.locator('.su-stat-card__value');
    await expect(value).toHaveText('+37.6%');
    await expect(value).toHaveCSS('color', COLOR.neon);
    await expect(value).toHaveCSS('font-family', /Space Grotesk/);
    await expect(value).toHaveCSS('text-shadow', NEON_GLOW);
  });

  test('renders the cyan tone', async ({ page }) => {
    await gotoStory(page, 'surfaces-statcard--cyan');
    await expect(page.locator('.su-stat-card__value')).toHaveCSS('color', COLOR.cyan);
  });

  test('renders a title instead of a value', async ({ page }) => {
    await gotoStory(page, 'surfaces-statcard--with-title');
    await expect(page.locator('.su-stat-card__value')).toHaveCount(0);
    await expect(page.locator('.su-stat-card__title')).toHaveCSS('color', COLOR.fg2);
  });

  test('has no critical or serious a11y violations (source meets AA)', async ({ page }) => {
    await gotoStory(page, 'surfaces-statcard--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['surfaces-statcard--all-variants']);
});
