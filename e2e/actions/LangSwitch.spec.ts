import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Actions/LangSwitch', () => {
  test('marks the active language with the neon underline', async ({ page }) => {
    await gotoStory(page, 'actions-langswitch--japanese');
    const active = page.getByRole('button', { name: 'JA' });
    await expect(active).toHaveAttribute('aria-pressed', 'true');
    const underline = await active.evaluate((element) => {
      const style = getComputedStyle(element, '::after');
      return { background: style.backgroundColor, height: style.height };
    });
    expect(underline).toEqual({ background: COLOR.neon, height: '2px' });
    const inactive = await page
      .getByRole('button', { name: 'EN' })
      .evaluate((element) => getComputedStyle(element, '::after').content);
    expect(inactive).toBe('none');
  });

  test('selects a language with the keyboard (Tab + Enter / Space)', async ({ page }) => {
    await gotoStory(page, 'actions-langswitch--interactive');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'PT' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('current-lang')).toHaveText('PT');
    await expect(page.getByRole('button', { name: 'PT' })).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(page.getByTestId('current-lang')).toHaveText('JA');
  });

  test('keeps square segments and shows the cyan focus ring', async ({ page }) => {
    await gotoStory(page, 'actions-langswitch--default');
    for (const name of ['EN', 'PT', 'JA']) {
      await expect(page.getByRole('button', { name })).toHaveCSS('border-radius', '0px');
    }
    await page.keyboard.press('Tab');
    const focused = page.getByRole('button', { name: 'EN' });
    await expect(focused).toBeFocused();
    await expect(focused).toHaveCSS('outline-style', 'solid');
    await expect(focused).toHaveCSS('outline-color', COLOR.cyan);
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'actions-langswitch--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['actions-langswitch--all-variants']);
});
