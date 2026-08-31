// Carrega o primeiro perfil salvo para simular a edição (simplicidade do projeto)
document.addEventListener("DOMContentLoaded", () => {
    let profiles = JSON.parse(localStorage.getItem('netflix_profiles')) || [];
    
    if (profiles.length > 0) {
        // Preenche os campos com os dados do perfil existente
        document.getElementById('edit-name').value = profiles[0].name;
        
        // Se o perfil já tiver um avatar salvo que está na lista, ele seleciona
        let avatarSelect = document.getElementById('edit-avatar');
        if([...avatarSelect.options].some(opt => opt.value === profiles[0].avatar)) {
            avatarSelect.value = profiles[0].avatar;
        }
    } else {
        alert("Nenhum perfil encontrado. Crie um perfil primeiro.");
    }
});

function updateProfile() {
    const newName = document.getElementById('edit-name').value.trim();
    const newAvatar = document.getElementById('edit-avatar').value;

    if (newName === "") {
        alert("O nome não pode ficar vazio.");
        return;
    }

    let profiles = JSON.parse(localStorage.getItem('netflix_profiles')) || [];
    
    if (profiles.length > 0) {
        // Atualiza os dados do primeiro perfil (simulação)
        profiles[0].name = newName;
        profiles[0].avatar = newAvatar;
        
        // Salva imediatamente no localStorage conforme critério de aceite
        localStorage.setItem('netflix_profiles', JSON.stringify(profiles));
        alert("Perfil atualizado com sucesso!");
    }
}

function cancelEdit() {
    window.location.href = "../index.html"; // Redireciona de volta
}