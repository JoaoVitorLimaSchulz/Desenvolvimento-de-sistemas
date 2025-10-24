const express = require("express");
const app = express();
const port = 3000;

const db = require("./db"); // Importa o pool de conexões que configuramos

app.use(express.json()); // Habilita o Express a ler JSON no corpo da requisição

// ... (Suas rotas virão aqui) ...

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get("/tarefas", async (req, res) => {
  try {
    // Executa a consulta SQL para selecionar todas as tarefas
    // pool.query retorna um array, onde o primeiro elemento [0] são as linhas (rows)
    const [rows] = await db.query("SELECT * FROM tarefas");
    res.json(rows); // Envia os resultados como JSON
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).send("Erro interno do servidor ao buscar tarefas.");
  }
});
app.post("/tarefas", async (req, res) => {
  const { titulo, descricao, concluida } = req.body;

  // Validação básica de entrada
  if (!titulo) {
    return res.status(400).send("O título da tarefa é obrigatório.");
  }

  try {
    // Executa a consulta INSERT. O '?' preenche os valores da tarefa.
    const [result] = await db.query(
      "INSERT INTO tarefas (titulo, descricao, concluida) VALUES (?, ?, ?)",
      [titulo, descricao || null, concluida || false] // Usamos null para descrição se não for fornecida, e false para concluida
    );
    // O 'result' contém informações sobre a inserção, incluindo o ID gerado
    const novaTarefa = { id: result.insertId, titulo, descricao, concluida };
    res.status(201).json(novaTarefa); // Retorna a tarefa criada com status 201 (Created)
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).send("Erro interno do servidor ao criar tarefa.");
  }
});
app.put("/tarefas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, concluida } = req.body;

  if (isNaN(id)) {
    return res.status(400).send("ID inválido. O ID deve ser um número.");
  }
  if (!titulo && descricao === undefined && concluida === undefined) {
    return res
      .status(400)
      .send(
        "Pelo menos um campo (titulo, descricao, ou concluida) deve ser fornecido para atualização."
      );
  }

  try {
    // Primeiro, verifique se a tarefa existe
    const [existingRows] = await db.query(
      "SELECT * FROM tarefas WHERE id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).send("Tarefa não encontrada para atualização.");
    }

    // Construa a consulta UPDATE dinamicamente para atualizar apenas os campos fornecidos
    let updates = [];
    let params = [];
    if (titulo !== undefined) {
      updates.push("titulo = ?");
      params.push(titulo);
    }
    if (descricao !== undefined) {
      updates.push("descricao = ?");
      params.push(descricao);
    }
    if (concluida !== undefined) {
      updates.push("concluida = ?");
      params.push(concluida);
    }

    if (updates.length === 0) {
      // Nenhuma atualização válida foi fornecida
      return res
        .status(400)
        .send("Nenhum campo válido para atualização fornecido.");
    }

    const query = `UPDATE tarefas SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id); // Adiciona o ID ao final dos parâmetros

    const [result] = await db.query(query, params);

    if (result.affectedRows > 0) {
      // Após a atualização, busque a tarefa novamente para retornar os dados mais recentes
      const [updatedRows] = await db.query(
        "SELECT * FROM tarefas WHERE id = ?",
        [id]
      );
      res.json(updatedRows[0]);
    } else {
      // Embora já tenhamos checado, esta linha é um fallback
      res
        .status(404)
        .send("Tarefa não encontrada ou nenhum dado foi alterado.");
    }
  } catch (error) {
    console.error(`Erro ao atualizar tarefa com ID ${id}:`, error);
    res.status(500).send("Erro interno do servidor ao atualizar tarefa.");
  }
});
app.delete("/tarefas/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send("ID inválido. O ID deve ser um número.");
  }

  try {
    const [result] = await db.query("DELETE FROM tarefas WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      // affectedRows indica quantas linhas foram afetadas
      res.status(204).send(); // Retorna status 204 (No Content) - sucesso sem corpo de resposta
    } else {
      res.status(404).send("Tarefa não encontrada para exclusão.");
    }
  } catch (error) {
    console.error(`Erro ao excluir tarefa com ID ${id}:`, error);
    res.status(500).send("Erro interno do servidor ao excluir tarefa.");
  }
});
