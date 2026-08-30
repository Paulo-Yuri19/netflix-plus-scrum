# Plano Técnico: US-010 - Alterar Avatar

## Tecnologias e Simplicidade
HTML, CSS e JavaScript puro (Vanilla). Para evitar a necessidade de baixar imagens externas (mantendo a simplicidade), usaremos cores sólidas/emojis para representar os avatares disponíveis.

## Estrutura de Arquivos
- `src/change-avatar.html`: Tela exibindo uma grade (grid) com opções de avatares clicáveis.
- `src/change-avatar.js`: Lógica para capturar o clique no avatar, dar destaque visual à seleção e salvar a alteração.

## Persistência de Dados
O script vai ler o array `netflix_profiles` salvo no `localStorage`, atualizar a propriedade `avatar` do perfil ativo (usaremos o primeiro perfil da lista como base para simulação) e salvar novamente.