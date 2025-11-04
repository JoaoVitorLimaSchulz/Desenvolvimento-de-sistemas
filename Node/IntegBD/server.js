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

app.get("/tarefas/status", async (req, res) =>{
  try{
    const[rows] = await db.query(`
      select 
        count(case when concluida =1 then 1 end) as concluidas,
        count(case when concluida =0 then 1 end) as pendentes
      from tarefas
    `)
    const{ concluidas, pendentes} = rows[0];
    return res.send({concluidas, pendentes});
  }catch(err) {
    console.error("erro ao buscar status das tarefas", err.mensage);
    return res.status(500).send("erro interno do servidor")
  }
});

app.get("/tarefas/pesquisar", async (req,res) =>{
  const termo = req.query.q;

  if(!termo){
    return res
      .status(400)
      .send("è necessario informar o parametro 'q' para busca");
  }
  try{
    const[rows] = await db.query(
      "SELECT* FROM tarefas WHERE titulo LIKE ?",
      [`%${termo}%`]
    )
    return res.send(rows);
  } catch (err){
    console.error(" erro ao pesquisar tarefas:", err.mensage);
    return res.status(500).send("erro interno do servidor")
  }
})
app.get("/categorias/:id/tarefas", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    `SELECT t.* FROM tarefas t JOIN tarefa_categoria tc ON t.id = tc.tarefa_id WHERE tc.categoria_id = ?`,
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
  await db.query("UPDATE usuarios SET nome=?, email=? WHERE idUsuario=?", [nome, email, id]);
  res.send("Usuário atualizado com sucesso!");
});

app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM usuarios WHERE idUsuario=?", [id]);
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
    `SELECT c.* FROM categorias c JOIN tarefa_categoria tc ON c.id = tc.categoria_id WHERE tc.tarefa_id = ?`,
    [id]
  );
  res.json(rows);
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});