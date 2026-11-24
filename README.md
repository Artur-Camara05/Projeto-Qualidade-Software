# Projeto de Testes e Qualidade de Software

**Sistema escolhido:** [Practice Software Testing](https://practicesoftwaretesting.com/).

**Entrega:** 23/11/2026 pelo Teams. **Apresentação:** 26/11/2026.

## Sobre o projeto

Vamos avaliar a qualidade desse site, que já existe. O grupo vai decidir quais funcionalidades testar, planejar e executar os testes, analisar os resultados e propor melhorias.

Este repositório reúne o código dos testes e a documentação do trabalho.

## Divisão de tarefas

Os seis integrantes devem escolher suas partes e preencher os responsáveis.

| Parte | Responsável | O que precisa ser feito |
|---|---|---|
| 1. Planejamento | A definir | Combinar o escopo, a estratégia de verificação e validação, os riscos, as prioridades e os critérios para iniciar e encerrar os testes. |
| 2. Testes manuais e exploratórios | A definir | Criar e executar casos manuais. Realizar sessões exploratórias com objetivo definido e registrar ações, resultados e evidências. |
| 3. Testes automatizados | A definir | Desenvolver testes adequados ao escopo, analisar cobertura, justificar o uso de mocks/stubs e organizar os testes de regressão. |
| 4. Qualidade de software | A definir | Revisar código, analisar métricas e code smells e propor refatorações. Propor a melhoria ou correção de uma funcionalidade, com critérios de qualidade e análise dos impactos. |
| 5. Gestão de defeitos | A definir | Organizar os bugs encontrados pelo grupo, com passos para reproduzir, resultado esperado e observado, evidências, severidade, prioridade e acompanhamento. |
| 6. CI/CD | Carlos Damasceno | Configurar ou apresentar uma proposta detalhada de pipeline com build, testes automáticos e critérios de aprovação. |

As partes se complementam. Cada responsável desenvolve e explica sua contribuição, com apoio dos colegas quando necessário.

## Como começar e contribuir

1. Conhecer o site e combinar quais funcionalidades serão avaliadas.
2. Escolher os responsáveis e as ferramentas que serão utilizadas.
3. Desenvolver cada parte e enviar os arquivos para este repositório.
4. Reunir os resultados no PDF e preparar a apresentação em grupo.

Conforme o trabalho avançar, podem criar pastas como `docs/` para os textos, `tests/` para os testes e `evidencias/` para prints, logs e relatórios. Não há modelos obrigatórios: cada pessoa organiza sua parte de forma compreensível, sem sobrescrever o trabalho dos colegas.

Registrem o ambiente, a data e quem executou os testes. As análises devem explicar o que foi feito, por quê e o que os resultados significam, respeitando as regras de autoria e uso de IA do enunciado.

## Executar os testes

Com Node.js 24 instalado, execute na raiz do projeto:

```bash
npm ci
npx playwright install chromium
npm test
npm run report
```

Para acompanhar o navegador, use `npm run test:headed`. Depois de uma execução completa, `npm run check:results` confere os resultados dos 10 casos reais e do caso simulado.

## Integração contínua

O workflow em `.github/workflows/ci.yml` executa os testes em pull requests para `main`, em pushes para `main` e por acionamento manual na aba Actions. Os relatórios e as evidências ficam disponíveis por 14 dias.

As etapas, os critérios de aprovação e a proposta de build e entrega estão em [CI/CD](docs/parte-6-ci-cd.md).

## Entrega final

O PDF deve reunir a identificação dos integrantes, as seis frentes do trabalho, a proposta de melhoria e seus impactos, as conclusões e as evidências. Incluam o link do repositório com acesso liberado. Todos participam da revisão e da apresentação.

## Referências

- [Site para testar](https://practicesoftwaretesting.com/)
- [Documentação da API](https://api.practicesoftwaretesting.com/api/documentation)
- [Código original e instruções de instalação](https://github.com/testsmith-io/practice-software-testing)
