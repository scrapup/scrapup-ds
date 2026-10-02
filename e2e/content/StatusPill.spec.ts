import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/StatusPill', () => {
  test('renders a square neon pill with a round glowing dot', async ({ page }) => {
    await gotoStory(page, 'content-statuspill--default');
    const pill = page.locator('.su-status-pill');
    await expect(pill).toHaveCSS('border-radius', '0px');
    await expect(pill).toHaveCSS('color', COLOR.neon);
    await expect(pill).toHaveCSS('box-shadow', /color\(srgb 1 0\.478431 0\.2/);
    const dot = page.locator('.su-status-pill__dot');
    await expect(dot).toHaveCSS('border-radius', '50%');
    await expect(dot).toHaveCSS('background-color', COLOR.neon);
  });

  test('renders without the dot', async ({ page }) => {
    await gotoStory(page, 'content-statuspill--without-dot');
    await expect(page.locator('.su-status-pill__dot')).toHaveCount(0);
    await expect(page.locator('.su-status-pill')).toBeVisible();
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'content-statuspill--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-statuspill--all-variants']);
});
