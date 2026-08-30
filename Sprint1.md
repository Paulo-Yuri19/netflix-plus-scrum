# Sprint 1 — Cadastro de usuário

## Objetivo do Sprint

Entregar e validar o primeiro incremento funcional: permitir que um visitante crie uma conta local pela interface de cadastro.

## User Story

| ID | User Story | Prioridade | Status | Spec |
|---|---|---|---|---|
| US-001 | Como visitante, quero criar uma conta com nome, e-mail e senha para acessar a plataforma. | Alta | Em validação | `specs/001-user-registration/` |

## Recorte da entrega

- **Tela:** cadastro.
- **Interação principal:** preencher nome, e-mail e senha e enviar o formulário.
- **Dados:** conta e sessão persistidas localmente, conforme a spec existente.
- **Comportamento esperado:** validar entradas, impedir e-mail duplicado, confirmar o cadastro e encaminhar o usuário à área inicial.

## Entregas principais

- Interface de cadastro simples, responsiva e coerente com a identidade visual inicial.
- Validação dos campos e mensagens de erro compreensíveis.
- Persistência local da conta e da sessão.
- Teste manual do fluxo principal e dos erros de validação.
- Correção das falhas de teste relacionadas à história antes de marcá-la como concluída.

## Critérios de aceitação

- Um visitante com dados válidos consegue criar uma conta.
- A conta continua disponível após recarregar a página.
- E-mail duplicado, formato inválido e campos obrigatórios vazios são rejeitados com mensagens claras.
- Após o sucesso, o usuário recebe confirmação e segue para a área inicial definida na spec.

## Dependências e limites

- A história não depende de outra funcionalidade do produto.
- Login manual, criação de perfil, recuperação de senha e 2FA não fazem parte deste Sprint.
- A implementação deve continuar sendo frontend local; não deve ser criado backend.

## Definition of Done

- Critérios de aceitação da spec atendidos.
- Testes manuais realizados e testes automatizados relacionados passando.
- Código revisado pela equipe e documentação do Spec Kit atualizada.
- História pronta para demonstração visual sem preparação técnica especial.

## Resultado esperado

Ao final do Sprint, o grupo consegue demonstrar o cadastro e a persistência local de uma conta. Essa base será reutilizada pelo login no Sprint 2.
