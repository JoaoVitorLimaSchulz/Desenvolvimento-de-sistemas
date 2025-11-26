const apiUrl = "http://localhost:3000/servicos";

// === LISTAR SERVIÇOS ===
async function carregarServicos() {
    const resposta = await fetch(apiUrl);
    const servicos = await resposta.json();

    const tbody = document.getElementById("listaServicos");
    tbody.innerHTML = "";

    servicos.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.nome}</td>
                <td>R$ ${Number(s.valor).toFixed(2)}</td>
                <td>${s.duracao}</td>
                <td>
                    <button class="action-btn" onclick="editarServico(${s.id})">Editar</button>
                    <button class="action-btn" onclick="excluirServico(${s.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// === CADASTRAR SERVIÇO ===
document.getElementById("formServicos").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const valor = document.getElementById("valor").value;
    const duracao = document.getElementById("duracao").value;

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, valor, duracao })
    });

    carregarServicos();
    e.target.reset();
});

// === EXCLUIR SERVIÇO ===
async function excluirServico(id) {
    if (!confirm("Deseja realmente excluir este serviço?")) return;

    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    carregarServicos();
}

// === EDITAR SERVIÇO ===
async function editarServico(id) {
    const novoNome = prompt("Novo nome do serviço:");
    const novoValor = prompt("Novo valor:");
    const novaDuracao = prompt("Nova duração (minutos):");

    if (!novoNome || !novoValor || !novaDuracao) return;

    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: novoNome,
            valor: novoValor,
            duracao: novaDuracao
        })
    });

    carregarServicos();
}

// inicializar
carregarServicos();
