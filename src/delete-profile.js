// Carrega os perfis do localStorage para preencher as opções
document.addEventListener("DOMContentLoaded", () => {
    let profiles = JSON.parse(localStorage.getItem('netflix_profiles')) || [];
    let select = document.getElementById('profile-select');
    let deleteBtn = document.getElementById('delete-btn');

    if (profiles.length === 0) {
        select.innerHTML = '<option value="">Nenhum perfil disponível</option>';
        select.disabled = true;
        deleteBtn.disabled = true;
        return;
    }

    // Cria as opções de acordo com os perfis salvos
    profiles.forEach((profile, index) => {
        let option = document.createElement('option');
        option.value = index; // Usa a posição na lista para facilitar a exclusão
        option.textContent = profile.name;
        select.appendChild(option);
    });
});

function deleteProfile() {
    let select = document.getElementById('profile-select');
    let selectedIndex = select.value;

    if (selectedIndex === "") return;

    // Critério de Aceite: Solicitar confirmação
    let confirmacao = confirm("Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.");

    if (confirmacao) {
        let profiles = JSON.parse(localStorage.getItem('netflix_profiles')) || [];
        
        // Remove o perfil selecionado da lista
        profiles.splice(selectedIndex, 1);
        
        // Salva a lista atualizada de volta no localStorage
        localStorage.setItem('netflix_profiles', JSON.stringify(profiles));
        
        alert("Perfil excluído com sucesso.");
        window.location.href = "../index.html"; // Redireciona de volta
    }
}

function cancelDelete() {
    window.location.href = "../index.html";
}