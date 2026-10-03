import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Feedback/GlitchCode', () => {
  test('animates the channel split, slice and flicker by default (RN-18)', async ({ page }) => {
    await gotoStory(page, 'feedback-glitchcode--default');
    await expect(page.locator('.su-glitch-code__layer--cyan')).toHaveCSS('animation-name', 'scrapupGlitchC');
    await expect(page.locator('.su-glitch-code__layer--magenta')).toHaveCSS('animation-name', 'scrapupGlitchM');
    await expect(page.locator('.su-glitch-code__layer--slice')).toHaveCSS('animation-name', 'scrapupGlitchSlice');
    await expect(page.locator('.su-glitch-code__main')).toHaveCSS('animation-name', 'scrapupFlicker');
    await expect(page.locator('.su-glitch-code__layer--magenta')).toHaveCSS('color', COLOR.magenta);
  });

  test('renders static when animated is off (RN-18)', async ({ page }) => {
    await gotoStory(page, 'feedback-glitchcode--static');
    for (const selector of ['.su-glitch-code__layer--cyan', '.su-glitch-code__layer--slice', '.su-glitch-code__main']) {
      await expect(page.locator(selector)).toHaveCSS('animation-name', 'none');
    }
    await expect(page.locator('.su-glitch-code__layer--cyan')).toHaveCSS('opacity', '0');
    await expect(page.locator('.su-glitch-code__main')).toHaveCSS('color', COLOR.neon);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'feedback-glitchcode--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['feedback-glitchcode--all-variants']);
});
