# Evidência da execução automatizada

Data: 23/11/2026, 20:06:29 (America/Sao_Paulo).

Executor: Codex (execução assistida; revisão humana pendente).

Ambiente: Windows_NT 10.0.26200 x64; Node v22.15.0; Playwright 1.65.1.

SUT: https://practicesoftwaretesting.com. Status geral: failed.

Cobertura funcional dos cenários planejados: 100.0% (10/10).

Taxa de execução: 100.0% (10/10). Taxa de aprovação: 80.0% (8/10).

SIM-01 é uma verificação adicional com stub e não entra nos indicadores CT-01 a CT-10.

| Caso | Resultado | Duração (s) | Captura |
|---|---|---|---|
| CT-01 | passed | 5.6 | [imagem](capturas/CT-01.png) |
| CT-02 | passed | 4.1 | [imagem](capturas/CT-02.png) |
| CT-03 | failed | 7.9 | [imagem](capturas/CT-03.png) |
| CT-04 | passed | 10.4 | [imagem](capturas/CT-04.png) |
| CT-05 | failed | 19.8 | [imagem](capturas/CT-05.png) |
| CT-06 | passed | 6.7 | [imagem](capturas/CT-06.png) |
| CT-07 | passed | 12.2 | [imagem](capturas/CT-07.png) |
| CT-08 | passed | 3.2 | [imagem](capturas/CT-08.png) |
| CT-09 | passed | 3.6 | [imagem](capturas/CT-09.png) |
| CT-10 | passed | 14.8 | [imagem](capturas/CT-10.png) |
| SIM-01 | passed | 3.6 | [imagem](capturas/SIM-01.png) |

Cobertura de linhas, funções e ramos do sistema: não medida. A execução acessa o site público, sem instrumentação do código do SUT.

Falhas e timeouts precisam de triagem: não significam automaticamente defeito do produto. Casos ignorados/interrompidos não são aprovados.

Detalhes de erros, versão do navegador e URL final: resultado.json. HTML e JUnit: pasta reports. Traces de falhas: pasta test-results (gerada localmente).
