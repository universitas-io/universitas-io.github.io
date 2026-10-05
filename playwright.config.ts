import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] }
    }
  ],
  webServer: [
    {
      command: 'npm run build:preview && npm run preview -- --port 4321',
      port: 4321,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
    {
      command: 'npm run dev -- --port 4322',
      port: 4322,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    }
  ]
});
