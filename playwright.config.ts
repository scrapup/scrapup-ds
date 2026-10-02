import { defineConfig, devices } from '@playwright/test';

const PORT = 6007;
const CI = Boolean(process.env.CI);

// E2E runs against the built catalog (storybook-static) — plan §5.4. Visual baselines are generated
// and updated only on the pinned container mcr.microsoft.com/playwright:v1.63.0-noble.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  failOnFlakyTests: CI,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: 'e2e/__screenshots__/{testFileName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
    },
  ],
  webServer: {
    command: `npx http-server storybook-static -p ${PORT} -a 127.0.0.1 -s`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !CI,
  },
});
