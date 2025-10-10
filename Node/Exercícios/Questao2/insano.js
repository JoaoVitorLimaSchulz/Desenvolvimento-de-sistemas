const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let produtos = [
    { id: 1, nome: 'Mouse Gamer', preco: 150, emEstoque: true, categoria: 'Periféricos' },
    { id: 2, nome: 'Teclado Mecânico', preco: 300, emEstoque: false, categoria: 'Periféricos' },
    { id: 3, nome: 'Monitor 24"', preco: 900, emEstoque: true, categoria: 'Monitores' },
];


app.get('/produtos/em-estoque', (req, res) => {
    const emEstoque = produtos.filter(p => p.emEstoque === true);
    res.json(emEstoque);
});


app.get('/produtos/pesquisar', (req, res) => {
    const nomeBusca = req.query.nome;
    if (!nomeBusca) return res.status(400).json({ erro: 'Parâmetro "nome" é obrigatório.' });

    const resultado = produtos.filter(p =>
    p.nome.toLowerCase().includes(nomeBusca.toLowerCase())
    );

    res.json(resultado);
});
app.patch('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { preco } = req.body;

    const produto = produtos.find(p => p.id === id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

    if (preco === undefined || typeof preco !== 'number')
    return res.status(400).json({ erro: 'O campo "preco" é obrigatório e deve ser numérico.' });

    produto.preco = preco;
    res.json(produto);
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const novoProduto = req.body;

    if (!novoProduto.categoria) {
    return res.status(400).json({
        erro: 'A categoria é obrigatória para a substituição do produto.',
    });
    }

    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado.' });

    novoProduto.id = id;
    produtos[index] = novoProduto;
    res.json(novoProduto);
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});