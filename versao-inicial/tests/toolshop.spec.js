const { test, expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');

// Conta pública de demonstração.
// Pode ser substituída por uma conta própria usando variáveis de ambiente.
const conta = {
  email:
    process.env.TOOLSHOP_EMAIL ||
    'customer@practicesoftwaretesting.com',

  senha:
    process.env.TOOLSHOP_PASSWORD ||
    'welcome01',

  nome:
    process.env.TOOLSHOP_NOME ||
    'Jane',
};

const senhaCadastro = 'Teste@2026Seguro';

// Aceita espaços antes e depois do nome no HTML.
const nomeProduto = /^\s*Combination Pliers\s*$/;

// Converte "$12.50" em 1250 centavos.
function centavos(texto) {
  const valor = texto.replace(/[^0-9.]/g, '');

  if (!valor || !Number.isFinite(Number(valor))) {
    throw new Error(`Preço inválido: "${texto}"`);
  }

  return Math.round(Number(valor) * 100);
}

async function entrar(page, email, senha) {
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(senha);
  await page.getByTestId('login-submit').click();
}

// Cada teste prepara seu próprio carrinho.
async function prepararCarrinho(page) {
  await page.goto('/');

  const produto = page
    .getByTestId('product-name')
    .filter({ hasText: nomeProduto });

  await expect(produto).toBeVisible();
  await produto.click();

  await expect(page.getByTestId('quantity')).toHaveValue('1');
  await expect(page.getByTestId('add-to-cart')).toBeEnabled();

  const preco = centavos(
    await page.getByTestId('unit-price').innerText()
  );

  await page.getByTestId('add-to-cart').click();

  await expect(page.getByTestId('cart-quantity')).toHaveText('1');

  await page.getByTestId('nav-cart').click();

  await expect(page.getByTestId('product-title')).toHaveCount(1);

  await expect(page.getByTestId('product-title'))
    .toContainText('Combination Pliers');

  return preco;
}

async function preencherCadastro(page, email) {
  await page.goto('/auth/register');

  await page.getByTestId('first-name').fill('Pessoa');
  await page.getByTestId('last-name').fill('Teste');
  await page.getByTestId('dob').fill('1995-05-15');
  await page.getByTestId('country').selectOption('BR');
  await page.getByTestId('postal_code').fill('50000000');

  // Campo presente em versões recentes do sistema.
  const numero = page.getByTestId('house_number');

  if (await numero.count()) {
    await numero.fill('123');
    await numero.blur();

    await expect(
      page.getByTestId('postcode-lookup-loading')
    ).toBeHidden();
  }

  await page.getByTestId('street').fill('Rua de Teste');
  await page.getByTestId('city').fill('Recife');
  await page.getByTestId('state').fill('Pernambuco');
  await page.getByTestId('phone').fill('81999990000');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(senhaCadastro);
}

function respostaDeBusca(response) {
  const caminho = new URL(response.url()).pathname;

  return (
    caminho.endsWith('/products/search') &&
    response.request().method() !== 'OPTIONS'
  );
}

async function pesquisar(page, termo) {
  await page.getByTestId('search-query').fill(termo);

  const respostaPendente = page.waitForResponse(respostaDeBusca);

  await page.getByTestId('search-submit').click();

  const resposta = await respostaPendente;

  expect(
    resposta.ok(),
    `A pesquisa retornou HTTP ${resposta.status()}`
  ).toBeTruthy();

  await expect(
    page.getByTestId('search_completed')
  ).toBeVisible();
}

// ---------------- LOGIN ----------------

test('CT-01 - login com credenciais válidas', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-sign-in').click();

  await entrar(page, conta.email, conta.senha);

  await expect(
    page,
    'O login não chegou à conta. Confira a mensagem da tela e as credenciais.'
  ).toHaveURL(/\/account\/?$/);

  await expect(page.getByTestId('nav-menu'))
    .toContainText(conta.nome);
});

test('CT-02 - login com senha incorreta', async ({ page }) => {
  await page.goto('/auth/login');

  await entrar(page, conta.email, 'SenhaIncorreta@987');

  await expect(page.getByTestId('login-error')).toBeVisible();

  await expect(page.getByTestId('login-error'))
    .toContainText(/invalid email or password/i);

  await expect(page).toHaveURL(/\/auth\/login\/?$/);

  await expect(page.getByTestId('nav-sign-in')).toBeVisible();
});

// ---------------- CARRINHO ----------------

test('CT-03 - adicionar produto ao carrinho', async ({ page }) => {
  const preco = await prepararCarrinho(page);

  await expect(page.getByTestId('product-quantity'))
    .toHaveValue('1');

  expect(
    centavos(await page.getByTestId('product-price').innerText())
  ).toBe(preco);

  await expect.poll(async () =>
    centavos(await page.getByTestId('cart-total').innerText())
  ).toBe(preco);
});

test('CT-04 - alterar quantidade de 1 para 2', async ({ page }) => {
  const preco = await prepararCarrinho(page);

  await page.getByTestId('product-quantity').fill('2');
  await page.getByTestId('product-quantity').press('Tab');

  await expect(page.getByTestId('product-quantity'))
    .toHaveValue('2');

  await expect.poll(async () =>
    centavos(await page.getByTestId('line-price').innerText())
  ).toBe(preco * 2);

  await expect.poll(async () =>
    centavos(await page.getByTestId('cart-total').innerText())
  ).toBe(preco * 2);
});

test('CT-05 - remover produto do carrinho', async ({ page }) => {
  await prepararCarrinho(page);

  const linha = page.locator('tr').filter({
    has: page.getByTestId('product-title'),
  });

  await linha.locator('a.btn-danger').click();

  await expect(page.getByTestId('product-title'))
    .toHaveCount(0);

  await expect(page.getByText(/cart is empty/i))
    .toBeVisible();

  const total = page.getByTestId('cart-total');

  // Se o total continuar na página, deve ser zero.
  // Se for removido, registra essa apresentação no relatório.
  if (await total.count()) {
    await expect.poll(async () =>
      centavos(await total.innerText())
    ).toBe(0);
  } else {
    test.info().annotations.push({
      type: 'observacao',
      description:
        'Carrinho vazio: o sistema ocultou o total. ' +
        'Alinhar essa apresentação com o esperado da parte II.',
    });
  }
});

// ---------------- CADASTRO ----------------

test('CT-06 - cadastro sem e-mail obrigatório', async ({ page }) => {
  await preencherCadastro(page, '');

  const envios = [];

  page.on('request', request => {
    const caminho = new URL(request.url()).pathname;

    if (
      request.method() === 'POST' &&
      caminho.endsWith('/users/register')
    ) {
      envios.push(request);
    }
  });

  await page.getByTestId('register-submit').click();

  await expect(page.getByTestId('email-error'))
    .toContainText(/required/i);

  await expect(page).toHaveURL(/\/auth\/register\/?$/);

  expect(envios).toHaveLength(0);
});

test('CT-07 - cadastrar conta válida e fazer login', async ({ page }) => {
  const email = `grupo.${randomUUID()}@example.com`;

  await preencherCadastro(page, email);
  await page.getByTestId('register-submit').click();

  await expect(page).toHaveURL(/\/auth\/login\/?$/);

  await entrar(page, email, senhaCadastro);

  await expect(page).toHaveURL(/\/account\/?$/);

  await expect(page.getByTestId('nav-menu'))
    .toContainText('Pessoa');
});

// ---------------- PESQUISA ----------------

test('CT-08 - pesquisar produto existente', async ({ page }) => {
  await page.goto('/');
  await pesquisar(page, 'Hammer');

  const produtos = page
    .getByTestId('search_completed')
    .getByTestId('product-name');

  await expect(produtos.first()).toBeVisible();

  const nomes = await produtos.allTextContents();

  expect(nomes.length).toBeGreaterThan(0);

  for (const nome of nomes) {
    expect(nome.toLowerCase()).toContain('hammer');
  }

  await expect(page.getByTestId('no-results')).toHaveCount(0);
});

test('CT-09 - pesquisar termo sem correspondência', async ({ page }) => {
  await page.goto('/');
  await pesquisar(page, 'xyzabc123');

  await expect(page.getByTestId('no-results')).toBeVisible();

  await expect(
    page.getByTestId('search_completed').getByTestId('product-name')
  ).toHaveCount(0);
});

// ---------------- FILTRO ----------------

test('CT-10 - filtrar categoria e remover filtro', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByTestId('product-name').first()
  ).toBeVisible();

  // Nome confirmado no registro da execução: Hammer, no singular.
  const filtro = page.getByRole('checkbox', {
    name: 'Hammer',
    exact: true,
  });

  await filtro.check();
  await expect(filtro).toBeChecked();

  const resultados = page.getByTestId('filter_completed');

  await expect(resultados).toBeVisible();

  await expect(
    resultados.getByTestId('product-name').first()
  ).toBeVisible();

  // Verifica os produtos da página de resultados exibida.
  const links = await resultados
    .locator('a.card')
    .evaluateAll(elementos =>
      elementos.map(elemento => elemento.getAttribute('href'))
    );

  expect(links.length).toBeGreaterThan(0);

  const detalhe = await page.context().newPage();

  try {
    for (const link of links) {
      expect(link).toBeTruthy();

      await detalhe.goto(new URL(link, page.url()).href);

      await expect(
        detalhe.locator('[aria-label="category"]')
      ).toHaveText('Hammer');
    }
  } finally {
    await detalhe.close();
  }

  await filtro.uncheck();

  await expect(filtro).not.toBeChecked();

  await expect(
    page.getByTestId('filter_completed')
  ).toBeVisible();

  // Um produto de outra categoria deve voltar à listagem.
  await expect(
    page.getByTestId('product-name')
      .filter({ hasText: nomeProduto })
  ).toBeVisible();
});

// ---------------- RESPOSTA SIMULADA ----------------

test('SIM-01 - busca vazia com resposta simulada', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByTestId('product-name').first()
  ).toBeVisible();

  let respostaSimulada = false;

  await page.route('**/products/search*', async route => {
    if (route.request().method() === 'OPTIONS') {
      await route.continue();
      return;
    }

    respostaSimulada = true;

    // Stub: substitui somente a resposta da busca.
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 9,
        from: null,
        to: null,
      }),
    });
  });

  await pesquisar(page, 'produto-simulado');

  expect(respostaSimulada).toBe(true);

  await expect(page.getByTestId('no-results'))
    .toBeVisible();

  await expect(
    page.getByTestId('search_completed').getByTestId('product-name')
  ).toHaveCount(0);
});