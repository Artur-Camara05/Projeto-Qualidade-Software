const { defineConfig, devices } = require('@playwright/test');
const os = require('node:os');
const path = require('node:path');

module.exports = defineConfig({
  testDir: './tests',
  // O workspace usa OneDrive, que pode bloquear os arquivos ativos do trace.
  outputDir: path.join(os.tmpdir(), 'toolshop-playwright', 'test-results'),
  fullyParallel: false,
  workers: 1,
  timeout: 60000,

  expect: {
    timeout: 15000,
  },

  forbidOnly: !!process.env.CI,
  retries: 0,

  // Listar casos não deve sobrescrever evidências de uma execução real.
  reporter: process.argv.includes('--list') ? [['list']] : [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/resultados.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['./scripts/relatorio.js'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    locale: 'en-US',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
