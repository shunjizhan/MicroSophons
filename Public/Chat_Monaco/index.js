var express = require('express');
var app = express();
//var app = require('express')();	// execute express() immediately
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

//app.use(express.static('js'));
app.use(express.static(path.join(__dirname, '.')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

//To do: user data structure

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('new-user', function(msg){
	// To-do: save new user info in data structure
	
	// sending to all clients except sender
	socket.broadcast.emit('new-user',msg);
	
	// sending existing user info and text copy to new user 
	//socket.broadcast.to(socketid).emit('reply-users', message);
	//socket.broadcast.to(socketid).emit('reply-content', message);
    });

    socket.on('chat message', function(msg){
	io.emit('chat message', msg);
    });

    socket.on('cursor',function(msg){
	socket.broadcast.emit('cursor',msg);
	
    });
    
    socket.on('nickname', function(msg){
	// store nickname

	socket.broadcast.emit('new-user',msg);
    });
    
    socket.on('disconnect', function(){
	//remove user info from data structure
	
	//io.emit('disconnect', msg);
	console.log('user disconnected');
    });
    socket.on('content-change', function(){
	// save change to server copy

	// sync to other users
	//socket.broadcast.emit('content-change',msg);
    });

    
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
app.get('/', function(req, res){
  res.sendfile('index.html');
});
*/


/* load the index.html */
/*
var fs = require("fs");
var http = require("http");
var url = require("url");

http.createServer(function (request, response) {

    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    response.writeHead(200);

    if(pathname == "/") {
        html = fs.readFileSync("index.html", "utf8");
        response.write(html);
    } else if (pathname == "/script.js") {
        script = fs.readFileSync("script.js", "utf8");
        response.write(script);
    }
    
    response.end();
}).listen(3000);

console.log("Listening to server on 8888...");
*/



