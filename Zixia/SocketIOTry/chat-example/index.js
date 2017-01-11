//zixia
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var x = 0;
var express = require('express');
var path = require('path');
var userID = [];
var users = [];
var color = [];
////database connection copied from bo's branch
//    var Connection = require('tedious').Connection;
//    var config = {
//        userName: 'ucsbadmin@microsophon',
//        password: 'Ucsb123456',
//        server:'microsophon.database.windows.net',
//        // If you are on Microsoft Azure, you need this:
//        options: {encrypt: true, database: 'microsophon'}
//    };
//    var connection = new Connection(config);
//    connection.on('connect', function(err) {
//        // If no error, then good to proceed.
//        //if (err) return console.error(err);
//        console.log("Connected");
//        //executeStatement();
//    });

app.use(express.static('.'));
app.get('/', function(req, res){
  res.sendfile('index_.html');
});

io.on('connection', function(socket){
    x++;
    var current = x;
    io.emit('current user',current);

    var this_user_name = "ShaB" + Math.floor(Math.random() * 20);
    users.push(this_user_name);
    userID.push(socket.id);


    color.push("rgb("+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+")");

    console.log((x).toString()+'th user connected');

    io.emit('update_user', users);
    console.log(users);

    socket.broadcast.emit('new-user', socket.id);

    socket.broadcast.to(userID[0]).emit('request-content', socket.id);

    socket.on('disconnect', function(){

    console.log('disconnected:' + socket.id + ' ' + this_user_name);
        x--;
        var current=x;
        io.emit('current user',current);
        io.emit('update_user', users);
        socket.broadcast.emit('user-exit', socket.id);
        users.splice(users.indexOf(this_user_name), 1);

	    color.splice(userID.indexOf(socket.id),1);

        userID.splice(userID.indexOf(socket.id), 1);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('cursor',function(msg){
    msg.username = this_user_name;
    msg.color = color[userID.indexOf(socket.id)]

    socket.broadcast.emit('cursor',msg);
    });

  socket.on('content', function(msg, e){
    socket.broadcast.emit('content', msg, e);
  });

  socket.on('content-delete', function(msg){
   socket.broadcast.emit('content-delete', msg);
  });

  socket.on('reply-content', function(msg){
        io.emit('reply-content', msg);
  });

  socket.on('new-file', function(msg){
        socket.broadcast.emit('new-file', msg);
  });


  //user processing
  socket.on('user-name',function(new_name) {
    	users.splice(users.indexOf(this_user_name), 1, new_name);
        this_user_name = new_name;
        io.emit('update_user', users);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
