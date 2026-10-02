import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Surfaces/StatementList', () => {
  test('renders a ruled ordered list with neon numbers', async ({ page }) => {
    await gotoStory(page, 'surfaces-statementlist--default');
    await expect(page.getByRole('listitem')).toHaveCount(3);
    await expect(page.locator('.su-statement-list__number').first()).toHaveText('01');
    await expect(page.locator('.su-statement-list__number').first()).toHaveCSS('color', COLOR.neon);
    await expect(page.locator('.su-statement-list')).toHaveCSS('list-style-type', 'none');
    await expect(page.locator('.su-statement-list')).toHaveCSS('border-top-style', 'solid');
    await expect(page.locator('.su-statement-list__item').first()).toHaveCSS('border-bottom-style', 'solid');
    await expect(page.locator('.su-statement-list__text').first()).toHaveCSS('color', COLOR.textHeading);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'surfaces-statementlist--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['surfaces-statementlist--all-variants']);
});
