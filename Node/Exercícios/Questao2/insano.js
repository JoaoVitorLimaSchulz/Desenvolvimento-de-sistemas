const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let produtos = [
    { id: 1, nome: 'Bufalo',preco:1.50,emEstoque: false },
    { id: 2, nome: 'rato',preco:5.50,emEstoque: true },
    { id: 3, nome: 'ararinha-azul',preco:0.50,emEstoque: false },
    ];

app.get('/produtos', (req, res) => {
    res.json(produtos);
    });
//operação get por estoque
app.get('/produtos/:emEstoque', (req, res) => {
    const estoque = parseFloat(req.params.emEstoque);
    const produto = produto.find(p => p.estoque === estoque);
    if (produto == true) {
        res.json(produto);
    } else {
        res.status(404).send('não há produtos em estoque.');
    }
});
  //get por nome
    app.get('/produtos/:nome', (req, res) => {
    const nome = parseFloat(req.params.nome);
    const produto = produtos.find(p => p.nome === nome);
    if (!produto) {
        res.status(404).send('não há produtos em estoque.');  
    }
    res.json(produto);
    });
//operação criar
    app.post('/tarefas', (req, res) => {
    const novaTarefa = req.body;
    novaTarefa.id = tarefas.length + 1;
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
    });
//operção atualizar
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const novosDados = req.body;
    const index = tarefas.findIndex(u => u.id === id);
    
    if (index !== -1) {
        tarefas[index] = { ...tarefas[index], ...novosDados };
        res.json(tarefas[index]);
    } else {
        res.status(404).send('Tarefa não encontrada.');
    }
    });
  //operação delete
    app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(u => u.id === id);
    
    if (index !== -1) {
        tarefas.splice(index, 1);
      res.status(204).send(); // 204 No Content
    } else {
        res.status(404).send('Tarefa não encontrada.');
    }
    });

    app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});