import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/Hero', () => {
  test('renders the h1 with exactly one glowing highlight', async ({ page }) => {
    await gotoStory(page, 'content-hero--default');
    const title = page.getByRole('heading', { level: 1 });
    await expect(title).toHaveText('From scrap to forged, auditable delivery.');
    await expect(title).toHaveCSS('font-family', /Space Grotesk/);
    const highlight = page.locator('.su-hero__highlight');
    await expect(highlight).toHaveCount(1);
    await expect(highlight).toHaveText('forged');
    await expect(highlight).toHaveCSS('color', COLOR.neon);
    await expect(highlight).toHaveCSS('text-shadow', /color\(srgb 1 0\.478431 0\.2/);
  });

  test('composes the status pill, callout and actions', async ({ page }) => {
    await gotoStory(page, 'content-hero--default');
    await expect(page.locator('.su-status-pill')).toHaveText('BETA — PUBLIC RELEASE');
    await expect(page.locator('.su-callout')).toBeVisible();
    await expect(page.getByRole('link', { name: 'JOIN THE WAITLIST ↗' })).toBeVisible();
  });

  test('renders only the title in the minimal hero', async ({ page }) => {
    await gotoStory(page, 'content-hero--minimal');
    await expect(page.locator('.su-hero > *')).toHaveCount(1);
    await expect(page.locator('.su-hero__highlight')).toHaveCount(0);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'content-hero--default');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-hero--default', 'content-hero--minimal']);
});
