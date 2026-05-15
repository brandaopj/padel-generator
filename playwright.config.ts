import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests/e2e',
  reporter: isCI
    ? [['list'], ['allure-playwright', { resultsDir: 'allure-results-e2e' }]]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: isCI ? 'npm run preview' : 'npm run dev',
    url: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
    reuseExistingServer: !isCI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
