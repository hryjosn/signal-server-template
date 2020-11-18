const app = require('express')();
const http = require('http');
const server = http.createServer(app);
require("dotenv").config();
const serverPort = process.env.PORT || 80;

let io = require('socket.io')(http);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
const ioUtil = require("./src/ioCallback")(io);

io.on("connection", socket => {
    ioUtil.ioCallback(socket);
});
server.listen(serverPort, () => {
    console.log(`🚀 Server listening on port ${serverPort}`)});
