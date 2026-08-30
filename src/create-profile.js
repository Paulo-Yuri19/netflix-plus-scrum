function saveProfile() {
    const nameInput = document.getElementById('profile-name').value.trim();
    const errorMsg = document.getElementById('error-msg');

    // Validação: verifica se o nome está vazio
    if (nameInput === "") {
        errorMsg.style.display = "block";
        return;
    }

    // Esconde a mensagem de erro caso estivesse aparecendo
    errorMsg.style.display = "none";

    // Pega os perfis que já existem no localStorage ou cria uma lista vazia
    let profiles = JSON.parse(localStorage.getItem('netflix_profiles')) || [];

    // Adiciona o novo perfil na lista
    profiles.push({
        id: Date.now(),
        name: nameInput,
        avatar: 'default-avatar.png'
    });

    // Salva a lista atualizada no localStorage
    localStorage.setItem('netflix_profiles', JSON.stringify(profiles));

    alert("Perfil criado com sucesso!");
    
    // Redireciona de volta para a tela inicial (ou seleção de perfis)
    // Como é um ambiente de teste, vamos apenas recarregar ou mandar pra raiz
    window.location.href = "../index.html"; 
}

function cancel() {
    // Redireciona de volta sem salvar
    window.location.href = "../index.html";
}