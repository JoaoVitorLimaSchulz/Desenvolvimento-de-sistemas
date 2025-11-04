const express = require("express");
const app = express();
const port = 3000;
const db = require("./db");

app.use(express.json());

app.get("/tarefas", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tarefas");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).send("Erro interno do servidor ao buscar tarefas.");
  }
});

app.post("/tarefas", async (req, res) => {
  const { titulo, descricao, concluida } = req.body;
  if (!titulo) return res.status(400).send("O título da tarefa é obrigatório.");
  try {
    const [result] = await db.query(
      "INSERT INTO tarefas (titulo, descricao, concluida) VALUES (?, ?, ?)",
      [titulo, descricao || null, concluida || false]
    );
    res.status(201).json({ id: result.insertId, titulo, descricao, concluida });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).send("Erro interno do servidor ao criar tarefa.");
  }
});

app.put("/tarefas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, concluida } = req.body;
  if (isNaN(id)) return res.status(400).send("ID inválido.");
  try {
    const [existing] = await db.query("SELECT * FROM tarefas WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).send("Tarefa não encontrada.");
    let updates = [], params = [];
    if (titulo !== undefined) { updates.push("titulo=?"); params.push(titulo); }
    if (descricao !== undefined) { updates.push("descricao=?"); params.push(descricao); }
    if (concluida !== undefined) { updates.push("concluida=?"); params.push(concluida); }
    const [result] = await db.query(`UPDATE tarefas SET ${updates.join(", ")} WHERE id=?`, [...params, id]);
    if (result.affectedRows) {
      const [updated] = await db.query("SELECT * FROM tarefas WHERE id = ?", [id]);
      res.json(updated[0]);
    } else res.status(404).send("Tarefa não encontrada.");
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).send("Erro interno do servidor ao atualizar tarefa.");
  }
});

app.delete("/tarefas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("ID inválido.");
  try {
    const [result] = await db.query("DELETE FROM tarefas WHERE id = ?", [id]);
    if (result.affectedRows) res.sendStatus(204);
    else res.status(404).send("Tarefa não encontrada.");
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).send("Erro interno do servidor ao excluir tarefa.");
  }
});

app.get("/tarefas/status", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(CASE WHEN concluida = 1 THEN 1 END) AS concluidas,
        COUNT(CASE WHEN concluida = 0 THEN 1 END) AS pendentes
      FROM tarefas
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar status das tarefas:", err.message);
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/tarefas/pesquisar", async (req, res) => {
  const termo = req.query.q;
  if (!termo) return res.status(400).send("É necessário informar o parâmetro 'q'.");
  try {
    const [rows] = await db.query("SELECT * FROM tarefas WHERE titulo LIKE ?", [`%${termo}%`]);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao pesquisar tarefas:", err.message);
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/categorias/:id/tarefas", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    "SELECT t.* FROM tarefas t JOIN tarefa_categoria tc ON t.id = tc.tarefa_id WHERE tc.categoria_id = ?",
    [id]
  );
  res.json(rows);
});

app.get("/usuarios", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  res.json(rows);
});

app.post("/usuarios", async (req, res) => {
  const { nome, email } = req.body;
  const [result] = await db.query("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email]);
  res.status(201).json({ id: result.insertId, nome, email });
});

app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  await db.query("UPDATE usuarios SET nome=?, email=? WHERE id=?", [nome, email, id]);
  res.send("Usuário atualizado com sucesso!");
});

app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM usuarios WHERE id=?", [id]);
  res.sendStatus(204);
});

app.get("/dados_usuarios", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM dados_usuario");
  res.json(rows);
});

app.post("/dados_usuarios", async (req, res) => {
  const { biografia, url_foto, data_nascimento, telefone, id_usuarios } = req.body;
  const [result] = await db.query(
    "INSERT INTO dados_usuario (biografia, url_foto, data_nascimento, telefone, id_usuarios) VALUES (?, ?, ?, ?, ?)",
    [biografia, url_foto, data_nascimento, telefone, id_usuarios]
  );
  res.status(201).json({ id: result.insertId, biografia, url_foto, data_nascimento, telefone, id_usuarios });
});

app.put("/dados_usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { biografia, url_foto, data_nascimento, telefone } = req.body;
  await db.query(
    "UPDATE dados_usuario SET biografia=?, url_foto=?, data_nascimento=?, telefone=? WHERE id=?",
    [biografia, url_foto, data_nascimento, telefone, id]
  );
  res.send("Dados do usuário atualizados!");
});

app.delete("/dados_usuarios/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM dados_usuario WHERE id=?", [id]);
  res.sendStatus(204);
});

app.get("/categorias", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categorias");
  res.json(rows);
});

app.post("/categorias", async (req, res) => {
  const { nome } = req.body;
  const [result] = await db.query("INSERT INTO categorias (nome) VALUES (?)", [nome]);
  res.status(201).json({ id: result.insertId, nome });
});

app.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  await db.query("UPDATE categorias SET nome=? WHERE id=?", [nome, id]);
  res.send("Categoria atualizada!");
});

app.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM categorias WHERE id=?", [id]);
  res.sendStatus(204);
});

app.get("/tarefas/:id/categorias", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    "SELECT c.* FROM categorias c JOIN tarefa_categoria tc ON c.id = tc.categoria_id WHERE tc.tarefa_id = ?",
    [id]
  );
  res.json(rows);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
