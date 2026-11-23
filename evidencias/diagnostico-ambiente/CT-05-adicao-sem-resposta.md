# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.js >> CT-05 - remover produto do carrinho
- Location: tests\toolshop.spec.js:175:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByTestId('cart-quantity')
Expected: "1"
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" getByTestId('cart-quantity') with timeout 15000ms
  - waiting for getByTestId('cart-quantity')

```

```yaml
- text: View the
- link "Documentation":
  - /url: https://testsmith-io.github.io/practice-software-testing/#/
- text: for this application. Practice Black Box Testing & Bug Hunting
- button "Testing Guide"
- button "🐛 Bug Hunting"
- navigation:
  - link "Practice Software Testing - Toolshop":
    - /url: /
    - img
  - menubar "Main menu":
    - menuitem "Home":
      - link "Home":
        - /url: /
    - menuitem "Categories":
      - button "Categories"
    - menuitem "Contact":
      - link "Contact":
        - /url: /contact
    - menuitem "Sign in":
      - link "Sign in":
        - /url: /auth/login
  - button "Select language": EN
- figure "Photo by Helinton Fantin on Unsplash.":
  - img "Combination Pliers"
  - text: Photo by
  - link "Helinton Fantin":
    - /url: https://unsplash.com/@fantin
  - text: "on"
  - link "Unsplash":
    - /url: https://unsplash.com/photos/W8BNwvOvW4M
  - text: .
- heading "Combination Pliers" [level=1]
- paragraph: Pliers ForgeFlex Tools
- text: "$14.15 CO₂: A B C D E"
- paragraph: Versatile combination pliers designed for gripping, bending, and cutting wire with ease. Featuring chrome vanadium steel construction with induction-hardened cutting edges, these pliers deliver excellent grip and leverage for a wide range of tasks. The precision-machined jaws combine flat gripping surfaces with a pipe-grip section and integrated wire cutter for true multi-purpose functionality. Ergonomic bi-component handles reduce hand fatigue during extended use and provide a secure hold even with oily or gloved hands. The joint is precisely fitted to eliminate play and ensure smooth operation over thousands of cycles. Ideal for electricians, mechanics, and DIY enthusiasts tackling everyday projects around the workshop or job site.
- button "Decrease quantity"
- text: Quantity
- spinbutton "Quantity": "1"
- button "Increase quantity"
- button "Add to cart"
- button "Add to favourites"
- button "Compare"
- heading "Specifications" [level=3]
- table:
  - rowgroup:
    - row "Handle Material Bi-component":
      - cell "Handle Material"
      - cell "Bi-component"
    - row "Length 200mm":
      - cell "Length"
      - cell "200mm"
    - row "Material Chrome Vanadium Steel":
      - cell "Material"
      - cell "Chrome Vanadium Steel"
    - row "Warranty 2years":
      - cell "Warranty"
      - cell "2years"
    - row "Weight 340g":
      - cell "Weight"
      - cell "340g"
- separator
- heading "Related products" [level=2]
- link "Pliers Pliers More information":
  - /url: /product/01M85A78N2C0BJJG3XK75NG7VC
  - img "Pliers"
  - heading "Pliers" [level=5]
  - link "More information":
    - /url: "#"
- link "Bolt Cutters Bolt Cutters More information":
  - /url: /product/01M85A78N8MQCBG74H2FSYNWHQ
  - img "Bolt Cutters"
  - heading "Bolt Cutters" [level=5]
  - link "More information":
    - /url: "#"
- link "Long Nose Pliers Long Nose Pliers More information":
  - /url: /product/01M85A78NE3Q0B1KZAXV6QGBGS
  - img "Long Nose Pliers"
  - heading "Long Nose Pliers" [level=5]
  - link "More information":
    - /url: "#"
- link "Slip Joint Pliers Slip Joint Pliers More information":
  - /url: /product/01M85A78NPHWRZEN6BN6Z3JEGP
  - img "Slip Joint Pliers"
  - heading "Slip Joint Pliers" [level=5]
  - link "More information":
    - /url: "#"
- contentinfo:
  - text: Learn & Explore
  - link "Learn Test Automation Hands-on courses for Playwright, Robot Framework, APIs and more":
    - /url: https://onlinecourses.testsmith.io
  - link "API Spector Open-source API testing, mocking and contract testing":
    - /url: https://api-spector.dev
  - link "GitHub Source code, issues and contributions":
    - /url: https://github.com/testsmith-io/practice-software-testing
  - text: This is a DEMO application, used for software testing training purpose. |
  - link "Privacy Policy":
    - /url: /privacy
  - text: "| Banner photo by"
  - link "Barn Images":
    - /url: https://unsplash.com/@barnimages
  - text: "on"
  - link "Unsplash":
    - /url: https://unsplash.com/photos/t5YUoHW6zRo
  - text: . v2.5 | Built 2026-10-11 | Angular 20.0.5
- button "Open chat":
  - img
- button "Show live shop activity"
```

# Test source

```ts
  1   | const { test, expect } = require('./fixtures');
  2   | const { randomUUID } = require('node:crypto');
  3   |
  4   | // Conta pública de demonstração documentada pelo Toolshop.
  5   | // Se ela mudar, é possível informar outra por variáveis de ambiente.
  6   | const conta = {
  7   |   email:
  8   |     process.env.TOOLSHOP_EMAIL ||
  9   |     'customer@practicesoftwaretesting.com',
  10  |
  11  |   senha:
  12  |     process.env.TOOLSHOP_PASSWORD ||
  13  |     'welcome01',
  14  |
  15  |   nome:
  16  |     process.env.TOOLSHOP_NOME ||
  17  |     'Jane',
  18  | };
  19  |
  20  | // Converte "$12.50" em 1250 centavos para comparar valores.
  21  | function centavos(texto) {
  22  |   return Math.round(
  23  |     Number(texto.replace(/[^0-9.]/g, '')) * 100
  24  |   );
  25  | }
  26  |
  27  | async function entrar(page, email, senha) {
  28  |   await page.getByTestId('email').fill(email);
  29  |   await page.getByTestId('password').fill(senha);
  30  |   await page.getByTestId('login-submit').click();
  31  | }
  32  |
  33  | // Cada teste de carrinho chama esta função.
  34  | // Assim, nenhum depende de outro teste ter sido executado.
  35  | async function prepararCarrinho(page) {
  36  |   await page.goto('/');
  37  |
  38  |   // Produto específico para tornar a execução reproduzível.
  39  |   await page
  40  |     .getByRole('heading', { name: 'Combination Pliers', exact: true })
  41  |     .click();
  42  |
  43  |   await expect(page.getByTestId('quantity')).toHaveValue('1');
  44  |   await expect(page.getByTestId('add-to-cart')).toBeEnabled();
  45  |
  46  |   const preco = centavos(
  47  |     await page.getByTestId('unit-price').innerText()
  48  |   );
  49  |
  50  |   await page.getByTestId('add-to-cart').click();
  51  |
> 52  |   await expect(page.getByTestId('cart-quantity')).toHaveText('1');
      |                                                   ^ Error: expect(locator).toHaveText(expected) failed
  53  |
  54  |   await page.getByTestId('nav-cart').click();
  55  |
  56  |   await expect(page.getByTestId('product-title')).toHaveCount(1);
  57  |   await expect(page.getByTestId('product-title'))
  58  |     .toContainText('Combination Pliers');
  59  |
  60  |   return preco;
  61  | }
  62  |
  63  | async function preencherCadastro(page, email) {
  64  |   await page.goto('/auth/register');
  65  |
  66  |   await page.getByTestId('first-name').fill('Pessoa');
  67  |   await page.getByTestId('last-name').fill('Teste');
  68  |   await page.getByTestId('dob').fill('1995-05-15');
  69  |   await page.getByTestId('country').selectOption('BR');
  70  |   await page.getByTestId('postal_code').fill('50000000');
  71  |
  72  |   // O campo foi acrescentado em versões recentes do sistema.
  73  |   const numero = page.getByTestId('house_number');
  74  |
  75  |   if (await numero.count()) {
  76  |     await numero.fill('123');
  77  |     await numero.blur();
  78  |
  79  |     await expect(
  80  |       page.getByTestId('postcode-lookup-loading')
  81  |     ).toBeHidden();
  82  |   }
  83  |
  84  |   await page.getByTestId('street').fill('Rua de Teste');
  85  |   await page.getByTestId('city').fill('Recife');
  86  |   await page.getByTestId('state').fill('Pernambuco');
  87  |   await page.getByTestId('phone').fill('81999990000');
  88  |   await page.getByTestId('email').fill(email);
  89  |   await page.getByTestId('password').fill('Teste@2026Seguro');
  90  | }
  91  |
  92  | // Identifica a resposta da pesquisa.
  93  | // Aceita GET e QUERY, usados em diferentes versões do Toolshop.
  94  | function respostaDeBusca(response) {
  95  |   const caminho = new URL(response.url()).pathname;
  96  |
  97  |   return caminho.endsWith('/products/search') &&
  98  |     response.request().method() !== 'OPTIONS';
  99  | }
  100 |
  101 | async function pesquisar(page, termo) {
  102 |   await page.getByTestId('search-query').fill(termo);
  103 |
  104 |   const respostaPendente = page.waitForResponse(respostaDeBusca);
  105 |
  106 |   await page.getByTestId('search-submit').click();
  107 |
  108 |   const resposta = await respostaPendente;
  109 |
  110 |   // Evita confundir erro do servidor com uma busca sem resultados.
  111 |   expect(resposta.ok(), 'A pesquisa deve responder com sucesso')
  112 |     .toBeTruthy();
  113 |
  114 |   await expect(page.getByTestId('search_completed')).toBeVisible();
  115 | }
  116 |
  117 | // ---------------- LOGIN ----------------
  118 |
  119 | test('CT-01 - login com credenciais válidas', async ({ page }) => {
  120 |   await page.goto('/');
  121 |   await page.getByTestId('nav-sign-in').click();
  122 |
  123 |   await entrar(page, conta.email, conta.senha);
  124 |
  125 |   await expect(page).toHaveURL(/\/account\/?$/);
  126 |   await expect(page.getByTestId('nav-menu')).toContainText(conta.nome);
  127 | });
  128 |
  129 | test('CT-02 - login com senha incorreta', async ({ page }) => {
  130 |   await page.goto('/auth/login');
  131 |
  132 |   await entrar(page, conta.email, 'SenhaIncorreta@987');
  133 |
  134 |   await expect(page.getByTestId('login-error')).toBeVisible();
  135 |   await expect(page.getByTestId('login-error'))
  136 |     .toContainText(/invalid email or password/i);
  137 |
  138 |   await expect(page).toHaveURL(/\/auth\/login\/?$/);
  139 |   await expect(page.getByTestId('nav-sign-in')).toBeVisible();
  140 | });
  141 |
  142 | // ---------------- CARRINHO ----------------
  143 |
  144 | test('CT-03 - adicionar produto ao carrinho', async ({ page }) => {
  145 |   const preco = await prepararCarrinho(page);
  146 |
  147 |   await expect(page.getByTestId('product-quantity')).toHaveValue('1');
  148 |
  149 |   expect(
  150 |     centavos(await page.getByTestId('product-price').innerText())
  151 |   ).toBe(preco);
  152 |
```
