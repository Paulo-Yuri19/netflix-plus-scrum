# Sprint 2 — Acesso e perfil

## Objetivo do Sprint

Permitir que uma conta cadastrada acesse a plataforma, crie um perfil simples e encerre a sessão.

## User Stories, na ordem de implementação

| Ordem | ID | User Story | Prioridade | Status |
|---:|---|---|---|---|
| 1 | US-002 | Como usuário cadastrado, quero entrar com e-mail e senha para acessar minha conta. | Alta | Planejada |
| 2 | US-006 | Como usuário autenticado, quero criar um perfil com nome para identificar quem está usando a plataforma. | Alta | Planejada |
| 3 | US-004 | Como usuário autenticado, quero sair da conta para encerrar minha sessão local. | Média | Planejada |

## Recorte das entregas

| ID | Tela ou parte da interface | Interação e dados | Comportamento esperado |
|---|---|---|---|
| US-002 | Tela de login | E-mail e senha de conta existente | Validar credenciais locais, iniciar sessão e encaminhar à área de perfis. |
| US-006 | Tela de perfis | Nome informado e avatar padrão | Salvar o perfil na conta, exibir seu cartão e torná-lo ativo. |
| US-004 | Ação “Sair” na área autenticada | Sessão atual | Encerrar somente a sessão e retornar ao login. |

## Entregas principais

- Tela de login que reutiliza as contas e a sessão criadas no Sprint 1.
- Tela de perfis com um formulário curto para o nome e um avatar padrão.
- Cartão do perfil salvo, ativação do perfil e persistência após recarregar a página.
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

### US-004 — Logout

- A ação encerra a sessão e retorna ao login.
- A conta e os perfis persistidos não são apagados.
- Após sair, a área autenticada não trata o visitante como logado.

## Dependências e consistência

- US-002 reutiliza o formato de conta e sessão da US-001.
- US-006 depende de uma sessão válida criada por US-001 ou US-002.
- US-004 deve funcionar em todas as telas autenticadas criadas a partir deste Sprint.
- Login e perfis devem reutilizar cores, tipografia, espaçamento e padrões de feedback já usados no cadastro.
- Alterar perfil, excluir perfil, perfil infantil, recuperação de senha e 2FA não fazem parte deste Sprint.

## Definition of Done

- Cada história possui sua própria spec, plano e tarefas antes da implementação.
- Critérios de aceitação são verificáveis de forma independente e estão atendidos.
- Fluxo completo foi testado manualmente: cadastrar/entrar → criar perfil → sair.
- Testes relacionados passam e as telas estão prontas para demonstração visual.

## Resultado esperado

Ao final do Sprint, uma pessoa consegue acessar uma conta local, criar um perfil identificável e sair. O perfil ativo servirá como ponto de entrada para o catálogo no Sprint 3.
