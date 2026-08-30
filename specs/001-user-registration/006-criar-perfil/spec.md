# Especificação: US-006 - Criar Perfil

## Objetivo
Permitir que o usuário crie um novo perfil na conta para separar seu histórico e preferências de outras pessoas (estilo Netflix).

## Requisitos Funcionais
- A tela deve exibir um campo para o nome do perfil.
- O sistema não deve permitir salvar se o nome estiver em branco.
- O sistema deve salvar o perfil no `localStorage` do navegador para manter a simplicidade.
- Após salvar, o sistema deve redirecionar o usuário para a tela de seleção de perfis.