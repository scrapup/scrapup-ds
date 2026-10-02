import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/Callout', () => {
  test('sets the text off with the 2px neon left rule and emphasizes <strong>', async ({ page }) => {
    await gotoStory(page, 'content-callout--default');
    const callout = page.locator('.su-callout');
    await expect(callout).toHaveCSS('border-left-width', '2px');
    await expect(callout).toHaveCSS('border-left-color', COLOR.neon);
    await expect(callout).toHaveCSS('padding-left', '16px');
    await expect(page.locator('.su-callout__text')).toHaveCSS('color', COLOR.textMuted);
    await expect(page.locator('.su-callout strong')).toHaveCSS('color', COLOR.fg2);
  });

  test('renders the large display statement', async ({ page }) => {
    await gotoStory(page, 'content-callout--large');
    const text = page.locator('.su-callout__text');
    await expect(text).toHaveCSS('font-family', /Space Grotesk/);
    await expect(text).toHaveCSS('color', COLOR.fg3);
    await expect(page.locator('.su-callout')).toHaveCSS('padding-left', '18px');
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'content-callout--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-callout--all-variants']);
});
