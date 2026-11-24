const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  // Deixa tempo para salvar os relatórios antes do limite do job.
  globalTimeout: 10 * 60 * 1000,

  expect: {
    timeout: 15000,
  },

  forbidOnly: !!process.env.CI,
  retries: 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.TOOLSHOP_BASE_URL || 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    locale: 'en-US',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
