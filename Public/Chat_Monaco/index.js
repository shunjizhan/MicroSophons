// this is the Server, cannot do things to individual html! Must emit to clients
// client call socket.emit => this server => this server calls io.emit => emit to all clients

var express = require('express');
var app = express();
//var app = require('express')();	// execute express() immediately
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var fs = require("fs");
var ini = false;
var users = [];

app.use(express.static(path.join(__dirname, '.'))); //app.use(express.static('js'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    var this_user_name = "ShaB" + Math.floor(Math.random() * 20);
    users.push(this_user_name);
    io.emit('update_user', users);
    console.log(users);


       socket.on('new-user', function(msg){
         // To-do: save new user info in data structure
         
         // sending to all clients except sender
         socket.broadcast.emit('new-user',msg);
         
         // sending existing user info and text copy to new user 
         //socket.broadcast.to(socketid).emit('reply-users', message);
         //socket.broadcast.to(socketid).emit('reply-content', message);
      });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('cursor',function(msg) {
        socket.broadcast.emit('cursor', msg);
    });  

    socket.on('user',function(new_name) {
        delete_user(this_user_name);
        this_user_name = new_name;
        users.push(this_user_name);
        io.emit('update_user', users);
    });

    socket.on('disconnect', function() {
        console.log('disconnected:' + this_user_name);
        delete_user(this_user_name);
        io.emit('update_user', users);
    });

});

function delete_user(name) {
    index = users.indexOf(name);
    if (index > -1) { users.splice(index, 1); }
}
















