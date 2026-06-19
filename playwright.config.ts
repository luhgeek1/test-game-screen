import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 15000,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:8731',
    trace: 'off',
    viewport: { width: 1490, height: 838 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1490, height: 838 } },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:8731',
    reuseExistingServer: !process.env.CI,
  },
});
