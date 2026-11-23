# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.js >> CT-06 - cadastro sem e-mail obrigatório
- Location: tests\toolshop.spec.js:216:1

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
  16 |       await testInfo.attach('estado-final', {
> 17 |         body: await page.screenshot({ fullPage: true }),
     |                          ^ TimeoutError: page.screenshot: Timeout 15000ms exceeded.
  18 |         contentType: 'image/png',
  19 |       });
  20 |     }
  21 |   }, { auto: true }],
  22 | });
  23 |
  24 | module.exports = { test, expect };
  25 |
```
