const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// Relatório de cobertura funcional, sem alegar cobertura do código do SUT.
class Relatorio {
  onBegin(config, suite) {
    this.inicio = new Date();
    this.config = config;
    this.testes = suite.allTests();
    this.destino = path.resolve('evidencias/ultima-execucao');
    fs.mkdirSync(this.destino, { recursive: true });
  }

  onEnd(resultado) {
    const casos = this.testes.map(teste => {
      const resultado = teste.results.at(-1);
      const id = teste.title.match(/(?:CT|SIM)-\d+/)?.[0] || teste.title;
      const anexos = [];
      let ambiente = null;
      for (const anexo of resultado?.attachments || []) {
        if (anexo.name === 'ambiente') {
          const dados = anexo.body || (anexo.path && fs.readFileSync(anexo.path));
          if (dados) ambiente = JSON.parse(dados.toString());
        }
        if (anexo.name === 'estado-final') {
          const destino = `capturas/${id}.png`;
          fs.mkdirSync(path.join(this.destino, 'capturas'), { recursive: true });
          if (anexo.body) fs.writeFileSync(path.join(this.destino, destino), anexo.body);
          else if (anexo.path) fs.copyFileSync(anexo.path, path.join(this.destino, destino));
          anexos.push(destino);
        }
      }
      return {
        id, titulo: teste.title, status: resultado?.status || 'nao-executado',
        duracaoMs: resultado?.duration || 0, ambiente, anexos,
        erros: (resultado?.errors || []).map(erro => erro.message),
      };
    });
    const planejados = Array.from({ length: 10 }, (_, i) => `CT-${String(i + 1).padStart(2, '0')}`);
    const funcionais = casos.filter(caso => planejados.includes(caso.id));
    const executados = funcionais.filter(caso => ['passed', 'failed', 'timedOut'].includes(caso.status));
    const aprovados = executados.filter(caso => caso.status === 'passed');
    const percentual = (n, total) => total ? `${(100 * n / total).toFixed(1)}%` : 'N/A';
    const dados = {
      inicio: this.inicio.toISOString(), fim: new Date().toISOString(),
      fuso: 'America/Sao_Paulo', executor: process.env.TEST_EXECUTOR || 'Codex (execução assistida; revisão humana pendente)',
      sistema: `${os.type()} ${os.release()} ${os.arch()}`, node: process.version,
      playwright: require('@playwright/test/package.json').version,
      baseURL: this.config.projects[0].use.baseURL,
      artefatos: this.config.projects[0].outputDir,
      status: resultado.status, duracaoMs: resultado.duration,
      metricas: {
        planejados: planejados.length, automatizados: funcionais.length,
        executados: executados.length, aprovados: aprovados.length,
        coberturaFuncional: percentual(funcionais.length, planejados.length),
        taxaExecucao: percentual(executados.length, planejados.length),
        taxaAprovacao: percentual(aprovados.length, executados.length),
      }, casos,
    };
    fs.writeFileSync(path.join(this.destino, 'resultado.json'), JSON.stringify(dados, null, 2) + '\n');
    const linhas = [
      '# Evidência da execução automatizada', '',
      `Data: ${this.inicio.toLocaleString('pt-BR', { timeZone: dados.fuso })} (${dados.fuso}).`, '',
      `Executor: ${dados.executor}.`, '',
      `Ambiente: ${dados.sistema}; Node ${dados.node}; Playwright ${dados.playwright}.`, '',
      `SUT: ${dados.baseURL}. Status geral: ${dados.status}.`, '',
      `Cobertura funcional dos cenários planejados: ${dados.metricas.coberturaFuncional} (${funcionais.length}/10).`, '',
      `Taxa de execução: ${dados.metricas.taxaExecucao} (${executados.length}/10). Taxa de aprovação: ${dados.metricas.taxaAprovacao} (${aprovados.length}/${executados.length}).`, '',
      'SIM-01 é uma verificação adicional com stub e não entra nos indicadores CT-01 a CT-10.', '',
      '| Caso | Resultado | Duração (s) | Captura |', '|---|---|---|---|',
      ...casos.map(c => `| ${c.id} | ${c.status} | ${(c.duracaoMs / 1000).toFixed(1)} | ${c.anexos.map(a => `[imagem](${a})`).join(', ')} |`), '',
      'Cobertura de linhas, funções e ramos do sistema: não medida. A execução acessa o site público, sem instrumentação do código do SUT.', '',
      'Falhas e timeouts precisam de triagem: não significam automaticamente defeito do produto. Casos ignorados/interrompidos não são aprovados.', '',
      `Detalhes de erros, versão do navegador e URL final: resultado.json. HTML e JUnit: pasta reports. Traces de falhas: ${dados.artefatos}.`, '',
    ];
    fs.writeFileSync(path.join(this.destino, 'resumo.md'), linhas.join('\n'));
  }
}

module.exports = Relatorio;
