const API = "http://localhost:3000";

// ==========================
// Carregar selects (FKs)
// ==========================

async function carregarSelects() {
    const selects = {
        cliente_id: "clientes",
        servico_id: "servicos",
        profissional_id: "profissionais"
    };

    for (const id in selects) {
        const resposta = await fetch(`${API}/${selects[id]}`);
        const dados = await resposta.json();

        const select = document.getElementById(id);
        select.innerHTML = dados.map(item => `
            <option value="${item.id}">${item.nome}</option>
        `).join("");
    }
}

// ==========================
// Listar Agendamentos
// ==========================

async function listarAgendamentos() {
    const resposta = await fetch(`${API}/agendamentos`);
    const agendamentos = await resposta.json();

    const tbody = document.getElementById("lista-agendamentos");

    tbody.innerHTML = agendamentos.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.cliente_nome}</td>
            <td>${a.servico_nome}</td>
            <td>${a.profissional_nome}</td>
            <td>${a.data}</td>
            <td>${a.hora}</td>
            <td>
                <button class="edit" onclick="editarAgendamento(${a.id})">Editar</button>
                <button class="delete" onclick="deletarAgendamento(${a.id})">Excluir</button>
            </td>
        </tr>
    `).join("");
}

// ==========================
// Criar / Editar Agendamento
// ==========================

let idEdicao = null;

document.getElementById("form-agendamento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const agendamento = {
        cliente_id: document.getElementById("cliente_id").value,
        servico_id: document.getElementById("servico_id").value,
        profissional_id: document.getElementById("profissional_id").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value
    };

    const metodo = idEdicao ? "PUT" : "POST";
    const url = idEdicao ? `${API}/agendamentos/${idEdicao}` : `${API}/agendamentos`;

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento)
    });

    idEdicao = null;
    e.target.reset();
    listarAgendamentos();
});

// ==========================
// Escolher item para editar
// ==========================

async function editarAgendamento(id) {
    const resposta = await fetch(`${API}/agendamentos/${id}`);
    const a = await resposta.json();

    document.getElementById("cliente_id").value = a.cliente_id;
    document.getElementById("servico_id").value = a.servico_id;
    document.getElementById("profissional_id").value = a.profissional_id;
    document.getElementById("data").value = a.data;
    document.getElementById("hora").value = a.hora;

    idEdicao = id;
}

// ==========================
// Excluir Agendamento
// ==========================

async function deletarAgendamento(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    await fetch(`${API}/agendamentos/${id}`, { method: "DELETE" });
    listarAgendamentos();
}

// ==========================
// Inicialização
// ==========================

carregarSelects();
listarAgendamentos();
