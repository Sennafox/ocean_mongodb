const express  = require('express')
const bodyParser  = require('body-parser')
const app = express()

const URL = 3000;

app.use(bodyParser.json())

app.get('/hello', (req, res) => {
    res.send('Hello World')
})

/*
    Lista de Endpoints da aplicação CRUD de mensagens
    CRUD: Create, Read (Single & All), Update and Delete
    - [GET] /mensagens - Retorna lista de mensagens
    - [GET] /mensagens/id - Retorna apenas uma única mensagem pelo id
    - [POST] /mensagens - Cria uma nova mensagem
    - [PUT] /mensagens - Atualiza uma mensagem pelo id
    - [DELETE] /mensagens - Remove uma mensagem pelo id
*/

const mensagens = [
    {
        "id" : 1,
        "texto" : "Primeira mensagem"
    },
    {
        "id" : 2,
        "texto" : "Segunda mensagem"
    }
];

//- [GET] /mensagens - Retorna lista de mensagens

const getMensagensValidas = () => mensagens.filter(Boolean);

const getMensagensById = id => mensagens.find(mgs => mgs.id === id);


app.get('/mensagens', (req, res) =>{
    res.send(getMensagensValidas());
})

//- [GET] /mensagens/id - Retorna apenas uma única mensagem pelo id
app.get('/mensagens/:id', (req, res) =>{
    const id = +req.params.id;

    const mensagem = getMensagensById(id);
    
    if (!mensagem) {
    
        res.send('Mensagem não encontrada!');
    
        return;
    }

    res.send(mensagem);
})

//- [POST] /mensagens - Cria uma nova mensagem
app.post('/mensagens', (req, res) => {
    const mensagem = req.body;

    if(!mensagem || !mensagem.texto){
        res.send('Mensagem inválida!');

        return;
    }

    mensagem.id = mensagens.length + 1;
    mensagens.push(mensagem);

    res.send(mensagem);
})

app.put('/mensagens/:id', (req, res) =>{
    const id = +req.params.id;

    const mensagem = getMensagensById(id);
    
    const novoTexto = req.body.texto;

    if(!novoTexto){
        res.send('Mensagem inválida');

        return;
    }

    mensagem.texto = novoTexto;

    res.send(mensagem)
})

app.delete('/mensagens/:id', (req, res) =>{

    const id = +req.params.id;

    const mensagem = getMensagensById(id);

    const index = mensagens.indexOf(mensagem);

    delete mensagens[index];

    res.send(`Mensagem ${id} removida com sucesso!`);

})

app.listen(URL , () => {
    console.info(`App rodando na porta:${URL}`)
})



