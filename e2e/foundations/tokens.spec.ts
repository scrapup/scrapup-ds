import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';
import { gotoStory } from '../support/story';
import { skipVisualOutsideContainer } from '../support/visual';

const STORY = 'foundations-tokens--default';
const NEON = 'rgb(255, 122, 51)';
const PINK = 'rgb(255, 61, 154)';
// Chromium serializes color-mix() results in the srgb color() notation (channels 0..1).
const PINK_SRGB = 'color(srgb 1 0.239216 0.603922';
const NEON_SRGB = 'color(srgb 1 0.478431 0.2';

test.describe('Foundations/Tokens', () => {
  test('uses the neon accent by default', async ({ page }) => {
    await gotoStory(page, STORY);
    await expect(page.getByTestId('accent-swatch')).toHaveCSS('background-color', NEON);
  });

  // Expected button glow: --glow-button = color-mix(accent 42%), serialized by Chromium in srgb.
  const ALTERNATES = [
    { accent: 'pink', rgb: PINK, srgb: PINK_SRGB },
    { accent: 'cyan', rgb: 'rgb(53, 230, 224)', srgb: 'color(srgb 0.207843 0.901961 0.878431' },
    { accent: 'violet', rgb: 'rgb(179, 136, 255)', srgb: 'color(srgb 0.701961 0.533333 1' },
  ] as const;
  for (const { accent, rgb, srgb } of ALTERNATES) {
    test(`re-tints the accent swatch, text and derived glow for the ${accent} accent (RN-09)`, async ({ page }) => {
      await gotoStory(page, STORY, { accent });
      await expect(page.getByTestId('accent-swatch')).toHaveCSS('background-color', rgb);
      const glow = page.getByTestId('glow-sample');
      await expect(glow).toHaveCSS('color', rgb);
      const shadow = await glow.evaluate((element) => getComputedStyle(element).boxShadow);
      expect(shadow).toContain(srgb);
      expect(shadow).not.toContain(NEON_SRGB);
    });
  }

  test('falls back to the token font stacks when Google Fonts is blocked (RN-11)', async ({ page }) => {
    await gotoStory(page, STORY); // gotoStory aborts every fonts.googleapis/gstatic request
    // No webfont face may be loaded: the text renders with the fallback families.
    const loadedFaces = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family);
    });
    expect(loadedFaces).toEqual([]);
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
