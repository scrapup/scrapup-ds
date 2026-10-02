import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

const CYAN = 'rgb(53, 230, 224)';

test.describe('Actions/Button', () => {
  test('renders the primary button in neon with square corners', async ({ page }) => {
    await gotoStory(page, 'actions-button--primary');
    const button = page.getByRole('button', { name: 'JOIN THE WAITLIST ↗' });
    await expect(button).toHaveCSS('background-color', 'rgb(255, 122, 51)');
    await expect(button).toHaveCSS('color', 'rgb(10, 13, 21)');
    await expect(button).toHaveCSS('border-radius', '0px');
    await expect(button).toHaveCSS('padding', '14px 22px');
    await expect(button).toHaveCSS('font-family', /IBM Plex Mono/);
  });

  test('brightens the primary button on hover', async ({ page }) => {
    await gotoStory(page, 'actions-button--primary');
    const button = page.getByRole('button');
    await expect(button).toHaveCSS('filter', 'none');
    await button.hover();
    await expect(button).toHaveCSS('filter', 'brightness(1.12)');
  });

  test('washes the secondary button in cyan on hover', async ({ page }) => {
    await gotoStory(page, 'actions-button--secondary');
    const button = page.getByRole('button', { name: 'STAR ON GITHUB' });
    await expect(button).toHaveCSS('color', CYAN);
    await expect(button).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await button.hover();
    await expect(button).toHaveCSS('background-color', 'rgba(53, 230, 224, 0.08)');
  });

  test('renders the link variant as bare cyan text that lightens on hover', async ({ page }) => {
    await gotoStory(page, 'actions-button--link');
    const link = page.getByRole('link', { name: 'BACK TO SCRAPUP' });
    await expect(link).toHaveCSS('padding', '0px');
    await expect(link).toHaveCSS('color', CYAN);
    await link.hover();
    await expect(link).toHaveCSS('color', 'rgb(236, 238, 244)');
  });

  test('shows the cyan focus ring on keyboard focus only', async ({ page }) => {
    await gotoStory(page, 'actions-button--primary');
    const button = page.getByRole('button');
    await button.click();
    await expect(button).toHaveCSS('outline-style', 'none');
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS('outline-style', 'solid');
    await expect(button).toHaveCSS('outline-color', CYAN);
  });

  test('opens external links in a new tab without opener (D-06)', async ({ page }) => {
    await gotoStory(page, 'actions-button--external');
    const link = page.getByRole('link', { name: 'GITHUB ↗' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'actions-button--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['actions-button--all-variants']);
});
