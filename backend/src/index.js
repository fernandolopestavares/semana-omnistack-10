const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://lexiano:lexiano@cluster0-t43q3.mongodb.net/week10?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(cors()); // liberar acesso externo
app.use(express.json());
app.use(routes);

server.listen(3333);


// metodos HTTP: get, post, put, delete

// tipos de parametros :
// query params: req.query(filtros, ordenacao, paginacao)
// route params: req.params (identificar um recurso na alteracao ou remocao)
// body: request.body (dados para criacao ou alteracao de um registro)
// mongoDB: (nao relacional)