const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
let posts = [
    { id: 1, titulo: 'Primeiro Post', conteudo: 'Conteúdo inicial', autor: 'João' },
    { id: 2, titulo: 'Node.js é incrível', conteudo: 'Express é fácil!', autor: 'Maria' },
    ];
    
    let nextPostId = 3;
    

    app.post('/posts', (req, res) => {
    const { titulo, conteudo, autor } = req.body;
        
    if (!titulo || !conteudo || !autor) {
        return res.status(400).json({ erro: 'Campos "titulo", "conteudo" e "autor" são obrigatórios.' });
    }

    const novoPost = { id: nextPostId++, titulo, conteudo, autor };
    posts.push(novoPost);
    res.status(201).json(novoPost);
    });
    

    app.get('/posts/autor/:autor', (req, res) => {
    const autorParam = req.params.autor.toLowerCase();
    const resultado = posts.filter(p => p.autor.toLowerCase() === autorParam);
    res.json(resultado);
    });
    

    app.patch('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { conteudo } = req.body;
    
    const post = posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ erro: 'Post não encontrado.' });
    
    if (!conteudo) return res.status(400).json({ erro: 'O campo "conteudo" é obrigatório.' });
    
    post.conteudo = conteudo;
    res.json(post);
    });
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });