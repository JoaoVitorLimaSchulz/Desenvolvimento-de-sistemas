// js/servicos.js
// Depende de js/api.js (apiGet, apiPost, apiPut, apiDelete)

async function carregarServicos() {
    try {
      const servicos = await apiGet("/servicos");
      const tbody = document.getElementById("listaServicos");
      tbody.innerHTML = "";
  
      servicos.forEach(s => {
        tbody.innerHTML += `
        <tr>
          <td>${s.id}</td>
          <td>${escapeHtml(s.nome)}</td>
          <td>${s.duracao_prevista_min}</td>
          <td>${s.preco !== null ? s.preco.toFixed(2) : ''}</td>
          <td class="actions">
            <button onclick="editarServico(${s.id}, ${jsonSafe(s.nome)}, ${s.duracao_prevista_min}, ${s.preco !== null ? s.preco : 'null'}, ${jsonSafe(s.descricao)})">Editar</button>
            <button onclick="excluirServico(${s.id})">Excluir</button>
          </td>
        </tr>`;
      });
    } catch (err) {
      alert("Erro ao carregar serviços.");
      console.error(err);
    }
  }
  
  document.getElementById("formServico").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value.trim();
    const duracao = parseInt(document.getElementById("duracao").value, 10);
    const precoVal = document.getElementById("preco").value;
    const preco = precoVal === "" ? null : parseFloat(precoVal);
    const descricao = document.getElementById("descricao").value.trim();
  
    if (!nome || !duracao) {
      alert("Preencha nome e duração.");
      return;
    }
  
    try {
      if (id) {
        await apiPut("/servicos/" + id, { nome, duracao_prevista_min: duracao, preco, descricao });
        alert("Serviço atualizado.");
      } else {
        await apiPost("/servicos", { nome, duracao_prevista_min: duracao, preco, descricao });
        alert("Serviço criado.");
      }
      e.target.reset();
      carregarServicos();
    } catch (err) {
      alert("Erro ao salvar serviço.");
      console.error(err);
    }
  });
  
  function editarServico(id, nome, duracao, preco, descricao) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("duracao").value = duracao;
    document.getElementById("preco").value = preco !== null ? preco : "";
    document.getElementById("descricao").value = descricao !== null ? descricao : "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  async function excluirServico(id) {
    if (!confirm("Deseja realmente excluir este serviço?")) return;
    try {
      await apiDelete("/servicos/" + id);
      carregarServicos();
    } catch (err) {
      alert("Erro ao excluir serviço.");
      console.error(err);
    }
  }
  
  // pequenas utilidades para evitar XSS e formatar strings nas chamadas inline
  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // transforma string em literal JS seguro para injeção em template (usado acima)
  function jsonSafe(value) {
    if (value === null || value === undefined) return "null";
    return JSON.stringify(String(value)).replace(/</g, '\\u003c');
  }
  
  // Carrega lista ao abrir a página
  carregarServicos();
  