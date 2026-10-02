import { test } from '@playwright/test';

/**
 * Visual baselines are generated and compared only on the pinned Playwright container
 * (CI, or RUN_VISUAL=1 inside that container): host browsers and fonts render differently.
 */
export function skipVisualOutsideContainer(): void {
  test.skip(!process.env.CI && process.env.RUN_VISUAL !== '1', 'visual baselines run only on the pinned container');
}
