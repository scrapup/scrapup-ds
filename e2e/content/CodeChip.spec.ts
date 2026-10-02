import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Content/CodeChip', () => {
  test('renders the code in cyan mono with the dim hint before it', async ({ page }) => {
    await gotoStory(page, 'content-codechip--with-hint');
    const code = page.locator('code.su-code-chip__code');
    await expect(code).toHaveText('/plugin install scrapup');
    await expect(code).toHaveCSS('color', COLOR.cyan);
    await expect(code).toHaveCSS('border-radius', '0px');
    await expect(code).toHaveCSS('font-family', /IBM Plex Mono/);
    await expect(page.locator('.su-code-chip__hint')).toHaveText('install:');
  });

  test('has no critical or serious a11y violations (hint meets AA)', async ({ page }) => {
    await gotoStory(page, 'content-codechip--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-codechip--all-variants']);
});
