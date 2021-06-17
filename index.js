const http=require('http');
const app=require('./app');
const config = require('config');

const port=3000||process.env.PORT;
//process.env.PORT

const server=http.createServer(app);

server.listen(port);