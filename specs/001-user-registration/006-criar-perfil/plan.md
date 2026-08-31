# Plano Técnico: US-006 - Criar Perfil

## Tecnologias e Simplicidade
Seguindo a regra do projeto, usaremos apenas HTML, CSS e JavaScript puro (Vanilla), sem dependências extras.

## Estrutura de Arquivos
- `src/create-profile.html`: A tela com o formulário.
- `src/create-profile.js`: A lógica para validar o formulário e salvar os dados.

## Persistência de Dados
Os dados serão salvos no `localStorage` em uma chave chamada `netflix_profiles` contendo um array de objetos.