# Plano Técnico: US-008 - Excluir Perfil

## Tecnologias e Simplicidade
HTML, CSS e JavaScript puro (Vanilla).

## Estrutura de Arquivos
- `src/delete-profile.html`: A tela com a lista (dropdown) de perfis disponíveis para exclusão.
- `src/delete-profile.js`: A lógica para carregar os perfis, pedir confirmação e remover do armazenamento.

## Persistência de Dados
O script vai ler o array `netflix_profiles` salvo no `localStorage`, remover o perfil selecionado pelo usuário e salvar o array atualizado.