// this is the Server, cannot do things to individual html! Must emit to clients
// client call socket.emit => this server => this server calls io.emit => emit to all clients
var count = 0;

var express = require('express');
var app = express();
//var app = require('express')();	// execute express() immediately
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var router = express.Router();

var fs = require("fs");
var ini = false;

/*
var userID = [];
var users = [];
//var address;

var color = [];
*/
var rooms = {};


//var globals = require('globals'); 
//var address = globals.domain;

//database connection
    // var Connection = require('tedious').Connection;  
    // var config = {  
    //     userName: 'ucsbadmin@microsophon',  
    //     password: 'Ucsb123456',  
    //     server:'microsophon.database.windows.net',  
    //     // If you are on Microsoft Azure, you need this:  
    //     options: {encrypt: true, database: 'microsophon'}  
    // }; 
    // var connection = new Connection(config);  
    // connection.on('connect', function(err) {  
    //     // If no error, then good to proceed.
    //     //if (err) return console.error(err);
    //     console.log("Connected"); 
    //     //executeStatement();  
    // });
    // var Request = require('tedious').Request;  
    // var TYPES = require('tedious').TYPES;  
  
    // function executeStatement() {  
    //     request = new Request("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {  
    //     if (err) {  
    //         console.log(err);}  
    //     });  
    //     var result = "";  
    //     request.on('row', function(columns) {  
    //         columns.forEach(function(column) {  
    //           if (column.value === null) {  
    //             console.log('NULL');  
    //           } else {  
    //             result+= column.value + " ";  
    //           }  
    //         });  
    //         console.log(result);  
    //         result ="";  
    //     });  
  
    //     request.on('done', function(rowCount, more) {  
    //     console.log(rowCount + ' rows returned');  
    //     });  
    //     connection.execSql(request);  
    // } 

app.use(express.static(path.join(__dirname, '.'))); //app.use(express.static('js'));

// app.get('/', function(req, res) {
//     res.sendfile('index.html');
// });

// app.get('*', function (req, res) {
//     res.render('index.html');
// });

app.get('/', function (req, res) {
    res.render('index.html');
});
app.get('/*', function (req, res) {
//    var name = req.params.name;
//    res.send(req.params.name);
    res.sendfile('indexx.html');
});

//router.get('/secret/:key', function (req, res) {  
//  var secret = req.params.key;
//  var user = {};
//  user.authorised = secret === secretKey ? true : false;
//  res.render('secret', user);
//});

// app.get('/p/:name', function (req, res) {
//     res.render('p/' + req.params.name);
// });

http.listen(8080, function(){
    console.log('listening on *:' + http.address().port);
});

// while(typeof address === "undefined"){  console.log('a')  }
//     app.get('/'+ address , function(req, res) {
//         res.sendfile('indexx.html');
//     });


io.on('connection', function(socket) {
    console.log('a user connected: ' + socket.id);
    count++;
    var current = count;
    var room = "";

    //set up user data structure
    var user_object = {
        id: socket.id,
        name: "User" + Math.floor(Math.random() * 99),
        color: "rgb("+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+")"
    };

    //add user to the room
    socket.on('add-user',function(msg){
        socket.join(msg);
        room = msg;
        if(rooms[msg]===undefined){
            rooms[msg] = [user_object];
        }
        else{
            rooms[msg].push(user_object);
        }

        console.log(rooms);
        io.in(room).emit('update_user', rooms[msg]);
        socket.broadcast.to(room).emit('new-user', socket.id); // create cursor

        socket.broadcast.to((rooms[room])[0].id).emit('request-content', socket.id);
    });

    //io.emit('current user',current);

    //users.push(this_user_name);
    //userID.push(socket.id);
    
    
    socket.on('reply-content', function(msg){
        io.in(msg.room).emit('reply-content', msg);
    });

    socket.on('chat message', function(msg) {
        io.in(msg.room).emit('chat message', msg.msg);
        //io.emit('chat message', msg);
    });

    socket.on('cursor',function(msg) {
        msg.username = user_object.name;
        msg.color = user_object.color;
        socket.broadcast.to(msg.room).emit('cursor', msg); //note userID array to store all IDs
    });

    socket.on('content', function(msg){
        socket.broadcast.to(msg.room).emit('content', msg);
    });

    socket.on('new-file', function(msg){
        socket.broadcast.to(msg.room).emit('new-file', msg);
    });

    socket.on('new-tab', function(msg){
        socket.broadcast.to(msg.room).emit('new-tab', msg);
    })

    socket.on('rename', function(msg){
        socket.broadcast.to(msg.room).emit('rename', msg);
    });

    socket.on('user-name',function(msg) {
        message = {old_name: user_object.name, new_name: msg.name}
        user_object.name = msg.name;
    	//rooms.(msg.room).splice(rooms.(msg.room).indexOf(), 1, msg.name);
        //this_user_name = msg.name;
        io.in(room).emit('user-name', message);
    });

    socket.on('disconnect', function() {
        console.log('disconnected:' + socket.id + ' ' + user_object.name);
        count--;
        //var current=count;
        //io.emit('current user',current);
        rooms[room].splice(rooms[room].indexOf(user_object), 1);
        io.emit('update_user', rooms[room]);
        socket.broadcast.to(room).emit('user-exit', socket.id);
        /*
        users.splice(users.indexOf(this_user_name), 1);
	    color.splice(userID.indexOf(socket.id),1);
        userID.splice(userID.indexOf(socket.id), 1);
        */
        socket.leave(room);
    });
});

/*
function delete_user(name) {
    index = users.indexOf(name);
    if (index > -1) { users.splice(index, 1); }
}
*/
