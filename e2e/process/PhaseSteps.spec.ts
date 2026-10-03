import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Process/PhaseSteps', () => {
  test('renders column-ruled steps with neon numbers and lowercase titles', async ({ page }) => {
    await gotoStory(page, 'process-phasesteps--default');
    const steps = page.locator('.su-phase-steps__step');
    await expect(steps).toHaveCount(3);
    await expect(page.locator('.su-phase-steps__number').first()).toHaveCSS('color', COLOR.neon);
    await expect(page.locator('.su-phase-steps__title').first()).toHaveCSS('text-transform', 'lowercase');
    await expect(steps.first()).toHaveCSS('border-right-style', 'solid');
    await expect(steps.last()).toHaveCSS('border-right-style', 'none');
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'process-phasesteps--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['process-phasesteps--all-variants']);
});
