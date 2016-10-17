var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var x = 0;
var express = require('express');
app.use(express.static('.'))
app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  x++;
  console.log((x).toString()+'th user connected');
  socket.on('disconnect', function(){
    console.log((x).toString()+'th user disconnected');
    x--;
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

