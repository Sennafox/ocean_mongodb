const express  = require('express');
const bodyParser  = require('body-parser');
const mongodb= require('mongodb');
const ObjectId = mongodb.ObjectId;
(async () => {

const connectingString = 'mongodb://localhost:27017/OceanDB';

console.info('conectando  ao OceanDB');

const options ={
    useUnifiedTopology: true
};

const cliente = await mongodb.MongoClient.connect(connectingString, options);

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


// Pegando os dados do banco de dados conectado

const db = cliente.db('OceanDB');
const mensagens = db.collection('mensagens');

//- [GET] /mensagens - Retorna lista de mensagens
const getMensagensValidas = async () => await mensagens.find({}).toArray();

const getMensagensById = id => mensagens.find(mgs => mgs.id === id);


app.get('/mensagens', async (req, res) =>{
    res.send(await getMensagensValidas());
})

//- [GET] /mensagens/id - Retorna apenas uma única mensagem pelo id
app.get('/mensagens/:id', (req, res) =>{
    const id = req.params.id;

    const mensagem = await getMensagensById(id);
    
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

app.put('/mensagens/:id', async (req, res) =>{
    const id = req.params.id;

    const novaMensagem = req.body;

    if(!novaMensagem ||
        !novaMensagem.texto||
        !novaMensagem.usuario){
        res.send('Mensagem inválida');

        return;
    }

    const qtde_mensagem = await mensagens.countDocuments({ _id: ObjectId(id) });
    
    if (qtde_mensagem !== 1){
        res.send('mensagem não encontrada');
        
        return;
    }

    const { result } = await mensagens.updateOne(
        {
            _id: ObjectId(id)
        },
        {
            $set: novaMensagem
        }
    );

        console.log(result);
        console.log(result.nModified);

        if(result.nModified !== 1){
            res.send('Ocorreu um erro ao atualizar a mensagem!');

            return;
        };

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
})();


