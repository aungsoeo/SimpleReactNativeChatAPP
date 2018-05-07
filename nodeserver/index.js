var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log(socket.id);
    socket.on('update',(data)=>{
        console.log(data);
        io.emit('update', data);
    });

    socket.on('client', (data)=>{
        console.log('updated from client');
        io.emit('client', data);
    });

    socket.on('online', (data)=>{
        console.log('online user'+data);
        io.emit('online', data);
    });
});
