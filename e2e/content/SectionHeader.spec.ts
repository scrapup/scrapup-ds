import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR, NEON_GLOW } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/SectionHeader', () => {
  test('renders the eyebrow, the h2 with a glowing highlight and the body', async ({ page }) => {
    await gotoStory(page, 'content-sectionheader--default');
    await expect(page.locator('.su-eyebrow')).toHaveText('// 02 — The process');
    await expect(page.getByRole('heading', { level: 2 })).toHaveCSS('color', COLOR.textHeading);
    const highlight = page.locator('.su-section-header__highlight');
    await expect(highlight).toHaveText('sealed');
    await expect(highlight).toHaveCSS('color', COLOR.neon);
    await expect(highlight).toHaveCSS('text-shadow', NEON_GLOW);
    await expect(page.locator('.su-section-header__body')).toContainText('Validator approves');
  });

  test('renders the xl manifesto opener with the glowing neon bar', async ({ page }) => {
    await gotoStory(page, 'content-sectionheader--manifesto');
    await expect(page.getByRole('heading', { level: 2 })).toHaveCSS('font-weight', '700');
    const bar = page.locator('.su-section-header__bar');
    await expect(bar).toHaveCSS('width', '68px');
    await expect(bar).toHaveCSS('height', '3px');
    await expect(bar).toHaveCSS('background-color', COLOR.neon);
    await expect(bar).toHaveCSS('box-shadow', NEON_GLOW);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'content-sectionheader--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-sectionheader--all-variants']);
});
