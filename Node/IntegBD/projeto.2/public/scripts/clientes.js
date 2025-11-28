const apiUrl = "http://localhost:3000/cliente";


async function carregarClientes() {
    const resposta = await fetch(apiUrl);
    const clientes = await resposta.json();

    const tbody = document.getElementById("listaClientes");
    tbody.innerHTML = "";

    clientes.forEach(cli => {
        tbody.innerHTML += `
            <tr>
                <td>${cli.id}</td>
                <td>${cli.nome}</td>
                <td>${cli.email}</td>
                <td>${cli.telefone}</td>
                <td>
                    <button class="action-btn" onclick="editarCliente(${cli.id})">Editar</button>
                    <button class="action-btn" onclick="excluirCliente(${cli.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}


document.getElementById("formClientes").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone })
    });

    carregarClientes();
    e.target.reset();
});


async function excluirCliente(id) {
    if (!confirm("Deseja realmente excluir este cliente?")) return;

    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    carregarClientes();
}


async function editarCliente(id) {
    const novoNome = prompt("Novo nome:");
    const novoEmail = prompt("Novo email:");
    const novoTelefone = prompt("Novo telefone:");

    if (!novoNome || !novoEmail || !novoTelefone) return;

    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: novoNome,
            email: novoEmail,
            telefone: novoTelefone
        })
    });

    carregarClientes();
}

carregarClientes();
