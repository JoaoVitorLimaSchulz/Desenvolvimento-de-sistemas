const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let tarefas = [
    { id: 1, nome: 'Lavar a roupa', concluida: false },
    { id: 2, nome: 'Dar comida pro rato', concluida: false }
];
let nextId =3;
//operação get all
app.get('/tarefas', (req, res) => {
    res.json(tarefas);
    });
//operação get por id
app.get('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefas = tarefas.find(t => t.id === id);
    if (tarefas) {
        res.json(tarefas);
    } else {
        res.status(404).send('Tarefa não encontrada.');
    }
    });
//operação criar
    app.post('/tarefas', (req, res) => {
    //pega o atributo do objeto recebido
    //coloca em uma variavel de mesmo nome
    let {titulo, concluida} = req.body;
    let tarefa = {id: nextId, titulo: titulo, concluida: false}
    nextId++;
    
    tarefas.push(tarefa);
    res.status(201).send(tarefa);
    });
//operção atualizar
app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const novosDados = req.body;
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index !== -1) {
        tarefas[index] = { ...tarefas[index], ...novosDados };
        res.json(tarefas[index]);
        res.status(204).send();
        } else {
            res.status(404).send('Tarefa não encontrada.');
        }
    });
  //operação delete
    app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index !== -1) {
        tarefas.splice(index, 1);
        res.status(204).send(); // 204 No Content
        } else {
            return res.status(404).send('Tarefa não encontrada.');
        }
    });

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });