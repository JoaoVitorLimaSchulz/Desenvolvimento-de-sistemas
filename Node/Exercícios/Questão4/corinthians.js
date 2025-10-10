
const express = require('express');
const app = express();
const port = 3000;

let comentarios = [
    { id: 1, post_id: 1, texto: 'Ótimo post!' },
    { id: 2, post_id: 1, texto: 'Muito informativo.' },
    { id: 3, post_id: 2, texto: 'Concordo totalmente!' },
    ];
    
    let nextComentarioId = 4;
    
    app.get('/posts/:id/comentarios', (req, res) => {
    const postId = parseInt(req.params.id);
    const resultado = comentarios.filter(c => c.post_id === postId);
    res.json(resultado);
    });
    
    app.post('/posts/:id/comentarios', (req, res) => {
    const postId = parseInt(req.params.id);
    const { texto } = req.body;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ erro: 'Post não encontrado.' });
    
    if (!texto) return res.status(400).json({ erro: 'O campo "texto" é obrigatório.' });
    
    const novoComentario = { id: nextComentarioId++, post_id: postId, texto };
    comentarios.push(novoComentario);
    res.status(201).json(novoComentario);
    });
    
    app.delete('/comentarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = comentarios.findIndex(c => c.id === id);
    
    if (index === -1) return res.status(404).json({ erro: 'Comentário não encontrado.' });
    
    const removido = comentarios.splice(index, 1);
    res.json({ mensagem: 'Comentário removido com sucesso.', comentario: removido[0] });
    });
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });