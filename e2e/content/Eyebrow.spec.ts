import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/Eyebrow', () => {
  test('renders the indexed mono uppercase label in cyan', async ({ page }) => {
    await gotoStory(page, 'content-eyebrow--default');
    const eyebrow = page.locator('.su-eyebrow');
    await expect(eyebrow).toHaveText('// 02 — The process');
    await expect(eyebrow).toHaveCSS('text-transform', 'uppercase');
    await expect(eyebrow).toHaveCSS('letter-spacing', '2.2px');
    await expect(eyebrow).toHaveCSS('color', COLOR.cyan);
    await expect(eyebrow).toHaveCSS('font-family', /IBM Plex Mono/);
  });

  test('applies the neon and muted tones', async ({ page }) => {
    await gotoStory(page, 'content-eyebrow--neon');
    await expect(page.locator('.su-eyebrow')).toHaveCSS('color', COLOR.neon);
    await gotoStory(page, 'content-eyebrow--muted');
    await expect(page.locator('.su-eyebrow')).toHaveCSS('color', COLOR.fg6);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'content-eyebrow--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-eyebrow--all-variants']);
});
