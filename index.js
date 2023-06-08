const { server } = require('./server');

const port = 3000;
 server.listen(port, () => {
   console.log(`Deu bom?! rodando na porta:${port}`);
});