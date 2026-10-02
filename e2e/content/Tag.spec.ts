import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

const TONES = [
  { id: 'content-tag--default', color: COLOR.cyan, padding: '6px 12px' },
  { id: 'content-tag--quiet', color: COLOR.fg3, padding: '7px 13px' },
  { id: 'content-tag--neon', color: COLOR.neon, padding: '6px 12px' },
] as const;

test.describe('Content/Tag', () => {
  for (const { id, color, padding } of TONES) {
    test(`renders ${id} with its tone and square corners`, async ({ page }) => {
      await gotoStory(page, id);
      const tag = page.locator('.su-tag');
      await expect(tag).toHaveCSS('color', color);
      await expect(tag).toHaveCSS('padding', padding);
      await expect(tag).toHaveCSS('border-radius', '0px');
    });
  }

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'content-tag--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['content-tag--all-variants']);
});
