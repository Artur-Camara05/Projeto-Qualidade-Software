const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const script = join(__dirname, 'verificar-resultados.js');

function relatorioAprovado() {
  const casos = Array.from({ length: 10 }, (_, indice) =>
    `CT-${String(indice + 1).padStart(2, '0')}`
  );
  casos.push('SIM-01');

  return {
    errors: [],
    suites: [{
      specs: casos.map(caso => ({
        title: `${caso} - cenário de verificação do pipeline`,
        tests: [{
          projectName: 'chromium',
          expectedStatus: 'passed',
          status: 'expected',
          results: [{ status: 'passed', retry: 0 }],
        }],
      })),
    }],
  };
}

// Os dados abaixo verificam o pipeline, sem acessar o Toolshop.
function executar(relatorio, { criarHtml = true } = {}) {
  const pasta = mkdtempSync(join(tmpdir(), 'toolshop-pipeline-'));

  try {
    mkdirSync(join(pasta, 'playwright-report'));
    if (criarHtml) {
      writeFileSync(join(pasta, 'playwright-report/index.html'), '<html></html>');
    }
    writeFileSync(join(pasta, 'results.json'), JSON.stringify(relatorio));

    return spawnSync(process.execPath, [script, 'results.json'], {
      cwd: pasta,
      encoding: 'utf8',
    });
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
}

test('aprova os dez casos reais e o simulado executados uma vez', () => {
  const resultado = executar(relatorioAprovado());
  assert.equal(resultado.status, 0, resultado.stderr);
  assert.match(resultado.stdout, /10\/10 casos reais e 1\/1 caso simulado/);
});

test('encontra casos dentro de grupos test.describe', () => {
  const relatorio = relatorioAprovado();
  relatorio.suites = [{ specs: [], suites: relatorio.suites }];
  assert.equal(executar(relatorio).status, 0);
});

test('reprova um caso ausente mesmo quando ha onze testes', () => {
  const relatorio = relatorioAprovado();
  relatorio.suites[0].specs[0].title = 'OUTRO - caso fora do escopo';
  assert.equal(executar(relatorio).status, 1);
});

test('reprova a duplicação de um caso no lugar de outro', () => {
  const relatorio = relatorioAprovado();
  relatorio.suites[0].specs[1].title = 'CT-01 - duplicado';
  assert.equal(executar(relatorio).status, 1);
});

for (const status of ['skipped', 'unexpected', 'flaky']) {
  test(`reprova um caso com status ${status}`, () => {
    const relatorio = relatorioAprovado();
    relatorio.suites[0].specs[0].tests[0].status = status;
    assert.equal(executar(relatorio).status, 1);
  });
}

test('reprova uma falha marcada como esperada', () => {
  const relatorio = relatorioAprovado();
  const teste = relatorio.suites[0].specs[0].tests[0];
  teste.expectedStatus = 'failed';
  teste.results[0].status = 'failed';
  assert.equal(executar(relatorio).status, 1);
});

test('reprova uma aprovação obtida após uma nova tentativa', () => {
  const relatorio = relatorioAprovado();
  relatorio.suites[0].specs[0].tests[0].results[0].retry = 1;
  assert.equal(executar(relatorio).status, 1);
});

test('reprova uma suíte vazia', () => {
  assert.equal(executar({ suites: [], errors: [] }).status, 1);
});

test('reprova erros gerais mesmo com os casos aprovados', () => {
  const relatorio = relatorioAprovado();
  relatorio.errors.push({ message: 'Falha fora de um caso de teste' });
  assert.equal(executar(relatorio).status, 1);
});

test('reprova a ausência do relatório HTML', () => {
  assert.equal(executar(relatorioAprovado(), { criarHtml: false }).status, 1);
});
