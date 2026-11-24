# Versão inicial da automação

Instalação e testes iniciais desenvolvidos por Bruno Ferreira Lyra, preservados a partir de sua cópia local. Esta pasta registra a base anterior às alterações e execuções de Artur. A suíte atual e o pipeline utilizam os arquivos da raiz do repositório.

Inclui CT-01 a CT-10 e o cenário SIM-01 com resposta simulada. O relatório apresentado na etapa inicial registrou 11 testes aprovados; essa execução não foi repetida durante a inclusão desta pasta.

Para reproduzir esta versão, execute dentro desta pasta:

```powershell
npm.cmd ci
npx.cmd playwright install chromium
npx.cmd playwright test --project=chromium
```

Origem: arquivos locais de Bruno em `projeto-qualidade-software`. Os metadados do pacote ainda identificam o repositório original, preservando a instalação inicial.
