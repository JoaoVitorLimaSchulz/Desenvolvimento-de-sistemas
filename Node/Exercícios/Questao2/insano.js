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
        res.status(404).send('não há produtos com esse nome.');  
    }
    res.json(produto);
    });
//operação adicionar/validar
app.post('/produtos', (req, res) => {
    //pega o atributo do objeto recebido
    //coloca em uma variavel de mesmo nome
    let {nome, preco, emEstoque} = req.body;
    let produtos = {id: nextId, nome: nome, preco: preco, emEstoque: emEstoque}
    nextId++;
    
    produtos.push(produtos);
    res.status(201).send(produtos);
});
//operção atualizar
app.patch('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const novosDados = req.body;
    const index = produtos.findIndex(u => u.id === id);
    
    if (index !== -1) {
        produtos[index] = { ...produtos[index], ...novosDados };
        res.json(tarefas[index]);
    } else {
        res.status(404).send('produto não encontrado.');
    }
    });
    app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});