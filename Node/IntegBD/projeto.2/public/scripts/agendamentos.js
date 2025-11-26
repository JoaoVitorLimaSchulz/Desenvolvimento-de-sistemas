const apiBase = "http://localhost:3000";

// === CARREGAR SELECTS ===
async function carregarSelects() {
    const clientes = await fetch(apiBase + "/clientes").then(r => r.json());
    const servicos = await fetch(apiBase + "/servicos").then(r => r.json());
    const profissionais = await fetch(apiBase + "/profissionais").then(r => r.json());

    preencherSelect("cliente", clientes);
    preencherSelect("servico", servicos);
    preencherSelect("profissional", profissionais);
}

function preencherSelect(id, lista) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    lista.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${item.nome}</option>`;
    });
}

// === LISTAR AGENDAMENTOS ===
async function carregarAgendamentos() {
    const dados = await fetch(apiBase + "/agendamentos").then(r => r.json());
    
    const tbody = document.getElementById("listaAgendamentos");
    tbody.innerHTML = "";

    dados.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.cliente_nome}</td>
                <td>${a.servico_nome}</td>
                <td>${a.profissional_nome}</td>
                <td>${a.data}</td>
                <td>${a.hora_inicio}</td>
                <td>
                    <select onchange="alterarStatus(${a.id}, this.value)">
                        <option value="agendado" ${a.status === "agendado" ? "selected" : ""}>Agendado</option>
                        <option value="concluido" ${a.status === "concluido" ? "selected" : ""}>Concluído</option>
                        <option value="cancelado" ${a.status === "cancelado" ? "selected" : ""}>Cancelado</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn" onclick="excluirAgendamento(${a.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// === CADASTRAR AGENDAMENTO ===
document.getElementById("formAgendar").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    const body = {
        cliente_id: document.getElementById("cliente").value,
        servico_id: document.getElementById("servico").value,
        profissional_id: document.getElementById("profissional").value,
        data,
        hora_inicio: hora,
        duracao: document.getElementById("duracao").value
    };

    const resp = await fetch(apiBase + "/agendamentos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    const resultado = await resp.json();

    if (!resp.ok) {
        alert("⚠ Erro: " + resultado.erro);
        return;
    }

    carregarAgendamentos();
    e.target.reset();
});

// === ALTERAR STATUS ===
async function alterarStatus(id, novoStatus) {
    await fetch(apiBase + `/agendamentos/status/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ status: novoStatus })
    });

    carregarAgendamentos();
}

// === EXCLUIR ===
async function excluirAgendamento(id) {
    if (!confirm("Excluir agendamento?")) return;

    await fetch(apiBase + `/agendamentos/${id}`, { method: "DELETE" });
    carregarAgendamentos();
}

// inicializar tudo
carregarSelects();
carregarAgendamentos();
