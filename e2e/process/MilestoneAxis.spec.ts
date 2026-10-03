import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR, NEON_GLOW } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Process/MilestoneAxis', () => {
  test('glows the current milestone and marks it as the current step', async ({ page }) => {
    await gotoStory(page, 'process-milestoneaxis--default');
    const current = page.locator('[aria-current="step"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveCSS('border-top-color', COLOR.neon);
    await expect(current).toHaveCSS('box-shadow', NEON_GLOW);
    await expect(current.locator('.su-milestone-axis__code')).toHaveText('IOC');
    await expect(current.locator('.su-milestone-axis__code')).toHaveCSS('color', COLOR.neon);
    await expect(current.locator('.su-milestone-axis__current-label')).toHaveText('NOW · BETA');
    await expect(current.locator('.su-milestone-axis__dot')).toHaveCSS('border-radius', '50%');
  });

  test('rules the other milestones in line-strong', async ({ page }) => {
    await gotoStory(page, 'process-milestoneaxis--no-current');
    await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
    await expect(page.locator('.su-milestone-axis__step').first()).toHaveCSS('border-top-color', COLOR.lineStrong);
    await expect(page.locator('.su-milestone-axis__meta')).toHaveCount(0);
  });

  test('has no critical or serious a11y violations (meta meets AA)', async ({ page }) => {
    await gotoStory(page, 'process-milestoneaxis--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['process-milestoneaxis--all-variants']);
});
