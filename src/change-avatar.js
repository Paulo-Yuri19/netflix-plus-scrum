let selectedAvatarColor = "";

function selectAvatar(element) {
    // Remove a classe 'selected' de todos os avatares
    let allAvatars = document.querySelectorAll('.avatar-option');
    allAvatars.forEach(av => av.classList.remove('selected'));

    // Adiciona a borda branca no avatar que foi clicado
    element.classList.add('selected');
    
    // Salva a cor escolhida na variável global
    selectedAvatarColor = element.getAttribute('data-avatar');
}

function saveAvatar() {
    if (selectedAvatarColor === "") {
        alert("Por favor, selecione um avatar clicando em uma das cores.");
        return;
    }

    let profiles = JSON.parse(localStorage.getItem('netflix_profiles')) || [];
    
    if (profiles.length > 0) {
        // Altera o avatar do primeiro perfil (simulando o usuário logado)
        profiles[0].avatar = selectedAvatarColor;
        
        // Salva de volta no localStorage
        localStorage.setItem('netflix_profiles', JSON.stringify(profiles));
        
        alert("Avatar alterado com sucesso!");
        window.location.href = "../index.html"; // Redireciona
    } else {
        alert("Nenhum perfil encontrado para alterar.");
    }
}

function cancel() {
    window.location.href = "../index.html";
}