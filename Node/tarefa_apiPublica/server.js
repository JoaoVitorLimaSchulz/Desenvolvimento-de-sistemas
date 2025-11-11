const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Base da API pública
const PUBLIC_API_BASE = 'https://jsonplaceholder.typicode.com';

// Endpoint principal: listar posts com filtragem, busca e paginação
app.get('/api/posts', async (req, res) => {
  try {
    const { userId, q, _page = 1, _limit = 10 } = req.query;

    // Buscar todos os posts
    const response = await axios.get(`${PUBLIC_API_BASE}/posts`);
    let posts = response.data;

    // Filtrar por userId (se informado)
    if (userId) {
      posts = posts.filter(p => String(p.userId) === String(userId));
    }

    // Filtro de busca no título e corpo
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

    res.set('X-Total-Count', String(posts.length));
    res.json({
      total: posts.length,
      page,
      limit,
      data: paged
    });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'Erro ao buscar posts da API pública' });
  }
});

// Endpoint: buscar post específico por ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${PUBLIC_API_BASE}/posts/${id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    console.error(err.message || err);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

// Endpoint extra: estatísticas de posts por usuário
app.get('/api/stats/posts-by-user', async (req, res) => {
  try {
    const response = await axios.get(`${PUBLIC_API_BASE}/posts`);
    const posts = response.data;

    const counts = {};
    posts.forEach(p => {
      counts[p.userId] = (counts[p.userId] || 0) + 1;
    });

    res.json(counts);
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'Erro ao gerar estatísticas' });
  }
});
// Criar novo post (simulação)
app.post('/api/posts', async (req, res) => {
    try {
      const novoPost = await axios.post('https://jsonplaceholder.typicode.com/posts', req.body);
      res.json(novoPost.data);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar post' });
    }
  });

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
