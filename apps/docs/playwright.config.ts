import { defineConfig, devices } from '@playwright/test';

const PORT = 6006;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  // Same machine, same pixels: keep screenshot names free of the OS so CI and local can share baselines
  // when both run in the official Playwright container.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 900, height: 640 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 0, threshold: 0.1, animations: 'disabled', caret: 'hide' },
  },
  webServer: {
    command: `npx http-server storybook-static -p ${PORT} -s`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 900, height: 640 } },
    },
  ],
});
