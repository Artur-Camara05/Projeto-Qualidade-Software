const { existsSync, readFileSync } = require('node:fs');

const casosObrigatorios = [
  'CT-01', 'CT-02', 'CT-03', 'CT-04', 'CT-05',
  'CT-06', 'CT-07', 'CT-08', 'CT-09', 'CT-10', 'SIM-01',
];

// Reúne os testes, inclusive os que estão dentro de test.describe.
function listarTestes(suites) {
  const testes = [];

  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      for (const teste of spec.tests) {
        testes.push({ titulo: spec.title, ...teste });
      }
    }

    testes.push(...listarTestes(suite.suites || []));
  }

  return testes;
}

try {
  const caminho = process.argv[2] || 'test-results/results.json';
  const relatorio = JSON.parse(readFileSync(caminho, 'utf8'));
  const testes = listarTestes(relatorio.suites);
  const problemas = [];

  if (!existsSync('playwright-report/index.html')) {
    problemas.push('O relatório HTML não foi gerado.');
  }

  if (relatorio.errors.length > 0) {
    problemas.push('O Playwright registrou erros gerais na execução.');
  }

  if (testes.length !== casosObrigatorios.length) {
    problemas.push(`Esperados ${casosObrigatorios.length} testes; encontrados ${testes.length}.`);
  }

  for (const caso of casosObrigatorios) {
    const encontrados = testes.filter(teste =>
      teste.titulo.startsWith(`${caso} - `)
    );

    if (encontrados.length !== 1) {
      problemas.push(`${caso}: deve aparecer exatamente uma vez.`);
      continue;
    }

    const teste = encontrados[0];
    const resultado = teste.results[0];

    // test.fail também pode dar status "expected", mas não é uma aprovação.
    const aprovado = teste.expectedStatus === 'passed' &&
      teste.status === 'expected' && resultado?.status === 'passed';

    const tentativaUnica = teste.results.length === 1 && resultado?.retry === 0;

    if (teste.projectName !== 'chromium' || !aprovado || !tentativaUnica) {
      problemas.push(`${caso}: precisa passar no Chromium, sem pular ou repetir.`);
    }
  }

  if (problemas.length > 0) {
    throw new Error(problemas.join('\n'));
  }

  console.log('Aprovados: 10/10 casos reais e 1/1 caso simulado.');
  console.log('O resultado se refere aos cenários selecionados. Cobertura de código não foi medida.');
} catch (erro) {
  console.error(`Critério de aprovação não atendido:\n${erro.message}`);
  process.exitCode = 1;
}
