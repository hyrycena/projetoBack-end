const express = require('express');
server.use(express.json());
const server = express();

const user = require('./routes/user');
server.use(user.router);

const receita = require('./routes/receita');
server.use(receita.router);

const health = require('./routes/health');
server.use(health.router);

const logger = require('./middleware/logger');
server.use(logger);

module.exports = { server };