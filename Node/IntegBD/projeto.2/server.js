require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

function handleError(res, err, msg = 'Erro interno') {
  console.error(err);
  return res.status(500).json({ error: msg });
}


app.get('/cliente', async (req, res) => {
  const q = req.query.q || '';
  try {
    const [rows] = await pool.query('SELECT * FROM cliente WHERE nome LIKE ? ORDER BY nome', [`%${q}%`]);
    res.json(rows);
  } catch (err) { handleError(res, err, 'Erro ao listar cliente.'); }
});

app.get('/cliente/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cliente WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado.' });
    res.json(rows[0]);
  } catch (err) { handleError(res, err); }
});

app.post('/cliente', async (req, res) => {
  const { nome, telefone, email } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    const [result] = await pool.query('INSERT INTO cliente (nome, telefone, email, endereco) VALUES (?, ?, ?, ?)', [nome, telefone || null, email || null, endereco || null]);
    const [row] = await pool.query('SELECT * FROM cliente WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao criar cliente.'); }
});

app.put('/cliente/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, telefone, email, endereco } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    await pool.query('UPDATE cliente SET nome=?, telefone=?, email=?, endereco=? WHERE id=?', [nome, telefone || null, email || null, endereco || null, id]);
    const [row] = await pool.query('SELECT * FROM cliente WHERE id = ?', [id]);
    res.json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao atualizar cliente.'); }
});

app.delete('/cliente/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cliente WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { handleError(res, err, 'Erro ao excluir cliente.'); }
});


app.get('/servicos', async (req, res) => {
  const q = req.query.q || '';
  try {
    const [rows] = await pool.query('SELECT * FROM servicos WHERE nome LIKE ? ORDER BY nome', [`%${q}%`]);
    res.json(rows);
  } catch (err) { handleError(res, err, 'Erro ao listar serviços.'); }
});

app.get('/servicos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM servicos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Serviço não encontrado.' });
    res.json(rows[0]);
  } catch (err) { handleError(res, err); }
});

app.post('/servicos', async (req, res) => {
  const { nome, descricao, duracao_prevista_min, preco } = req.body;
  if (!nome || !duracao_prevista_min) return res.status(400).json({ error: 'Nome e duração são obrigatórios.' });
  try {
    const [result] = await pool.query('INSERT INTO servicos (nome, descricao, duracao_prevista_min, preco) VALUES (?, ?, ?, ?)', [nome, descricao || null, duracao_prevista_min, preco || null]);
    const [row] = await pool.query('SELECT * FROM servicos WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao criar serviço.'); }
});

app.put('/servicos/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, descricao, duracao_prevista_min, preco } = req.body;
  if (!nome || !duracao_prevista_min) return res.status(400).json({ error: 'Nome e duração são obrigatórios.' });
  try {
    await pool.query('UPDATE servicos SET nome=?, descricao=?, duracao_prevista_min=?, preco=? WHERE id=?', [nome, descricao || null, duracao_prevista_min, preco || null, id]);
    const [row] = await pool.query('SELECT * FROM servicos WHERE id = ?', [id]);
    res.json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao atualizar serviço.'); }
});

app.delete('/servicos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM servicos WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { handleError(res, err, 'Erro ao excluir serviço.'); }
});


app.get('/profissional', async (req, res) => {
  const q = req.query.q || '';
  try {
    const [rows] = await pool.query('SELECT * FROM profissional WHERE nome LIKE ? ORDER BY nome', [`%${q}%`]);
    res.json(rows);
  } catch (err) { handleError(res, err, 'Erro ao listar profissional.'); }
});

app.get('/profissional/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profissional WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Profissional não encontrado.' });
    res.json(rows[0]);
  } catch (err) { handleError(res, err); }
});

app.post('/profissional', async (req, res) => {
  const { nome, especialidade, telefone, status } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    const [result] = await pool.query('INSERT INTO profissional (nome, especialidade, telefone, status) VALUES (?, ?, ?, ?)', [nome, especialidade || null, telefone || null, status || 'ativo']);
    const [row] = await pool.query('SELECT * FROM profissional WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao criar profissional.'); }
});

app.put('/profissional/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, especialidade, telefone, status } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    await pool.query('UPDATE profissional SET nome=?, especialidade=?, telefone=?, status=? WHERE id=?', [nome, especialidade || null, telefone || null, status || 'ativo', id]);
    const [row] = await pool.query('SELECT * FROM profissional WHERE id = ?', [id]);
    res.json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao atualizar profissional.'); }
});

app.delete('/profissional/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM profissional WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { handleError(res, err, 'Erro ao excluir profissional.'); }
});

function intervalsOverlap(startA, endA, startB, endB) {
  return (startA < endB) && (startB < endA);
}

app.post('/agendamentos', async (req, res) => {
  const { cliente_id, servico_id, profissional_id, data, hora_inicio, duracao_min, observacoes } = req.body;
  if (!cliente_id || !servico_id || !profissional_id || !data || !hora_inicio || !duracao_min) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }
  try {
    // construir instantes usando Date (UTC local parsing safe format)
    const inicio = new Date(`${data}T${hora_inicio}`);
    const fim = new Date(inicio.getTime() + duracao_min * 60000);

    // buscar agendamentos do mesmo profissional na mesma data e não cancelados
    const [rows] = await pool.query(
      `SELECT id, hora_inicio, duracao_min FROM agendamentos WHERE profissional_id = ? AND data = ? AND status <> 'cancelado'`,
      [profissional_id, data]
    );

    const conflict = rows.some(r => {
      const rInicio = new Date(`${data}T${r.hora_inicio}`);
      const rFim = new Date(rInicio.getTime() + r.duracao_min * 60000);
      return intervalsOverlap(inicio, fim, rInicio, rFim);
    });

    if (conflict) return res.status(409).json({ error: 'Conflito: profissional já possui agendamento neste horário.' });

    const [result] = await pool.query(
      `INSERT INTO agendamentos (cliente_id, servico_id, profissional_id, data, hora_inicio, duracao_min, status, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, 'agendado', ?)`,
      [cliente_id, servico_id, profissional_id, data, hora_inicio, duracao_min, observacoes || null]
    );

    const [newRow] = await pool.query(
      `SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome, p.nome as profissional_nome
       FROM agendamentos a
       JOIN cliente c ON c.id = a.cliente_id
       JOIN servicos s ON s.id = a.servico_id
       JOIN profissional p ON p.id = a.profissional_id
       WHERE a.id = ?`, [result.insertId]);

    res.status(201).json(newRow[0]);
  } catch (err) { handleError(res, err, 'Erro ao criar agendamento.'); }
});

app.get('/agendamentos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome, p.nome as profissional_nome
       FROM agendamentos a
       JOIN cliente c ON c.id = a.cliente_id
       JOIN servicos s ON s.id = a.servico_id
       JOIN profissional p ON p.id = a.profissional_id
       ORDER BY a.data, a.hora_inicio`
    );
    res.json(rows);
  } catch (err) { handleError(res, err, 'Erro ao listar agendamentos.'); }
});

app.get('/agendamentos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome, p.nome as profissional_nome
       FROM agendamentos a
       JOIN cliente c ON c.id = a.cliente_id
       JOIN servicos s ON s.id = a.servico_id
       JOIN profissional p ON p.id = a.profissional_id
       WHERE a.id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Agendamento não encontrado.' });
    res.json(rows[0]);
  } catch (err) { handleError(res, err); }
});

app.patch('/agendamentos/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!['agendado','concluido','cancelado'].includes(status)) return res.status(400).json({ error: 'Status inválido.' });
  try {
    await pool.query('UPDATE agendamentos SET status = ? WHERE id = ?', [status, id]);
    const [row] = await pool.query('SELECT * FROM agendamentos WHERE id = ?', [id]);
    res.json(row[0]);
  } catch (err) { handleError(res, err, 'Erro ao atualizar status.'); }
});

app.delete('/agendamentos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { handleError(res, err, 'Erro ao excluir agendamento.'); }
});

app.listen(port, () => console.log(`API me_organiza rodando na porta ${port}`));
