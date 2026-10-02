import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

/**
 * Visual baselines are generated and compared only on the pinned Playwright container
 * (CI, or RUN_VISUAL=1 inside that container): host browsers and fonts render differently.
 */
export function skipVisualOutsideContainer(): void {
  test.skip(!process.env.CI && process.env.RUN_VISUAL !== '1', 'visual baselines run only on the pinned container');
}

/** Declares one visual-baseline test per story id (`<story-id>.png`). */
export function describeVisualBaselines(storyIds: readonly string[]): void {
  for (const id of storyIds) {
    test(`matches the visual baseline of ${id}`, async ({ page }) => {
      skipVisualOutsideContainer();
      await gotoStory(page, id);
      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${id}.png`);
    });
  }
}
