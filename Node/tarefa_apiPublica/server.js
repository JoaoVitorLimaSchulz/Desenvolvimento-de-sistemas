const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Base da API pública
const PUBLIC_API_BASE = 'https://jsonplaceholder.typicode.com';

// 🟢 Lista local de posts criados pelo usuário
let localPosts = [];

// ----------------------
// GET /api/posts
// ----------------------
app.get('/api/posts', async (req, res) => {
  try {
    const { userId, q, _page = 1, _limit = 10 } = req.query;

    // Busca os posts da API pública
    const response = await axios.get(`${PUBLIC_API_BASE}/posts`);
    let posts = response.data;

    // Junta com os posts locais
    posts = [...localPosts, ...posts];

    // Filtros
    if (userId) posts = posts.filter(p => String(p.userId) === String(userId));
    if (q) {
      const term = q.toLowerCase();
      posts = posts.filter(p =>
        (p.title + ' ' + p.body).toLowerCase().includes(term)
      );
    }

    // Paginação
    const page = Math.max(1, parseInt(_page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(_limit, 10) || 10));
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = posts.slice(start, end);

    res.json({ total: posts.length, page, limit, data: paged });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'Erro ao buscar posts da API pública' });
  }
});

// ----------------------
// GET /api/posts/:id
// ----------------------
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;

  // Primeiro tenta achar entre os locais
  const local = localPosts.find(p => String(p.id) === String(id));
  if (local) return res.json(local);

  // Senão, busca na API pública
  try {
    const response = await axios.get(`${PUBLIC_API_BASE}/posts/${id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404)
      return res.status(404).json({ error: 'Post não encontrado' });
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

// ----------------------
// POST /api/posts
// ----------------------
app.post('/api/posts', async (req, res) => {
  try {
    const { title, body, userId } = req.body;

    // Cria um post localmente com ID incremental
    const newId = localPosts.length
      ? localPosts[localPosts.length - 1].id + 1
      : 1001; // Começa após os 100 da API pública

    const newPost = { id: newId, title, body, userId };

    localPosts.unshift(newPost); // adiciona no início
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// ----------------------
// Estatísticas simples
// ----------------------
app.get('/api/stats/posts-by-user', async (req, res) => {
  try {
    const response = await axios.get(`${PUBLIC_API_BASE}/posts`);
    const posts = response.data;
    const all = [...localPosts, ...posts];

    const counts = {};
    all.forEach(p => {
      counts[p.userId] = (counts[p.userId] || 0) + 1;
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar estatísticas' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});