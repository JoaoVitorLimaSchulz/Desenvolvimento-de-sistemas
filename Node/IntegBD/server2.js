const express = require('express')
const app = express()
const port = 3000

const db = require('./db')
app.get('/', (req, res) => {res.send('Hello World!')})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//**EAD: Buscar todos as usuarios
app.get('/usuarios', async (req, res) => {
    try{
        const[rows] = await db.query('SELECT * FROM usuarios');
        res.json(rows);
    }catch(error){
        console.error('Erro ao buscar usuarios:',error);
        res.status(500).send('Erro interno do servidor ao buscar usuarios')
    }
})
    //*EAD: Buscar usuario por ID
app.get('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id); // Converte o ID da URL para número

    if (isNaN(id)) {
        return res.status(400).send('ID inválido. O ID deve ser um número.');
    }
    try {
      // Consulta a tarefa pelo ID. Passamos o ID como um array para o segundo argumento.
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (rows.length > 0) {
        res.json(rows[0]); // Retorna a primeira (e única) tarefa encontrada
    } else {
        res.status(404).send('usuario não encontrado.');
    }
    } catch (error) {
        console.error(`Erro ao buscar usuario com ID ${id}:`, error);
        res.status(500).send('Erro interno do servidor ao buscar usuario.');
    }
});
    //?CREATE: Criar Novo usuario
app.post('/usuarios', async (req, res) => {
    const { nome, idade } = req.body;
    
    // Validação básica de entrada
    if (!nome) {
        return res.status(400).send('O título da usuario é obrigatório.');
    }

    try {
      // Executa a consulta INSERT. O '?' preenche os valores da tarefa.
    const [result] = await db.query(
        'INSERT INTO tarefas (nome, idade) VALUES (?, ?, ?)',
        [nome, idade] 
    );

      // O 'result' contém informações sobre a inserção, incluindo o ID gerado
        const novoUsuario = { id: result.insertId, nome, idade};
        res.status(201).json(novoUsuario); // Retorna a tarefa criada com status 201 (Created)
    } catch (error) {
        console.error('Erro ao criar usuario:', error);
        res.status(500).send('Erro interno do servidor ao criar usuario.');
    }
});
//?UPDATE: Atualizar usuario Existente 
app.put('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, idade} = req.body;

    if (isNaN(id)) {
        return res.status(400).send('ID inválido. O ID deve ser um número.');
    }
    if (!nome && idade === undefined) {
        return res.status(400).send('Pelo menos um campo (nome, idade) deve ser fornecido para atualização.');
    }

    try {
      // Primeiro, verifique se a tarefa existe
      const[existingRows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (existingRows.length === 0) {
        return res.status(404).send('usuario não encontrada para atualização.');
    } 
      // Construa a consulta UPDATE dinamicamente para atualizar apenas os campos fornecidos
    let updates = [];
    let params = [];
    if (nome !== undefined) {
        updates.push('nome = ?');
        params.push(nome);
    }
    if (idade !== undefined) {
        updates.push('idade = ?');
        params.push(idade);
    }
      if (updates.length === 0) { // Nenhuma atualização válida foi fornecida
        return res.status(400).send('Nenhum campo válido para atualização fornecido.');
    }

        const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;
      params.push(id); // Adiciona o ID ao final dos parâmetros

    const [result] = await db.query(query, params);

        if (result.affectedRows > 0) {
            // Após a atualização, busque a tarefa novamente para retornar os dados mais recentes
            const [updatedRows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
            res.json(updatedRows[0]);
        } else {
            // Embora já tenhamos checado, esta linha é um fallback
            res.status(404).send('usuario não encontrada ou nenhum dado foi alterado.');
        }
    } catch (error) {
        console.error(`Erro ao atualizar usuario com ID ${id}:`, error);
        res.status(500).send('Erro interno do servidor ao atualizar usuario.');
    }
});
//!DELETE: Remover usuario
app.delete('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send('ID inválido. O ID deve ser um número.');
    }

    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      if (result.affectedRows > 0) { // affectedRows indica quantas linhas foram afetadas
        res.status(204).send(); // Retorna status 204 (No Content) - sucesso sem corpo de resposta
    } else {
        res.status(404).send('usuario não encontrada para exclusão.');
    }
    } catch (error) {
        console.error(`Erro ao excluir usuario com ID ${id}:`, error);
        res.status(500).send('Erro interno do servidor ao excluir usuario.');
    }
});