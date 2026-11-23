const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  evidencia: [async ({ page, browser }, use, testInfo) => {
    await use();
    await testInfo.attach('ambiente', {
      body: JSON.stringify({
        navegador: browser.browserType().name(),
        versao: browser.version(),
        url: page.url(),
        titulo: await page.title().catch(() => 'Página indisponível'),
      }, null, 2),
      contentType: 'application/json',
    });
    if (!page.isClosed()) {
      try {
        await testInfo.attach('estado-final', {
          body: await page.screenshot({ fullPage: true, timeout: 10000 }),
          contentType: 'image/png',
        });
      } catch (erro) {
        await testInfo.attach('captura-indisponivel', {
          body: String(erro),
          contentType: 'text/plain',
        });
      }
    }
  }, { auto: true }],
});

module.exports = { test, expect };
