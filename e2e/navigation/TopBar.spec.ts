import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Navigation/TopBar', () => {
  test('marks the active link with aria-current and the neon underline', async ({ page }) => {
    await gotoStory(page, 'navigation-topbar--default');
    const active = page.getByRole('link', { name: 'MANIFESTO' });
    await expect(active).toHaveAttribute('aria-current', 'page');
    await expect(active).toHaveCSS('color', COLOR.neon);
    await expect(active).toHaveCSS('border-bottom-color', COLOR.neon);
    await expect(page.getByRole('link', { name: 'PROCESS' })).toHaveCSS('color', COLOR.fg4);
  });

  test('lightens navigation links on hover', async ({ page }) => {
    await gotoStory(page, 'navigation-topbar--default');
    const link = page.getByRole('link', { name: 'PROCESS' });
    await link.hover();
    await expect(link).toHaveCSS('color', COLOR.fg2);
  });

  test('walks the header with the keyboard and shows the cyan focus ring', async ({ page }) => {
    await gotoStory(page, 'navigation-topbar--default');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'scrapup', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    const manifesto = page.getByRole('link', { name: 'MANIFESTO' });
    await expect(manifesto).toBeFocused();
    await expect(manifesto).toHaveCSS('outline-color', COLOR.cyan);
  });

  test('shows the language switch only when onLang is wired', async ({ page }) => {
    await gotoStory(page, 'navigation-topbar--default');
    await expect(page.getByRole('group', { name: 'Language' })).toHaveCount(0);
    await gotoStory(page, 'navigation-topbar--with-language');
    await page.getByRole('button', { name: 'JA' }).click();
    await expect(page.getByRole('button', { name: 'JA' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('opens the repository in a new tab without opener (D-06)', async ({ page }) => {
    await gotoStory(page, 'navigation-topbar--default');
    const repo = page.getByRole('link', { name: /github\.com\/scrapup/ });
    await expect(repo).toHaveAttribute('target', '_blank');
    await expect(repo).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'navigation-topbar--with-language');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['navigation-topbar--default', 'navigation-topbar--all-variants']);
});
