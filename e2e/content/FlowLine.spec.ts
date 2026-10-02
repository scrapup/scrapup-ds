import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/FlowLine', () => {
  test('joins the steps with cyan arrows and highlights the last step', async ({ page }) => {
    await gotoStory(page, 'content-flowline--default');
    await expect(page.locator('.su-flow-line')).toHaveText('scrap → forge → forged delivery');
    await expect(page.locator('.su-flow-line__arrow').first()).toHaveCSS('color', COLOR.cyan);
    await expect(page.locator('.su-flow-line__step--last')).toHaveCSS('color', COLOR.neon);
  });

  test('has no critical or serious a11y violations (steps meet AA)', async ({ page }) => {
    await gotoStory(page, 'content-flowline--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-flowline--all-variants']);
});
