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

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    // console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('cursor',function(msg){
	   io.emit('cursor',msg);
  });

  socket.on('user',function(data){
     io.emit('user', data);
  });
    
  socket.on('disconnect', function(){
    console.log('user disconnected');
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



