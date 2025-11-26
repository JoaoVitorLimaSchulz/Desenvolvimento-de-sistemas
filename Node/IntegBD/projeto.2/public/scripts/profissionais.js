const apiUrl = "http://localhost:3000/profissionais";

// === LISTAGEM ===
async function carregarProfissionais() {
    const resposta = await fetch(apiUrl);
    const profissionais = await resposta.json();

    const tbody = document.getElementById("listaProfissionais");
    tbody.innerHTML = "";

    profissionais.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.especialidade}</td>
                <td>${p.telefone}</td>
                <td>
                    <button class="action-btn" onclick="editarProfissional(${p.id})">Editar</button>
                    <button class="action-btn" onclick="excluirProfissional(${p.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// === CADASTRAR ===
document.getElementById("formProfissionais").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const especialidade = document.getElementById("especialidade").value;
    const telefone = document.getElementById("telefone").value;

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, especialidade, telefone })
    });

    carregarProfissionais();
    e.target.reset();
});

// === EXCLUIR ===
async function excluirProfissional(id) {
    if (!confirm("Deseja excluir este profissional?")) return;

    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    carregarProfissionais();
}

// === EDITAR ===
async function editarProfissional(id) {
    const novoNome = prompt("Novo nome:");
    const novaEspecialidade = prompt("Nova especialidade:");
    const novoTelefone = prompt("Novo telefone:");

    if (!novoNome || !novaEspecialidade || !novoTelefone) return;

    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: novoNome,
            especialidade: novaEspecialidade,
            telefone: novoTelefone
        })
    });

    carregarProfissionais();
}

// inicializar
carregarProfissionais();
