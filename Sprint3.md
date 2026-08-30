# Sprint 3 — Catálogo e reprodução

## Objetivo do Sprint

Concluir o MVP com um fluxo visual completo no qual o usuário pesquisa um catálogo local, consulta os detalhes de um item e reproduz um conteúdo demonstrativo.

## User Stories, na ordem de implementação

| Ordem | ID | User Story | Prioridade | Status |
|---:|---|---|---|---|
| 1 | US-011 | Como usuário com perfil ativo, quero pesquisar conteúdos pelo título para encontrar o que desejo assistir. | Alta | Planejada |
| 2 | US-015 | Como usuário, quero abrir os detalhes de um conteúdo para decidir se desejo assisti-lo. | Alta | Planejada |
| 3 | US-016 | Como usuário, quero reproduzir um conteúdo demonstrativo para assistir ao item escolhido. | Alta | Planejada |

## Recorte das entregas

| ID | Tela | Interação e dados | Comportamento esperado |
|---|---|---|---|
| US-011 | Catálogo/página inicial | Texto de pesquisa e pequeno catálogo local | Filtrar cards por título, limpar a busca e mostrar estado sem resultados. |
| US-015 | Detalhes do conteúdo | Item selecionado e seus metadados | Mostrar informações, ação “Assistir” e retorno ao catálogo. |
| US-016 | Reprodução | Vídeo demonstrativo associado ao item | Abrir player simples com controles nativos e retorno aos detalhes. |

## Dados mínimos do catálogo

O catálogo local deve conter poucos itens e somente os dados reutilizados pelas três histórias: identificador, título, imagem, tipo, ano, classificação, sinopse e referência para vídeo demonstrativo. Ao menos um item deve possuir mídia reproduzível para a apresentação.

## Entregas principais

- Área inicial com cards de conteúdo e identificação do perfil ativo.
- Pesquisa simples por título e mensagem para pesquisa sem resultados.
- Tela de detalhes conectada ao card escolhido.
- Tela de reprodução conectada à ação “Assistir”.
- Navegação de ida e volta entre catálogo, detalhes e reprodução.

## Critérios de aceitação

### US-011 — Pesquisa de conteúdo

- Digitar parte de um título encontra os cards correspondentes sem diferenciar maiúsculas de minúsculas.
- Limpar a pesquisa volta a mostrar o pequeno catálogo completo.
- Uma pesquisa sem correspondências exibe um estado vazio claro.

### US-015 — Visualização de detalhes

- Selecionar um card abre os dados corretos daquele conteúdo.
- A tela apresenta título, imagem, tipo, ano, classificação, sinopse e ação “Assistir”.
- A ação de voltar retorna ao catálogo sem quebrar o fluxo.

### US-016 — Assistir conteúdo

- Acionar “Assistir” em um item com mídia abre o conteúdo correto em um player funcional.
- O player usa controles nativos e identifica o título reproduzido.
- É possível voltar aos detalhes; se não houver mídia, uma mensagem clara é exibida.

## Dependências e consistência

- US-011 reutiliza a sessão e o perfil ativo entregues no Sprint 2.
- US-015 reutiliza exatamente os mesmos dados e cards apresentados por US-011.
- US-016 é iniciada pela ação da tela criada em US-015.
- As três telas devem manter os padrões visuais e de navegação dos Sprints anteriores.
- O catálogo deve ser compartilhado e local para evitar dados duplicados ou incompatíveis entre as histórias.

## Fora deste Sprint

Filtros avançados, recomendações, Minha Lista, continuação automática, legendas, idiomas, qualidade, download, assinatura, pagamentos e administração de catálogo não fazem parte do MVP. Pausar pode ser demonstrado pelo controle nativo do player, sem uma história separada.

## Definition of Done

- Cada história possui sua própria spec, plano e tarefas antes da implementação.
- Critérios de aceitação são atendidos e podem ser testados manualmente de forma independente.
- Fluxo completo foi testado: perfil ativo → pesquisa → detalhes → reprodução → retorno.
- Testes relacionados passam e o incremento está pronto para demonstração visual.

## Resultado esperado

Ao final do Sprint, o MVP permite demonstrar de ponta a ponta cadastro, acesso, perfil, pesquisa, detalhes e reprodução simples, sem backend ou infraestrutura de streaming.
