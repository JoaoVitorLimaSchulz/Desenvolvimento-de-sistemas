async function carregarClientes() {
    const clientes = await apiGet("/clientes");
    const tbody = document.getElementById("listaClientes");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        tbody.innerHTML += `
        <tr>
            <td>${c.id}</td>
            <td>${c.nome}</td>
            <td>${c.email}</td>
            <td class="actions">
                <button onclick="editarCliente(${c.id}, '${c.nome}', '${c.email}')">Editar</button>
                <button onclick="excluirCliente(${c.id})">Excluir</button>
            </td>
        </tr>`;
    });
}

document.getElementById("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (id) {
        await apiPut("/clientes/" + id, { nome, email });
    } else {
        await apiPost("/clientes", { nome, email });
    }

    e.target.reset();
    carregarClientes();
});

function editarCliente(id, nome, email) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
}

async function excluirCliente(id) {
    await apiDelete("/clientes/" + id);
    carregarClientes();
}

carregarClientes();
