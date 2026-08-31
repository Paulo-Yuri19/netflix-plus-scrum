# Product Backlog — Netflix+

## Visão geral

O Netflix+ é um projeto acadêmico demonstrativo de Scrum e Spec-Driven Development. O produto será um frontend pequeno e funcional, feito preferencialmente com HTML, CSS e JavaScript puro, usando `localStorage` quando for necessária persistência simples.

O backlog responde ao que deve ser entregue e em qual ordem. Decisões técnicas detalhadas pertencem aos artefatos do Spec Kit de cada User Story.

## Backlog priorizado, em ordem de prioridade

As seis histórias de prioridade alta formam o núcleo do MVP. A história de logout é um apoio pequeno ao fluxo de autenticação. As histórias de edição, exclusão e alteração de avatar têm prioridade baixa, mas permanecem no planejamento porque já foram implementadas e integradas à `main`.

| Ordem | ID | User Story | Prioridade | Sprint | Status |
|---:|---|---|---|---|---|
| 1 | US-001 | Como visitante, quero criar uma conta com nome, e-mail e senha para acessar a plataforma. | Alta | Sprint 1 | Concluída |
| 2 | US-002 | Como usuário cadastrado, quero entrar com e-mail e senha para acessar minha conta. | Alta | Sprint 2 | Concluída |
| 3 | US-006 | Como usuário autenticado, quero criar um perfil com nome para identificar quem está usando a plataforma. | Alta | Sprint 2 | Concluída |
| 4 | US-011 | Como usuário com perfil ativo, quero pesquisar conteúdos pelo título para encontrar o que desejo assistir. | Alta | Sprint 3 | Planejada |
| 5 | US-015 | Como usuário, quero abrir os detalhes de um conteúdo para decidir se desejo assisti-lo. | Alta | Sprint 3 | Planejada |
| 6 | US-016 | Como usuário, quero reproduzir um conteúdo demonstrativo para assistir ao item escolhido. | Alta | Sprint 3 | Planejada |
| 7 | US-004 | Como usuário autenticado, quero sair da conta para encerrar minha sessão local. | Média | Sprint 2 | Planejada |
| 8 | US-007 | Como usuário autenticado, quero editar meu perfil para manter suas informações atualizadas. | Baixa | Sprint 2 | Concluída |
| 9 | US-010 | Como usuário autenticado, quero alterar o avatar do meu perfil para personalizá-lo. | Baixa | Sprint 2 | Concluída |
| 10 | US-008 | Como usuário autenticado, quero excluir um perfil que não seja mais utilizado para manter minha conta organizada. | Baixa | Sprint 2 | Concluída |

> US-001, US-002, US-006, US-007, US-008 e US-010 possuem implementação integrada à `main`. Elas permanecem no backlog para preservar o histórico da entrega, sem gerar nova implementação.

## Recorte funcional do MVP

Esta seção fornece somente o contexto de produto necessário para gerar boas especificações. Cada spec ainda deverá esclarecer os detalhes antes da implementação.

### US-001 — Cadastro de usuário

- **Tela:** cadastro.
- **Interação e dados:** informar nome, e-mail e senha e enviar o formulário.
- **Comportamento esperado:** validar os campos, impedir e-mail duplicado, persistir a conta localmente e iniciar a sessão definida pela spec existente.
- **Aceite resumido:** um cadastro válido é preservado após recarregar a página; dados inválidos ou duplicados geram mensagens claras; o usuário recebe confirmação e segue para a área inicial.

### US-002 — Login

- **Tela:** login.
- **Interação e dados:** informar e-mail e senha de uma conta já cadastrada.
- **Comportamento esperado:** validar as credenciais armazenadas localmente, iniciar a sessão e encaminhar o usuário à área de perfis.
- **Aceite resumido:** credenciais válidas permitem acesso e a sessão persiste ao recarregar; credenciais inválidas exibem erro sem iniciar sessão.

### US-006 — Criação de perfil

- **Tela:** perfis.
- **Interação e dados:** informar o nome do perfil; a interface atribui um avatar padrão.
- **Comportamento esperado:** associar e persistir o perfil na conta autenticada, exibir seu cartão e torná-lo o perfil ativo.
- **Aceite resumido:** um perfil válido aparece e fica ativo após ser salvo e continua disponível após recarregar; nome vazio não é aceito. Editar, excluir, alterar avatar e criar regras infantis permanecem histórias separadas deste recorte.

### US-007 — Editar perfil

- **Tela:** edição de perfil.
- **Interação e dados:** selecionar um perfil existente e alterar suas informações básicas.
- **Comportamento esperado:** salvar as alterações localmente e exibir o perfil atualizado na seleção de perfis.
- **Aceite resumido:** nome e avatar podem ser atualizados; as alterações permanecem no `localStorage` e aparecem na seleção de perfis.

### US-010 — Alterar avatar

- **Tela:** alteração de avatar.
- **Interação e dados:** escolher um avatar entre as opções disponíveis para o perfil.
- **Comportamento esperado:** salvar o avatar selecionado e refletir a mudança na seleção de perfis.
- **Aceite resumido:** a lista de avatares é exibida; a escolha é persistida; o novo avatar aparece no perfil.

### US-008 — Excluir perfil

- **Tela:** exclusão de perfil.
- **Interação e dados:** selecionar um perfil existente e confirmar sua exclusão.
- **Comportamento esperado:** remover o perfil da persistência local e da lista de perfis somente após confirmação.
- **Aceite resumido:** a exclusão exige confirmação e o perfil removido deixa de aparecer na seleção.

### US-011 — Pesquisa de conteúdo

- **Tela:** catálogo/página inicial.
- **Interação e dados:** digitar parte de um título e consultar um catálogo local pequeno.
- **Comportamento esperado:** mostrar os cards correspondentes, permitir limpar a pesquisa e informar quando não houver resultado.
- **Aceite resumido:** a busca encontra títulos sem diferenciar maiúsculas de minúsculas; consulta vazia mostra o catálogo; nenhum resultado exibe um estado vazio claro.

### US-015 — Visualização de detalhes

- **Tela:** detalhes do conteúdo.
- **Interação e dados:** selecionar um card e consultar título, imagem, tipo, ano, classificação e sinopse do item.
- **Comportamento esperado:** exibir os dados do conteúdo selecionado, uma ação para assistir e uma forma de voltar ao catálogo.
- **Aceite resumido:** o item selecionado abre com os dados corretos; “Assistir” encaminha à reprodução; “Voltar” retorna ao catálogo.

### US-016 — Assistir conteúdo

- **Tela:** reprodução.
- **Interação e dados:** acionar “Assistir” nos detalhes e reproduzir um vídeo demonstrativo associado ao conteúdo.
- **Comportamento esperado:** abrir um player simples, usar controles nativos do navegador e permitir voltar aos detalhes.
- **Aceite resumido:** ao menos um item do catálogo pode ser reproduzido; o título do item é identificado; ausência de mídia gera uma mensagem clara. Streaming real, controles personalizados e recursos avançados não fazem parte da história.

### US-004 — Logout (apoio)

- **Parte da interface:** ação “Sair” na área autenticada.
- **Comportamento esperado:** encerrar a sessão local e voltar ao login, sem apagar a conta ou os perfis.
- **Aceite resumido:** após sair, páginas que exigem sessão não permanecem acessíveis como usuário autenticado.

## Dados compartilhados entre as histórias

- **Conta:** nome, e-mail, credencial protegida conforme a spec existente e sessão local.
- **Perfil:** nome e avatar padrão na criação, com edição e seleção de avatar disponíveis nas histórias já entregues.
- **Conteúdo:** identificador, título, imagem, tipo, ano, classificação, sinopse e referência para um vídeo demonstrativo.

Os dados podem ser locais e reduzidos. Não são necessários backend, banco de dados, serviço de streaming, integração externa ou painel para cadastrar conteúdos.

## Candidatas futuras

Estas histórias são úteis, mas não pertencem aos Sprints atuais e ainda não foram implementadas. Só devem voltar ao backlog ativo após a conclusão do MVP e nova priorização do Product Owner.

| ID | Funcionalidade | Prioridade atual | Sprint | Status |
|---|---|---|---|---|
| US-012 | Filtrar Conteúdo | Baixa | Não planejada | Futuro |
| US-013 | Minha Lista | Baixa | Não planejada | Futuro |
| US-018 | Continuar Assistindo | Baixa | Não planejada | Futuro |

## Fora do escopo do projeto demonstrativo

As histórias abaixo foram preservadas como referência, mas não devem gerar specs, tarefas ou implementação neste projeto. Elas exigem infraestrutura, regras de produto ou esforço desproporcional ao valor acadêmico do MVP.

| ID | Funcionalidade | Motivo principal |
|---|---|---|
| US-003 | Recuperação de Senha | Exigiria um fluxo confiável de recuperação, normalmente com backend e envio de e-mail. |
| US-005 | Autenticação em Dois Fatores | Exige infraestrutura e segurança incompatíveis com o escopo local; 2FA não faz parte do produto principal. |
| US-009 | Perfil Infantil | Introduz regras de classificação, restrição e navegação adicionais. |
| US-014 | Recomendações Personalizadas | Exigiria histórico, regras de recomendação e dados que o MVP não possui. |
| US-017 | Pausar Reprodução | Já é atendida pelos controles nativos do player e não precisa ser uma User Story separada. |
| US-019 | Legendas | Exige arquivos de legenda, sincronização e controles adicionais. |
| US-020 | Alterar Idioma | Exige múltiplas faixas de áudio e conteúdo preparado. |
| US-021 | Ajustar Qualidade | Exige múltiplas versões da mídia ou streaming adaptativo. |
| US-022 | Download Offline | Exige armazenamento e gerenciamento de mídia fora do escopo. |
| US-023 | Escolher Plano | Assinaturas não são necessárias para demonstrar o fluxo principal. |
| US-024 | Alterar Plano | Depende de um domínio de assinaturas que não faz parte do MVP. |
| US-025 | Pagamento | Exigiria integração financeira e cuidados de segurança. |
| US-026 | Histórico de Cobranças | Depende de pagamentos e persistência de transações. |
| US-027 | Gerenciar Catálogo | Um catálogo local fixo é suficiente para a demonstração. |
| US-028 | Adicionar Conteúdo | Depende de administração e armazenamento de mídia. |
| US-029 | Remover Conteúdo | Depende de administração e persistência do catálogo. |
| US-030 | Dashboard Administrativo | Amplia o produto para outro tipo de usuário sem contribuir para o MVP. |

## Uso com Spec Kit

Quando uma User Story entrar em desenvolvimento, ela deve possuir sua própria pasta em `specs/`, contendo ao menos `spec.md`, `plan.md` e `tasks.md`. O fluxo esperado é:

`Constitution → Specification → Clarify (se necessário) → Plan → Tasks → Implement → Test`

As histórias futuras e fora do escopo não devem receber especificações enquanto não forem formalmente priorizadas. A spec deve respeitar o recorte desta página e não adicionar funcionalidades à história.
