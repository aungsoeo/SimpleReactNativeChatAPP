var mysql = require('mysql');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
users = [];
connections =[];

server.listen(3000);
console.log('server running...');
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected : %s sockets conected', connections.length);
    
    socket.on('createConnection', () =>
    {
        socket.emit('connectionResponse',socket.id);
    });

    //Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket, 1));
        console.log(socket.username+'Disconnected');
        socket.disconnect(); // Disconnect the Socket
        console.log('Connected : %s sockets conected', connections.length);
    });

    socket.on('update',(data)=>{
        io.emit('update', data);
    });

    socket.on('client', (data)=>{
        console.log('updated from client');
        io.emit('client', data);
    });


    socket.on('online', function(data){
        // console.log(data);
        socket.userID = data.id;
        socket.username =data.username;
        users.push(data);
        // users.push(socket.username);
        console.log(users);
		updateUsernames();
    });
    
    function updateUsernames(){
		io.sockets.emit('get users',users)
	}
    
});
