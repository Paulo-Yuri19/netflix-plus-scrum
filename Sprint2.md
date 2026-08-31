# Sprint 2 — Acesso e gerenciamento de perfis

## Objetivo do Sprint

Permitir que uma conta cadastrada acesse a plataforma, crie e gerencie perfis simples e encerre a sessão.

## User Stories do Sprint

| Ordem | ID | User Story | Prioridade | Status |
|---:|---|---|---|---|
| 1 | US-002 | Como usuário cadastrado, quero entrar com e-mail e senha para acessar minha conta. | Alta | Concluída |
| 2 | US-006 | Como usuário autenticado, quero criar um perfil com nome para identificar quem está usando a plataforma. | Alta | Concluída |
| 3 | US-007 | Como usuário autenticado, quero editar meu perfil para manter suas informações atualizadas. | Baixa | Concluída |
| 4 | US-010 | Como usuário autenticado, quero alterar o avatar do meu perfil para personalizá-lo. | Baixa | Concluída |
| 5 | US-008 | Como usuário autenticado, quero excluir um perfil que não seja mais utilizado para manter minha conta organizada. | Baixa | Concluída |
| 6 | US-004 | Como usuário autenticado, quero sair da conta para encerrar minha sessão local. | Média | Planejada |

## Recorte das entregas

| ID | Tela ou parte da interface | Interação e dados | Comportamento esperado |
|---|---|---|---|
| US-002 | Tela de login | E-mail e senha de conta existente | Validar credenciais locais, iniciar sessão e encaminhar à área de perfis. |
| US-006 | Tela de perfis | Nome informado e avatar padrão | Salvar o perfil na conta, exibir seu cartão e torná-lo ativo. |
| US-007 | Edição de perfil | Perfil existente, nome e avatar | Salvar as alterações localmente e atualizar a seleção de perfis. |
| US-010 | Alteração de avatar | Perfil existente e avatar selecionado | Persistir o avatar e refletir a mudança na seleção de perfis. |
| US-008 | Exclusão de perfil | Perfil existente e confirmação | Remover o perfil localmente somente após confirmação. |
| US-004 | Ação “Sair” na área autenticada | Sessão atual | Encerrar somente a sessão e retornar ao login. |

## Entregas principais

- Tela de login que reutiliza as contas e a sessão criadas no Sprint 1.
- Tela de perfis com um formulário curto para o nome e um avatar padrão.
- Cartão do perfil salvo, ativação do perfil e persistência após recarregar a página.
- Edição das informações básicas de um perfil existente.
- Seleção e persistência de avatar.
- Exclusão de perfil mediante confirmação.
- Ação visível de logout nas telas autenticadas.
- Navegação simples entre login, perfis e a área inicial que será expandida no Sprint 3.

## Critérios de aceitação

### US-002 — Login

- Credenciais válidas iniciam uma sessão que permanece após recarregar a página.
- Credenciais inválidas exibem uma mensagem clara e não iniciam sessão.
- Usuário autenticado é encaminhado à área de perfis.

### US-006 — Criação de perfil

- Usuário autenticado consegue informar um nome e salvar o perfil com o avatar padrão.
- O cartão criado aparece, torna-se o perfil ativo e permanece após recarregar.
- Nome vazio não é aceito e apresenta orientação clara.

### US-007 — Editar perfil

- Usuário autenticado consegue alterar nome e avatar de um perfil existente.
- As alterações são salvas localmente e aparecem na seleção de perfis.

### US-010 — Alterar avatar

- Usuário autenticado visualiza as opções de avatar disponíveis.
- O avatar selecionado é salvo e aparece no perfil.

### US-008 — Excluir perfil

- Usuário autenticado seleciona um perfil e confirma a exclusão.
- O perfil é removido da persistência local e deixa de aparecer na seleção.

### US-004 — Logout

- A ação encerra a sessão e retorna ao login.
- A conta e os perfis persistidos não são apagados.
- Após sair, a área autenticada não trata o visitante como logado.

## Dependências e consistência

- US-002 reutiliza o formato de conta e sessão da US-001.
- US-006 depende de uma sessão válida criada por US-001 ou US-002.
- US-007, US-010 e US-008 dependem de um perfil existente criado pela US-006.
- US-004 deve funcionar em todas as telas autenticadas criadas a partir deste Sprint.
- Login e perfis devem reutilizar cores, tipografia, espaçamento e padrões de feedback já usados no cadastro.
- Perfil infantil, recuperação de senha e 2FA não fazem parte deste Sprint.

## Definition of Done

- Cada história possui sua própria spec, plano e tarefas antes da implementação.
- Critérios de aceitação são verificáveis de forma independente e estão atendidos.
- Fluxo completo foi testado manualmente: cadastrar/entrar → criar perfil → editar, alterar avatar ou excluir quando desejado → sair.
- Testes relacionados passam e as telas estão prontas para demonstração visual.

## Histórico das entregas concluídas

| ID | Pull Request |
|---|---|
| US-002 | #45 |
| US-006 | #41 |
| US-007 | #42 |
| US-010 | #44 |
| US-008 | #43 |

## Resultado esperado

Ao final do Sprint, uma pessoa consegue acessar uma conta local, criar e gerenciar perfis simples e sair. O perfil ativo servirá como ponto de entrada para o catálogo no Sprint 3.
