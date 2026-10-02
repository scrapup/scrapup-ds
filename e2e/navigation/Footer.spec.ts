import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

test.describe('Navigation/Footer', () => {
  test('renders the full-bleed band with the static mono wordmark', async ({ page }) => {
    await gotoStory(page, 'navigation-footer--default');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toHaveCSS('background-color', COLOR.footerBand);
    const viewport = page.viewportSize()?.width;
    await expect.poll(() => footer.evaluate((element) => element.getBoundingClientRect().width)).toBe(viewport);
    const wordmark = page.locator('.su-footer__wordmark');
    await expect(wordmark).toHaveCSS('font-family', /IBM Plex Mono/);
    await expect(page.locator('.su-footer .su-wordmark__up')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.su-footer__item').first()).toHaveCSS('color', COLOR.fg6);
  });

  test('lightens links on hover', async ({ page }) => {
    await gotoStory(page, 'navigation-footer--default');
    const link = page.getByRole('link', { name: 'github' });
    await expect(link).toHaveCSS('color', COLOR.footerInk);
    await link.hover();
    await expect(link).toHaveCSS('color', COLOR.fg2);
  });

  test('reaches links with the keyboard and shows the cyan focus ring', async ({ page }) => {
    await gotoStory(page, 'navigation-footer--default');
    await page.keyboard.press('Tab');
    const link = page.getByRole('link', { name: 'github' });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-color', COLOR.cyan);
  });

  test('renders action-only links as unstyled buttons', async ({ page }) => {
    await gotoStory(page, 'navigation-footer--all-variants');
    const button = page.getByRole('button', { name: 'privacy' });
    await expect(button).toHaveCSS('background-color', COLOR.transparent);
    await expect(button).toHaveCSS('border-top-width', '0px');
    await expect(button).toHaveCSS('color', COLOR.footerInk);
  });

  // AllVariants stacks several <footer> landmarks (landmark rules); audit one composed footer instead.
  test('has no critical or serious a11y violations (meta meets AA)', async ({ page }) => {
    await gotoStory(page, 'navigation-footer--default');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['navigation-footer--default', 'navigation-footer--all-variants']);
});
