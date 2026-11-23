# Testes automatizados — parte 3

Material técnico de apoio para revisão do responsável. Os resultados reais ficam em [resumo da execução](../evidencias/ultima-execucao/resumo.md). A equipe deve formular suas conclusões e incorporar as evidências ao PDF final, conforme as regras de autoria do enunciado.

## Escopo e escolha da ferramenta

O planejamento em `Teste_e_qualidade.docx` prevê F01 a F05 e CT-01 a CT-10. A suíte existente foi mantida e revisada com Playwright Test, JavaScript e Chromium. São testes funcionais E2E pelo navegador: exercitam interface, API e persistência do ambiente público. Essa escolha permite comparar os resultados com os casos manuais do grupo sem precisar modificar o sistema sob teste.

O PDF permite unidade, integração, E2E e/ou API. Não foram criados testes de unidade do sistema: seu código não está neste repositório. O cenário SIM-01 testa a interface com uma resposta de API controlada; ele não comprova integração com o servidor.

## Rastreabilidade e cobertura funcional

| Função | Casos | Verificações automatizadas | Prioridade |
|---|---|---|---|
| F01 — Login | CT-01, CT-02 | Redirecionamento, nome no menu; erro e permanência na tela para senha incorreta | Alta |
| F02 — Carrinho | CT-03, CT-04, CT-05 | Produto, preço, quantidade, total multiplicado por dois e estado vazio | Alta |
| F03 — Cadastro | CT-06, CT-07 | E-mail obrigatório sem envio à API; criação de conta fictícia e login posterior | Média |
| F04 — Pesquisa | CT-08, CT-09 | Resposta HTTP bem-sucedida, nomes relacionados ao termo e ausência de produtos para termo inexistente | Média |
| F05 — Categoria | CT-10 | Categoria de cada produto exibido e retorno de produto de outra categoria após retirar filtro | Média |
| F04 — Interface com stub | SIM-01 | Resposta vazia controlada e apresentação de nenhum resultado | Complementar |

Cobertura de cenários planejados = casos CT automatizados / 10. Cobertura de funcionalidades = funções F01 a F05 com ao menos um caso automatizado / 5. A suíte completa implementa 10/10 e 5/5, respectivamente. Isso não significa que todas as combinações de dados, todas as páginas de resultados ou todos os requisitos do produto foram cobertos.

Cobertura de linhas, ramos e funções do código do sistema **não foi medida**. Ela exigiria executar uma versão instrumentada do frontend e backend. Um relatório funcional não deve ser apresentado como cobertura de código.

Lacunas: outros campos obrigatórios, e-mail duplicado, limites de quantidade, paginação, combinações de busca e filtros, outros navegadores, acessibilidade, desempenho, segurança e checkout. Esses pontos podem alimentar futuras regressões e sessões exploratórias; não foram adicionados ao denominador dos dez casos acordados.

## Dados, isolamento e verificações

- Cada caso ganha um contexto de navegador próprio, sem compartilhar cookies ou armazenamento local. Os testes de carrinho preparam seu produto independentemente dos demais.
- Valores monetários são comparados em centavos; os testes usam o preço observado no produto e verificam a coerência com o carrinho.
- O cadastro utiliza e-mail único com UUID no domínio reservado `example.com` e dados fictícios. CT-07 cria uma conta no ambiente de demonstração. Não há exclusão automática: uma execução deixa uma conta fictícia, sujeita à limpeza do próprio ambiente.
- CT-06 observa solicitações POST de cadastro e exige que nenhuma seja enviada quando o e-mail está vazio.
- As esperas usam elementos, respostas HTTP e asserções com repetição automática, sem pausas fixas. A navegação espera `DOMContentLoaded`; a prontidão funcional é validada pelos elementos e respostas esperados. As ações têm limite de 15 segundos; cada teste, de 60 segundos. Inclusão e remoção no carrinho exigem resposta HTTP bem-sucedida em até 30 segundos.
- Execução sequencial com um worker reduz interferência no ambiente público. Não há retries automáticos: falhas permanecem visíveis para análise.

## Stub e observação de chamadas

SIM-01 intercepta somente `/products/search` e devolve HTTP 200 com coleção vazia e metadados de paginação. A interceptação precisa ter ocorrido para o teste passar. O stub permite repetir o estado vazio sem depender dos dados do catálogo. CT-09 mantém a validação equivalente contra a API real, evitando que o stub seja a única evidência desse comportamento.

Não foram usados mocks para substituir login, cadastro ou carrinho. Em CT-06, o listener de rede funciona como observador (spy): conta chamadas sem trocar respostas. A diferença é relevante para explicar o que foi efetivamente validado.

## Regressão e integração com CI/CD

| Comando | Conjunto | Uso |
|---|---|---|
| `npm test` | CT-01 a CT-10 + SIM-01 | Execução completa |
| `npm run test:regressao` | CT-01 a CT-10 | Regressão funcional com serviços reais |
| `npm run test:smoke` | CT-01 a CT-05 | Fluxos de prioridade alta |
| `npm run test:stub` | SIM-01 | Comportamento controlado da interface |

Para o colega responsável por CI/CD: preparar Node 22 ou superior compatível com o lockfile, executar `npm ci`, `npx playwright install --with-deps chromium` e `npm test`. O comando retorna erro em caso de falha. `forbidOnly` impede testes exclusivos quando `CI` está definido. Os relatórios JUnit e HTML já estão disponíveis para coleta como artefatos. Não foi criado pipeline nesta parte do trabalho.

Critério proposto para aprovar a regressão: todos os casos selecionados aprovados e nenhum ignorado. Falha por indisponibilidade requer registro e nova execução; não pode ser contada como aprovação. Os critérios finais são decisão conjunta do grupo.

## Evidências e indicadores

A execução produz:

- `evidencias/ultima-execucao/resumo.md`: data, executor, ambiente, resultados e indicadores.
- `evidencias/ultima-execucao/resultado.json`: dados detalhados, URLs finais, versão do navegador e erros.
- `evidencias/ultima-execucao/capturas/`: imagem final de cada teste.
- `reports/html/`: relatório navegável com anexos; `reports/junit.xml`: integração com pipeline; `reports/resultados.json`: saída nativa do Playwright.
- `%TEMP%/toolshop-playwright/test-results/`: traces e captura automática de falhas. O diretório temporário evita bloqueios dos arquivos ativos pelo OneDrive.

Taxa de execução = CT efetivamente executados / 10. Taxa de aprovação = CT aprovados / CT executados. SIM-01 fica separado. O resumo de uma execução parcial conserva o denominador de dez casos, deixando explícito que ela não equivale à regressão completa.

`ultima-execucao`, `reports` e o diretório temporário de artefatos são atualizados nas próximas execuções. Para preservar uma entrega, copie essas pastas para um diretório identificado com a data antes de rodar outra suíte. As capturas documentam o estado final, não cada passo intermediário. Asserções e logs complementam as imagens. Traces podem conter dados de rede e devem ser revisados antes do compartilhamento; use as contas fictícias de demonstração.

## Limitações e revisão da equipe

O ambiente público pode mudar dados, estrutura e disponibilidade sem alteração neste repositório. Uma falha de seletor precisa ser distinguida de defeito do sistema. A revisão identificou a necessidade de usar um localizador por heading para o produto e a categoria atual `Hammer`, em vez de `Hammers`.

Na repetição da suíte, CT-03 chegou ao estado esperado, mas foi marcado como falha no encerramento do contexto: `browserContext.close: EBUSY`, ao abrir um arquivo de trace no workspace sincronizado. É uma falha de infraestrutura, não evidência de defeito no carrinho. A configuração passou a gravar os artefatos ativos no diretório temporário do Windows; o erro original foi preservado em `evidencias/diagnostico-ambiente/`.

Nessa mesma execução, CT-05 não chegou à remoção: a adição preparatória não atualizou o contador em 15 segundos. O trace mostrou criação do carrinho com HTTP 201 e uma chamada de inclusão sem resposta registrada até o encerramento. A causa não foi confirmada. Foi acrescentada uma espera explícita pela resposta de inclusão, com limite de 30 segundos e exigência de sucesso HTTP, para distinguir falhas da API de falhas na atualização da interface. A tentativa intermediária foi preservada; uma aprovação posterior não elimina essa observação de instabilidade.

Outra repetição apresentou falhas no carregamento do cadastro e uma remoção sem resposta registrada a tempo. Os dados estão em `evidencias/diagnostico-repeticao/`. A navegação foi ajustada para não depender do evento `load` de todos os recursos, e a remoção passou a exigir a confirmação HTTP antes de verificar o DOM.

CT-08 também revelou um problema de sincronização da automação: o teste lia imediatamente a listagem, que ainda exibia o catálogo inicial, embora a busca já tivesse respondido HTTP 200 com seis produtos contendo Hammer. A preparação passou a aguardar o catálogo inicial, e a verificação dos nomes passou a usar asserções sobre locators com repetição automática, aguardando a atualização da interface. O registro anterior fica em `evidencias/diagnostico-pesquisa/`.

CT-05 aceita total oculto quando o carrinho fica vazio; se ele estiver presente, exige valor zero. O caso manual descreve total zerado. A equipe precisa explicitar se ocultar o total é aceitável ou ajustar o critério. A automação registra uma anotação quando o total é omitido.

Antes de incorporar ao relatório final, o responsável deve executar a suíte, revisar os resultados e escrever sua análise: quais verificações deram confiança, quais riscos continuam abertos e por que o stub não substitui o teste real. Registrar nome, matrícula e eventuais alterações de critérios. O executor automático não equivale a uma revisão humana.

## Referências

- Enunciado local: `_DescricaoDoProjeto.pdf`, requisitos de automação, cobertura, evidências e autoria.
- Planejamento local: `Teste_e_qualidade.docx`, F01 a F05 e CT-01 a CT-10.
- [Playwright — reporters](https://playwright.dev/docs/test-reporters).
- [Sistema sob teste](https://practicesoftwaretesting.com/).
