var mysql = require('mysql');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
users = [];
connections =[];

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat_db"
  });
  
server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    connections.push(socket);
	console.log('Connected : %s sockets conected', connections.length);

    // con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Database connected!");
    //     //Select all customers and return the result object:
    //     con.query("SELECT * FROM  chatbox", function (err, result, fields) {
    //       if (err) throw err;
    //       console.log(result);
    //     });
      
    //     // var sql = "INSERT INTO chatbox (user_id,to_user,username, message) VALUES ('1','3','Admin','Hello User 3')";
    //     //   con.query(sql, function (err, result) {
    //     //       if (err) throw err;
    //     //       console.log("1 record inserted");
    //     //   });
    //   });
      
    // console.log(socket.id);
    socket.on('update',(data)=>{
        // var sent_msg = data.text;
        // var con = mysql.createConnection({
        //     host: "localhost",
        //     user: "root",
        //     password: "",
        //     database: "chat_db"
        //   });

        // con.connect(function(err) {
        //     if (err) throw err;     
        //     var sql = "INSERT INTO chatbox (user_id,to_user,username, message) VALUES ('1','2','Admin','sent_msg')";
        //       con.query(sql, function (err, result) {
        //           if (err) throw err;
        //           console.log("1 record inserted");
        //       });
        //   });   
        io.emit('update', data);
    });

    socket.on('client', (data)=>{
        console.log('updated from client');
        io.emit('client', data);
    });


    socket.on('new user', function(data, callback){
		callback(true);
		socket.username =data;
		users.push(socket.username);
		updateUsernames();
    });
    
    function updateUsernames(){

		io.sockets.emit('get users',users)
	}
    socket.on('online', (users)=>{
        console.log('online user'+users);
        io.emit('online', users);
    });
    
});
