const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    });

let tarefas = [
    { id: 1, nome: 'Lavar a roupa' },
    { id: 2, nome: 'Dar comida pro rato' }
];

app.get('/tarefas', (req, res) => {
    res.json(tarefas);
    });
//operação get
app.get('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefas = tarefas.find(u => u.id === id);
    if (tarefas) {
        res.json(tarefas);
    } else {
        res.status(404).send('Usuário não encontrado.');
    }
    });
//operação criar
    app.post('/tarefas', (req, res) => {
    const novaTarefa = req.body;
    novaTarefa.id = tarefas.length + 1;
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
    });
//operção atualizar
app.put('/tarefas/:id', (req, res) => {
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

    