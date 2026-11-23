# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.js >> CT-05 - remover produto do carrinho
- Location: tests\toolshop.spec.js:184:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('product-title')
Expected: 0
Received: 1
Timeout:  15000ms

Call log:
  - Expect "toHaveCount" getByTestId('product-title') with timeout 15000ms
  - waiting for getByTestId('product-title')
    34 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - text: View the
    - link "Documentation" [ref=e4] [cursor=pointer]:
      - /url: https://testsmith-io.github.io/practice-software-testing/#/
    - text: for this application.
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]: Practice Black Box Testing & Bug Hunting
      - button "Testing Guide" [ref=e9] [cursor=pointer]
      - button "🐛 Bug Hunting" [ref=e10] [cursor=pointer]
    - navigation [ref=e11]:
      - generic [ref=e12]:
        - link "Practice Software Testing - Toolshop" [ref=e13] [cursor=pointer]:
          - /url: /
        - generic [ref=e32]:
          - menubar "Main menu" [ref=e33]:
            - menuitem [ref=e34]:
              - link "Home" [ref=e35] [cursor=pointer]:
                - /url: /
            - menuitem [ref=e36]:
              - button "Categories" [ref=e37] [cursor=pointer]
            - menuitem [ref=e38]:
              - link "Contact" [ref=e39] [cursor=pointer]:
                - /url: /contact
            - menuitem [ref=e40]:
              - link "Sign in" [ref=e41] [cursor=pointer]:
                - /url: /auth/login
            - menuitem [ref=e42]:
              - link "cart" [ref=e43] [cursor=pointer]:
                - /url: /checkout
                - generic [ref=e47]: "1"
          - button "Select language" [ref=e49] [cursor=pointer]: EN
  - generic [ref=e55]:
    - list [ref=e57]:
      - listitem:
        - generic:
          - generic: Cart
          - generic: "1"
      - listitem:
        - generic:
          - generic: Sign in
          - generic: "2"
      - listitem:
        - generic:
          - generic: Billing Address
          - generic: "3"
      - listitem:
        - generic:
          - generic: Payment
          - generic: "4"
    - generic [ref=e61]:
      - table [ref=e62]:
        - rowgroup [ref=e63]:
          - row [ref=e64]:
            - columnheader "Item" [ref=e65]
            - columnheader "Quantity" [ref=e66]
            - columnheader "Price" [ref=e67]
            - columnheader "Total" [ref=e68]
            - columnheader [ref=e69]
        - rowgroup [ref=e70]:
          - row [ref=e71]:
            - cell "Combination Pliers" [ref=e72]
            - cell [ref=e74]:
              - spinbutton "Quantity for Combination Pliers" [ref=e76]: "1"
            - cell "$14.15" [ref=e77]
            - cell "$14.15" [ref=e78]
            - cell [ref=e79]:
              - generic [ref=e80] [cursor=pointer]
        - rowgroup [ref=e84]:
          - row [ref=e85]:
            - cell [ref=e86]
            - cell [ref=e87]
            - cell [ref=e88]:
              - strong [ref=e89]: Total
            - cell "$14.15" [ref=e90]
            - cell [ref=e91]
      - generic [ref=e92]:
        - button "Continue Shopping" [ref=e93] [cursor=pointer]
        - button "Proceed to checkout" [ref=e94] [cursor=pointer]
  - contentinfo [ref=e96]:
    - generic [ref=e98]:
      - generic [ref=e99]: Learn & Explore
      - generic [ref=e100]:
        - link "Learn Test Automation Hands-on courses for Playwright, Robot Framework, APIs and more" [ref=e102] [cursor=pointer]:
          - /url: https://onlinecourses.testsmith.io
          - generic [ref=e105]:
            - generic [ref=e106]: Learn Test Automation
            - text: Hands-on courses for Playwright, Robot Framework, APIs and more
        - link "API Spector Open-source API testing, mocking and contract testing" [ref=e108] [cursor=pointer]:
          - /url: https://api-spector.dev
          - generic [ref=e111]:
            - generic [ref=e112]: API Spector
            - text: Open-source API testing, mocking and contract testing
        - link "GitHub Source code, issues and contributions" [ref=e114] [cursor=pointer]:
          - /url: https://github.com/testsmith-io/practice-software-testing
          - generic [ref=e117]:
            - generic [ref=e118]: GitHub
            - text: Source code, issues and contributions
    - generic [ref=e119]:
      - generic [ref=e120]:
        - text: This is a DEMO application, used for software testing training purpose. |
        - link "Privacy Policy" [ref=e121] [cursor=pointer]:
          - /url: /privacy
        - text: "| Banner photo by"
        - link "Barn Images" [ref=e122] [cursor=pointer]:
          - /url: https://unsplash.com/@barnimages
        - text: "on"
        - link "Unsplash" [ref=e123] [cursor=pointer]:
          - /url: https://unsplash.com/photos/t5YUoHW6zRo
        - text: .
      - generic [ref=e124]: v2.5 | Built 2026-10-11 | Angular 20.0.5
  - button "Open chat" [ref=e126] [cursor=pointer]
  - button "Show live shop activity" [ref=e130] [cursor=pointer]
```

# Test source

```ts
  93  |   await page.getByTestId('street').fill('Rua de Teste');
  94  |   await page.getByTestId('city').fill('Recife');
  95  |   await page.getByTestId('state').fill('Pernambuco');
  96  |   await page.getByTestId('phone').fill('81999990000');
  97  |   await page.getByTestId('email').fill(email);
  98  |   await page.getByTestId('password').fill('Teste@2026Seguro');
  99  | }
  100 |
  101 | // Identifica a resposta da pesquisa.
  102 | // Aceita GET e QUERY, usados em diferentes versões do Toolshop.
  103 | function respostaDeBusca(response) {
  104 |   const caminho = new URL(response.url()).pathname;
  105 |
  106 |   return caminho.endsWith('/products/search') &&
  107 |     response.request().method() !== 'OPTIONS';
  108 | }
  109 |
  110 | async function pesquisar(page, termo) {
  111 |   await page.getByTestId('search-query').fill(termo);
  112 |
  113 |   const respostaPendente = page.waitForResponse(respostaDeBusca);
  114 |
  115 |   await page.getByTestId('search-submit').click();
  116 |
  117 |   const resposta = await respostaPendente;
  118 |
  119 |   // Evita confundir erro do servidor com uma busca sem resultados.
  120 |   expect(resposta.ok(), 'A pesquisa deve responder com sucesso')
  121 |     .toBeTruthy();
  122 |
  123 |   await expect(page.getByTestId('search_completed')).toBeVisible();
  124 | }
  125 |
  126 | // ---------------- LOGIN ----------------
  127 |
  128 | test('CT-01 - login com credenciais válidas', async ({ page }) => {
  129 |   await page.goto('/');
  130 |   await page.getByTestId('nav-sign-in').click();
  131 |
  132 |   await entrar(page, conta.email, conta.senha);
  133 |
  134 |   await expect(page).toHaveURL(/\/account\/?$/);
  135 |   await expect(page.getByTestId('nav-menu')).toContainText(conta.nome);
  136 | });
  137 |
  138 | test('CT-02 - login com senha incorreta', async ({ page }) => {
  139 |   await page.goto('/auth/login');
  140 |
  141 |   await entrar(page, conta.email, 'SenhaIncorreta@987');
  142 |
  143 |   await expect(page.getByTestId('login-error')).toBeVisible();
  144 |   await expect(page.getByTestId('login-error'))
  145 |     .toContainText(/invalid email or password/i);
  146 |
  147 |   await expect(page).toHaveURL(/\/auth\/login\/?$/);
  148 |   await expect(page.getByTestId('nav-sign-in')).toBeVisible();
  149 | });
  150 |
  151 | // ---------------- CARRINHO ----------------
  152 |
  153 | test('CT-03 - adicionar produto ao carrinho', async ({ page }) => {
  154 |   const preco = await prepararCarrinho(page);
  155 |
  156 |   await expect(page.getByTestId('product-quantity')).toHaveValue('1');
  157 |
  158 |   expect(
  159 |     centavos(await page.getByTestId('product-price').innerText())
  160 |   ).toBe(preco);
  161 |
  162 |   await expect.poll(async () =>
  163 |     centavos(await page.getByTestId('cart-total').innerText())
  164 |   ).toBe(preco);
  165 | });
  166 |
  167 | test('CT-04 - alterar quantidade de 1 para 2', async ({ page }) => {
  168 |   const preco = await prepararCarrinho(page);
  169 |
  170 |   await page.getByTestId('product-quantity').fill('2');
  171 |   await page.getByTestId('product-quantity').press('Tab');
  172 |
  173 |   await expect(page.getByTestId('product-quantity')).toHaveValue('2');
  174 |
  175 |   await expect.poll(async () =>
  176 |     centavos(await page.getByTestId('line-price').innerText())
  177 |   ).toBe(preco * 2);
  178 |
  179 |   await expect.poll(async () =>
  180 |     centavos(await page.getByTestId('cart-total').innerText())
  181 |   ).toBe(preco * 2);
  182 | });
  183 |
  184 | test('CT-05 - remover produto do carrinho', async ({ page }) => {
  185 |   await prepararCarrinho(page);
  186 |
  187 |   const linha = page.locator('tr').filter({
  188 |     has: page.getByTestId('product-title'),
  189 |   });
  190 |
  191 |   await linha.locator('a.btn-danger').click();
  192 |
> 193 |   await expect(page.getByTestId('product-title')).toHaveCount(0);
      |                                                   ^ Error: expect(locator).toHaveCount(expected) failed
  194 |   await expect(page.getByText(/cart is empty/i)).toBeVisible();
  195 |
  196 |   // Algumas versões ocultam o total quando o carrinho fica vazio.
  197 |   // Se ele continuar visível, precisa ser zero.
  198 |   const total = page.getByTestId('cart-total');
  199 |
  200 |   if (await total.count()) {
  201 |     await expect.poll(async () =>
  202 |       centavos(await total.innerText())
  203 |     ).toBe(0);
  204 |   } else {
  205 |     test.info().annotations.push({
  206 |       type: 'observacao',
  207 |       description:
  208 |         'Carrinho vazio: o sistema ocultou o total. ' +
  209 |         'Alinhar essa apresentação com o esperado da parte II.',
  210 |     });
  211 |   }
  212 | });
  213 |
  214 | // ---------------- CADASTRO ----------------
  215 |
  216 | test('CT-06 - cadastro sem e-mail obrigatório', async ({ page }) => {
  217 |   await preencherCadastro(page, '');
  218 |
  219 |   // Observa se o formulário tentou cadastrar uma conta no servidor.
  220 |   const envios = [];
  221 |
  222 |   page.on('request', request => {
  223 |     const caminho = new URL(request.url()).pathname;
  224 |
  225 |     if (
  226 |       request.method() === 'POST' &&
  227 |       caminho.endsWith('/users/register')
  228 |     ) {
  229 |       envios.push(request);
  230 |     }
  231 |   });
  232 |
  233 |   await page.getByTestId('register-submit').click();
  234 |
  235 |   await expect(page.getByTestId('email-error'))
  236 |     .toContainText(/required/i);
  237 |
  238 |   await expect(page).toHaveURL(/\/auth\/register\/?$/);
  239 |   expect(envios).toHaveLength(0);
  240 | });
  241 |
  242 | test('CT-07 - cadastrar conta válida e fazer login', async ({ page }) => {
  243 |   // Um endereço diferente por execução evita cadastro duplicado.
  244 |   const email = `grupo.${randomUUID()}@example.com`;
  245 |
  246 |   await preencherCadastro(page, email);
  247 |   await page.getByTestId('register-submit').click();
  248 |
  249 |   await expect(page).toHaveURL(/\/auth\/login\/?$/);
  250 |
  251 |   await entrar(page, email, 'Teste@2026Seguro');
  252 |
  253 |   await expect(page).toHaveURL(/\/account\/?$/);
  254 |   await expect(page.getByTestId('nav-menu')).toContainText('Pessoa');
  255 | });
  256 |
  257 | // ---------------- PESQUISA ----------------
  258 |
  259 | test('CT-08 - pesquisar produto existente', async ({ page }) => {
  260 |   await page.goto('/');
  261 |   await pesquisar(page, 'Hammer');
  262 |
  263 |   const produtos = page
  264 |     .getByTestId('search_completed')
  265 |     .getByTestId('product-name');
  266 |
  267 |   await expect(produtos.first()).toBeVisible();
  268 |
  269 |   const nomes = await produtos.allTextContents();
  270 |
  271 |   expect(nomes.length).toBeGreaterThan(0);
  272 |
  273 |   for (const nome of nomes) {
  274 |     expect(nome.toLowerCase()).toContain('hammer');
  275 |   }
  276 |
  277 |   await expect(page.getByTestId('no-results')).toHaveCount(0);
  278 | });
  279 |
  280 | test('CT-09 - pesquisar termo sem correspondência', async ({ page }) => {
  281 |   await page.goto('/');
  282 |   await pesquisar(page, 'xyzabc123');
  283 |
  284 |   await expect(page.getByTestId('no-results')).toBeVisible();
  285 |
  286 |   await expect(
  287 |     page.getByTestId('search_completed').getByTestId('product-name')
  288 |   ).toHaveCount(0);
  289 | });
  290 |
  291 | // ---------------- FILTRO ----------------
  292 |
  293 | test('CT-10 - filtrar categoria e remover filtro', async ({ page }) => {
```
