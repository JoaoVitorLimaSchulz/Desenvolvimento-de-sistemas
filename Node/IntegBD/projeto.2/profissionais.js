// js/profissionais.js

async function carregarProfissionais() {
    try {
      const profissionais = await apiGet("/profissionais");
      const tbody = document.getElementById("listaProfissionais");
      tbody.innerHTML = "";
  
      profissionais.forEach(p => {
        tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${escapeHtml(p.nome)}</td>
          <td>${escapeHtml(p.especialidade)}</td>
          <td>${escapeHtml(p.telefone || "")}</td>
          <td class="actions">
            <button onclick="editarProfissional(${p.id}, ${jsonSafe(p.nome)}, ${jsonSafe(p.especialidade)}, ${jsonSafe(p.telefone)})">Editar</button>
            <button onclick="excluirProfissional(${p.id})">Excluir</button>
          </td>
        </tr>`;
      });
    } catch (err) {
      alert("Erro ao carregar profissionais.");
      console.error(err);
    }
  }
  
  document.getElementById("formProfissional").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value.trim();
    const especialidade = document.getElementById("especialidade").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
  
    if (!nome || !especialidade) {
      alert("Preencha nome e especialidade.");
      return;
    }
  
    try {
      if (id) {
        await apiPut("/profissionais/" + id, { nome, especialidade, telefone });
        alert("Profissional atualizado.");
      } else {
        await apiPost("/profissionais", { nome, especialidade, telefone });
        alert("Profissional cadastrado.");
      }
      e.target.reset();
      carregarProfissionais();
    } catch (err) {
      alert("Erro ao salvar profissional.");
      console.error(err);
    }
  });
  
  function editarProfissional(id, nome, especialidade, telefone) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("especialidade").value = especialidade;
    document.getElementById("telefone").value = telefone || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  
  async function excluirProfissional(id) {
    if (!confirm("Deseja realmente excluir este profissional?")) return;
  
    try {
      await apiDelete("/profissionais/" + id);
      carregarProfissionais();
    } catch (err) {
      alert("Erro ao excluir profissional.");
      console.error(err);
    }
  }
  
  // Evita XSS
  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Permite enviar strings em chamadas inline
  function jsonSafe(value) {
    if (value === null || value === undefined) return "null";
    return JSON.stringify(String(value)).replace(/</g, "\\u003c");
  }
  
  carregarProfissionais();
  