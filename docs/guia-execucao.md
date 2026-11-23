# Como executar e apresentar sua parte

## Preparar no PowerShell

Na pasta do repositório que contém `package.json`, execute:

```powershell
npm ci
npx playwright install chromium
npm test
npm run report
```

Se você clonou o repositório agora, entre primeiro na pasta criada pelo `git clone`. No workspace original usado na preparação, a automação fica na subpasta `projeto-qualidade-software`. Requer Node.js compatível com o lockfile (validado com Node 22). `npm ci` usa as versões registradas em `package-lock.json`. Execute os comandos em sequência e só avance se o anterior terminar com sucesso. Nenhum desses comandos faz commit ou push.

O relatório abre no navegador. Encerre o servidor com Ctrl+C. Para observar a interação na tela: `npm run test:headed`. Para depurar: `npm run test:ui`. Para um cenário: `npm test -- --grep CT-04`.

## Variáveis opcionais

```powershell
$env:TEST_EXECUTOR = 'Seu nome — execução e revisão'
# Somente se usar uma conta de teste diferente da demonstração:
$env:TOOLSHOP_EMAIL = 'conta-de-teste@example.com'
$env:TOOLSHOP_PASSWORD = 'senha-da-conta-de-teste'
$env:TOOLSHOP_NOME = 'Nome exibido no menu'
npm test
```

As três variáveis `TOOLSHOP_*` precisam corresponder à mesma conta. Sem elas, utiliza-se a conta pública de demonstração já presente na suíte original. `BASE_URL` permite testar outra instalação compatível. Não grave credenciais pessoais nos arquivos. As variáveis acima pertencem ao sistema sob teste, não ao Git.

## Ler uma falha

1. Abra o teste em `npm run report` e leia a asserção que falhou.
2. Confira a captura, o ambiente e, quando disponível, o trace.
3. Distinga indisponibilidade, dados alterados, erro de automação e possível defeito do produto.
4. Repita apenas o caso afetado após investigar. Para confirmar a entrega, rode novamente `npm test` completo.
5. Encaminhe ao responsável por defeitos somente ocorrências analisadas, com passos, esperado, observado e evidência.

Não altere o resultado esperado apenas para obter aprovação. Se o critério mudar, registre o motivo e alinhe com o responsável pelos testes manuais.

## Roteiro para demonstrar e explicar

1. Mostre a tabela de rastreabilidade em `docs/testes-automatizados.md` e relacione um CT ao caso manual.
2. Rode `npm run test:smoke -- --headed` e explique a independência dos testes de carrinho.
3. Mostre no código CT-04 a comparação do preço unitário × quantidade com o total observado.
4. Mostre SIM-01: identifique a resposta substituída, sua finalidade e a limitação do stub. Compare com CT-09.
5. Abra as evidências da execução completa e explique cobertura funcional, taxa de execução e taxa de aprovação.
6. Cite uma limitação real, como ausência de cobertura de código ou uso de ambiente público, e proponha o próximo caso que você priorizaria.

O enunciado exige domínio técnico e análise própria. Use este roteiro para preparar sua explicação e escreva suas conclusões após revisar a execução. Não apresente texto assistido por IA como análise autoral já revisada.
