# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.js >> CT-07 - cadastrar conta válida e fazer login
- Location: tests\toolshop.spec.js:242:1

# Error details

```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://practicesoftwaretesting.com/auth/register", waiting until "load"

```

```
TimeoutError: page.screenshot: Timeout 15000ms exceeded.
Call log:
  - taking page screenshot
  - waiting for fonts to load...
  - fonts loaded

```

# Test source

```ts
  1  | const { test: base, expect } = require('@playwright/test');
  2  |
  3  | const test = base.extend({
  4  |   evidencia: [async ({ page, browser }, use, testInfo) => {
  5  |     await use();
  6  |     await testInfo.attach('ambiente', {
  7  |       body: JSON.stringify({
  8  |         navegador: browser.browserType().name(),
  9  |         versao: browser.version(),
  10 |         url: page.url(),
  11 |         titulo: await page.title().catch(() => 'Página indisponível'),
  12 |       }, null, 2),
  13 |       contentType: 'application/json',
  14 |     });
  15 |     if (!page.isClosed()) {
  16 |       try {
> 17 |         await testInfo.attach('estado-final', {
     |                          ^ TimeoutError: page.screenshot: Timeout 15000ms exceeded.
  18 |           body: await page.screenshot({ fullPage: true, timeout: 10000 }),
  19 |           contentType: 'image/png',
  20 |         });
  21 |       } catch (erro) {
  22 |         await testInfo.attach('captura-indisponivel', {
  23 |           body: String(erro),
  24 |           contentType: 'text/plain',
  25 |         });
  26 |       }
  27 |     }
  28 |   }, { auto: true }],
  29 | });
  30 |
  31 | module.exports = { test, expect };
  32 |
```
