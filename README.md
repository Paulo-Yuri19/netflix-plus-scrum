# Netflix+ Scrum Project

## Sobre

Projeto desenvolvido para a disciplina de Desenvolvimento Ágil utilizando a metodologia Scrum.

## Equipe

- Paulo Yuri — Scrum Master
- Felipe — Product Owner
- Pedro Vitor — Desenvolvedor
- Pedro Lucas — Desenvolvedor
- Marcus — Desenvolvedor
- Diego — Desenvolvedor

## Ferramentas

- GitHub
- GitHub Projects
- GitHub Issues

## Metodologia

- Scrum

## Sprints

- Sprint 0 – Planejamento
- Sprint 1 – MVP
- Sprint 2 – Funcionalidades do Usuário
- Sprint 3 – Recursos Avançados

## Funcionalidades

- Cadastro de usuário
- Login
- Gerenciamento de perfis
- Catálogo de filmes e séries
- Reprodução de conteúdo
- Assinatura
- Administração

## Como executar o projeto

### Pré-requisitos
- Node.js e npm instalados

### Passos

1. Clonar o repositório:
   ```bash
   git clone https://github.com/Paulo-Yuri19/netflix-plus-scrum.git
   cd netflix-plus-scrum
   ```

2. Instalar dependências:
   ```bash
   npm install
   ```

3. Executar os testes:
   ```bash
   npm test
   ```

4. Executar os testes em modo de observação (watch):
   ```bash
   npm run test:watch
   ```

## Fluxo de desenvolvimento

Para cada User Story, seguir esta sequência:

1. Atualizar a branch `main`
2. Criar uma nova branch para a User Story
3. Ler `spec.md`, `plan.md` e `tasks.md` da funcionalidade
4. Implementar as tarefas conforme documentado
5. Executar os testes (`npm test`)
6. Fazer commit das alterações
7. Fazer push da branch
8. Abrir um Pull Request
9. Realizar code review
10. Fazer merge na `main`

### Preparação de User Stories (quando documentação não está pronta)

Quando a especificação da User Story ainda não estiver preparada, utilizar o Spec Kit:

1. `/speckit-specify` — Criar a especificação da funcionalidade
2. `/speckit-clarify` — Esclarecer pontos não definidos (se necessário)
3. `/speckit-plan` — Criar o plano de implementação
4. `/speckit-tasks` — Gerar as tarefas ordenadas por dependência
5. Prosseguir com a implementação conforme fluxo acima
