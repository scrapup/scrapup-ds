import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { COLOR } from '../support/colors';
import { gotoStory } from '../support/story';
import { describeVisualBaselines } from '../support/visual';

const EMAIL = 'ada@scrapup.dev';

test.describe('Forms/WaitlistForm', () => {
  test('rejects an invalid e-mail with an alert (Invalid story)', async ({ page }) => {
    await gotoStory(page, 'forms-waitlistform--invalid');
    await expect(page.getByRole('alert')).toHaveText('Enter a valid e-mail address.');
    await expect(page.getByLabel('E-mail address')).toHaveAttribute('aria-invalid', 'true');
  });

  test('submits with the keyboard and shows the success panel (handler resolves)', async ({ page }) => {
    await gotoStory(page, 'forms-waitlistform--idle');
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('E-mail address')).toBeFocused();
    await expect(page.locator('.su-waitlist-form__field')).toHaveCSS('outline-color', COLOR.cyan);
    await page.keyboard.type(EMAIL);
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText("You're on the list.");
  });

  test('keeps the value and allows a retry when the handler rejects', async ({ page }) => {
    await gotoStory(page, 'forms-waitlistform--handler-rejects');
    await page.getByLabel('E-mail address').fill(EMAIL);
    await page.getByRole('button', { name: 'JOIN THE WAITLIST ↗' }).click();
    await expect(page.getByRole('alert')).toHaveText('Something went wrong. Try again.');
    await expect(page.getByLabel('E-mail address')).toHaveValue(EMAIL);
    await expect(page.getByRole('button')).toBeEnabled();
  });

  test('disables the button while submitting and ignores a double submit', async ({ page }) => {
    await gotoStory(page, 'forms-waitlistform--submitting');
    await page.getByLabel('E-mail address').fill(EMAIL);
    const button = page.getByRole('button');
    await button.click();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await page.getByLabel('E-mail address').press('Enter');
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('renders the brand field and button with square corners', async ({ page }) => {
    await gotoStory(page, 'forms-waitlistform--idle');
    const button = page.getByRole('button');
    await expect(button).toHaveCSS('background-color', COLOR.neon);
    await expect(button).toHaveCSS('border-radius', '0px');
    await expect(page.locator('.su-waitlist-form__field')).toHaveCSS('border-radius', '0px');
    await button.hover();
    await expect(button).toHaveCSS('filter', 'brightness(1.12)');
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, 'forms-waitlistform--all-variants');
    await expectNoA11yViolations(page);
  });

  describeVisualBaselines(['forms-waitlistform--all-variants']);
});
