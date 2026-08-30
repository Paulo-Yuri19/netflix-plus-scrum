# Plano Técnico: US-007 - Editar Perfil

## Tecnologias e Simplicidade
HTML, CSS e JavaScript puro (Vanilla), seguindo a regra de simplicidade do projeto.

## Estrutura de Arquivos
- `src/edit-profile.html`: A tela com o formulário de edição de nome e avatar.
- `src/edit-profile.js`: A lógica para carregar o perfil salvo, aplicar as alterações e salvar novamente.

## Persistência de Dados
Vamos resgatar a chave `netflix_profiles` do `localStorage`, alterar os dados do perfil selecionado e salvar a lista atualizada.