import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { gotoStory } from '../support/story';
import { skipVisualOutsideContainer } from '../support/visual';

const STORY = 'foundations-tokens--default';
const NEON = 'rgb(255, 122, 51)';
const PINK = 'rgb(255, 61, 154)';

test.describe('Foundations/Tokens', () => {
  test('uses the neon accent by default', async ({ page }) => {
    await gotoStory(page, STORY);
    await expect(page.getByTestId('accent-swatch')).toHaveCSS('background-color', NEON);
  });

  test('re-tints every accent-derived style when --accent is overridden (RN-09)', async ({ page }) => {
    await gotoStory(page, STORY, { accent: 'pink' });
    await expect(page.getByTestId('accent-swatch')).toHaveCSS('background-color', PINK);
    const glow = page.getByTestId('glow-sample');
    await expect(glow).toHaveCSS('color', PINK);
    // Chromium serializes color-mix() results in the srgb color() notation (channels 0..1).
    const shadow = await glow.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(shadow).toContain('color(srgb 1 0.239216 0.603922');
    expect(shadow).not.toContain('color(srgb 1 0.478431 0.2');
  });

  test('falls back to the token font stacks when Google Fonts is blocked (RN-11)', async ({ page }) => {
    await gotoStory(page, STORY);
    const samples = {
      'type-display': /^"?Space Grotesk"?, "?Noto Sans JP"?, sans-serif$/,
      'type-body': /^"?IBM Plex Sans"?, "?Noto Sans JP"?, system-ui, sans-serif$/,
      'type-mono': /^"?IBM Plex Mono"?, "?Noto Sans JP"?, monospace$/,
    };
    for (const [testId, stack] of Object.entries(samples)) {
      const sample = page.getByTestId(testId);
      await expect(sample).toBeVisible();
      const family = await sample.evaluate((element) => getComputedStyle(element).fontFamily);
      expect(family).toMatch(stack);
      const width = await sample.evaluate((element) => element.getBoundingClientRect().width);
      expect(width).toBeGreaterThan(0);
    }
  });

  test('keeps swatch corners square (RN-10)', async ({ page }) => {
    await gotoStory(page, STORY);
    const radii = await page
      .getByTestId('swatch')
      .evaluateAll((swatches) => swatches.map((swatch) => getComputedStyle(swatch).borderRadius));
    expect(radii.length).toBeGreaterThan(0);
    expect(new Set(radii)).toEqual(new Set(['0px']));
  });

  test('has no critical or serious a11y violations', async ({ page }) => {
    await gotoStory(page, STORY);
    await expectNoA11yViolations(page);
  });

  test('matches the visual baseline', async ({ page }) => {
    skipVisualOutsideContainer();
    await gotoStory(page, STORY);
    await expect(page.locator('#storybook-root')).toHaveScreenshot('tokens.png');
  });
});
