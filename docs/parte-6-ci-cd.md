# CI/CD

Responsável: Carlos Damasceno.

A integração contínua usa GitHub Actions para executar a suíte de `tests/toolshop.spec.js`. São 10 casos no site real, de CT-01 a CT-10, e o caso SIM-01, com resposta simulada. Os resultados desses dois grupos são apresentados separadamente.

## Execução no GitHub

O arquivo `.github/workflows/ci.yml` roda ao abrir ou atualizar um pull request para `main`, ao enviar alterações para `main` e por acionamento manual na aba Actions. O acionamento manual fica disponível depois que o workflow estiver na branch padrão.

O job usa Ubuntu 24.04, Node.js 24 e Chromium instalado pelo Playwright. A execução é sequencial, com um worker e sem novas tentativas automáticas, como na suíte original. O limite dos testes é de 10 minutos; o job tem 20 minutos para incluir a preparação e o envio dos relatórios.

| Etapa | Comando ou recurso |
|---|---|
| Instalar os pacotes do lockfile | `npm ci` |
| Verificar as regras de aprovação | `npm run test:pipeline` |
| Instalar o navegador e suas dependências | `npx playwright install --with-deps chromium` |
| Executar os testes do grupo | `npm run test:ci` |
| Conferir os resultados | `npm run check:results` |
| Guardar relatórios e evidências | `actions/upload-artifact` |

Os relatórios HTML e JSON, as capturas de falhas e os traces ficam no artefato da execução por 14 dias. O envio dos arquivos é tentado mesmo se um teste falhar. Uma execução cancelada pode terminar sem artefatos.

## Critérios de aprovação

O job deve concluir todas as etapas. A conferência do JSON exige:

- CT-01 a CT-10 e SIM-01 presentes, uma vez cada.
- Todos aprovados no projeto Chromium, na primeira tentativa.
- Nenhum caso pulado ou marcado como falha esperada.
- Nenhum erro geral registrado pelo Playwright.
- Relatório HTML presente.

O comando de CI também proíbe `test.only`. Se o grupo adicionar casos, a lista em `scripts/verificar-resultados.js` deve acompanhar o novo escopo. Esses critérios verificam os cenários escolhidos; não medem cobertura de código.

Para impedir o merge quando o job falhar, o administrador precisa proteger a `main`, exigir pull request e tornar obrigatório o check **Testes do Toolshop**. Isso deve ser configurado após a primeira execução, quando o check aparecer nas opções do GitHub.

## Executar localmente

```bash
npm ci
npx playwright install chromium
npm run test:pipeline
npm run test:ci
npm run check:results
npm run report
```

No Linux, acrescente `--with-deps` à instalação do Chromium caso as bibliotecas do sistema ainda não estejam disponíveis. No Windows, `npm.cmd` e `npx.cmd` podem ser usados se o PowerShell bloquear os atalhos comuns.

`test:pipeline` usa dados isolados para testar a regra de aprovação. `test:ci` executa a suíte do Toolshop. A conferência dos resultados deve vir depois de uma execução completa. Preserve as evidências antes de repetir os testes, pois os arquivos locais podem ser substituídos.

## Build e entrega da aplicação: proposta

O repositório do grupo contém a suíte de testes. O código da aplicação está no [projeto original](https://github.com/testsmith-io/practice-software-testing), com frontend em `sprint5/UI` e API em `sprint5/API`. Instalar os pacotes dos testes com `npm ci` é preparação do ambiente; o build da aplicação exige esse código.

Para um fluxo completo, a proposta é:

1. Obter uma revisão da aplicação identificada por commit e preparar ferramentas compatíveis com seus lockfiles.
2. Em `sprint5/UI`, executar `npm ci` e `npm run build`, preservando a saída de `dist/`.
3. Em `sprint5/API`, instalar as dependências com Composer e configurar banco e dados de teste. Executar os testes internos adotados; o projeto indica `./vendor/bin/pest` para a API do sprint 5.
4. Empacotar a UI e a API com a identificação do commit e subir esses artefatos em um ambiente próprio de homologação.
5. Configurar a URL da API no frontend e apontar `TOOLSHOP_BASE_URL` para esse ambiente. Aguardar os serviços ficarem prontos e executar a suíte com os mesmos critérios de aprovação.
6. Guardar os artefatos aprovados e liberar a publicação após revisão do responsável. A publicação deve reutilizar os mesmos artefatos testados.

Uma falha no build ou nos testes interrompe o fluxo. Depois da publicação, deve haver uma verificação de disponibilidade e de um fluxo essencial. Em caso de problema, a versão anterior deve continuar disponível para restauração. Alterações no banco exigem planejamento de compatibilidade e backup.

Essa é uma proposta de entrega contínua com aprovação manual. Build e deploy da aplicação não foram executados neste trabalho de CI; o pipeline atual verifica os testes contra o site público.

## Verificação local

Na verificação de 23/11/2026, a instalação dos pacotes foi concluída, o workflow passou pelo actionlint e os 12 testes da regra de aprovação passaram. A configuração identificou os 11 casos da suíte. Também foi conferida a leitura de um relatório gerado pelo Playwright em uma execução isolada, sem acesso ao Toolshop.

A nova execução funcional ficou pendente: o download do navegador e o acesso à página inicial receberam HTTP 403 no ambiente utilizado. O resultado anterior da parte III pertence à execução local registrada naquele relatório.

A primeira execução no GitHub precisa ser conferida na aba Actions. O link, o commit e o resultado dessa execução devem acompanhar as evidências da entrega.

## Referências

- [GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Proteção de branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Playwright em CI](https://playwright.dev/docs/ci)
- [Relatórios do Playwright](https://playwright.dev/docs/test-reporters)
