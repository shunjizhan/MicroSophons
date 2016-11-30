// this is the Server, cannot do things to individual html! Must emit to clients
// client call socket.emit => this server => this server calls io.emit => emit to all clients
var count = 0;

var express = require('express');
var app = express();
//var app = require('express')();	// execute express() immediately
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var fs = require("fs");
var ini = false;
var userID = [];
var users = [];


var color = [];

//database connection
    var Connection = require('tedious').Connection;  
    var config = {  
        userName: 'ucsbadmin@microsophon',  
        password: 'Ucsb123456',  
        server:'microsophon.database.windows.net',  
        // If you are on Microsoft Azure, you need this:  
        options: {encrypt: true, database: 'microsophon'}  
    }; 
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.
        //if (err) return console.error(err);
        console.log("Connected"); 
        //executeStatement();  
    });
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

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('a user connected: ' + socket.id);
    count++;
    var current = count;
    io.emit('current user',current);

    var this_user_name = "User" + Math.floor(Math.random() * 99);
    users.push(this_user_name);
    userID.push(socket.id);

    
    color.push("rgb("+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+")");
//random color generation
    

    io.emit('update_user', users);
    console.log(users);

    socket.broadcast.emit('new-user', socket.id);      

    socket.broadcast.to(userID[0]).emit('request-content', socket.id);

    socket.on('reply-content', function(msg){
        io.emit('reply-content', msg);
    });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('cursor',function(msg) {
        msg.username = this_user_name;
        msg.color = color[userID.indexOf(socket.id)]
        socket.broadcast.emit('cursor', msg); //note userID array to store all IDs
    });

    socket.on('content', function(msg){
        socket.broadcast.emit('content', msg);
    });

    socket.on('new-file', function(msg){
        socket.broadcast.emit('new-file', msg);
    });

    socket.on('new-tab', function(msg){
        socket.broadcast.emit('new-tab', msg);
    })

    socket.on('user-name',function(new_name) {
    	users.splice(users.indexOf(this_user_name), 1, new_name);
        this_user_name = new_name;
        io.emit('update_user', users);
    });

    socket.on('disconnect', function() {
        console.log('disconnected:' + socket.id + ' ' + this_user_name);
        count--;
        var current=count;
        io.emit('current user',current);
        io.emit('update_user', users);
        socket.broadcast.emit('user-exit', socket.id);
        users.splice(users.indexOf(this_user_name), 1);
	    color.splice(userID.indexOf(socket.id),1);
        userID.splice(userID.indexOf(socket.id), 1);
    });
});

function delete_user(name) {
    index = users.indexOf(name);
    if (index > -1) { users.splice(index, 1); }
}
