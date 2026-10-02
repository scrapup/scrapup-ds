import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Surfaces/ValueStatement', () => {
  test('glows the preferred term and keeps the rest grey', async ({ page }) => {
    await gotoStory(page, 'surfaces-valuestatement--default');
    await expect(page.locator('.su-value-statement__row')).toHaveCount(3);
    await expect(page.locator('.su-value-statement__preferred').first()).toHaveCSS('color', COLOR.neon);
    await expect(page.locator('.su-value-statement__row').first()).toHaveCSS('color', COLOR.fg6);
    await expect(page.locator('.su-value-statement')).toHaveCSS('padding', '42px');
  });

  test('omits the note when absent', async ({ page }) => {
    await gotoStory(page, 'surfaces-valuestatement--without-note');
    await expect(page.locator('.su-value-statement__note')).toHaveCount(0);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'surfaces-valuestatement--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['surfaces-valuestatement--all-variants']);
});
