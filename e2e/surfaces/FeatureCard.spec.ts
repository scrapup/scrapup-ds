import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Surfaces/FeatureCard', () => {
  test('renders the neon index and the card title heading', async ({ page }) => {
    await gotoStory(page, 'surfaces-featurecard--default');
    await expect(page.locator('.su-feature-card__index')).toHaveCSS('color', COLOR.neon);
    const title = page.getByRole('heading', { level: 3, name: 'Traceable contract' });
    await expect(title).toHaveCSS('font-family', /Space Grotesk/);
    await expect(title).toHaveCSS('color', COLOR.fg2);
    await expect(page.locator('.su-feature-card__body')).toHaveCSS('color', COLOR.textMuted);
  });

  test('renders the role card with a cyan label, larger title and cyan edge', async ({ page }) => {
    await gotoStory(page, 'surfaces-featurecard--role');
    await expect(page.locator('.su-feature-card__label')).toHaveCSS('color', COLOR.cyan);
    const roleTitlePx = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.35);
    await expect(page.locator('.su-feature-card__title')).toHaveCSS('font-size', `${String(roleTitlePx)}px`);
    await expect(page.locator('.su-feature-card')).toHaveCSS('border-left-color', COLOR.cyan);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'surfaces-featurecard--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['surfaces-featurecard--all-variants']);
});
