// this is the Server, cannot do things to individual html! Must emit to clients
// client call socket.emit => this server => this server calls io.emit => emit to all clients

/* Evironment Variables!
run env_var.sh before using Azure Table
*/

var count = 0;

var express = require('express');
var app = express();
//var app = require('express')();	// execute express() immediately
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var fs = require("fs");

var azure = require("azure-storage");


var ini = false;
var userID = [];
var users = [];


var color = [];



app.use(express.static(path.join(__dirname, '.'))); //app.use(express.static('js'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

http.listen(8080, function(){
    console.log('listening on *:' + http.address().port);
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

    socket.on('rename', function(msg){
        socket.broadcast.emit('rename', msg);
    });

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


var tableSvc = azure.createTableService();
var entityGen = azure.TableUtilities.entityGenerator;


//real create structure
tableSvc.createTableIfNotExists('mytable', function(error,result,response){
  if(!error){
    console.log('table created!');
    // Table exists or created
  }
});


// createEntity
var myEntity = createEntity('aaaaaa','123456');

function createEntity(project_id, password){
    var entity = {
        PartitionKey: entityGen.String('A'),
        RowKey: entityGen.String(project_id),
        password: entityGen.String(password),
    };
    return entity;
}

// insert entity in the table
tableSvc.insertEntity('mytable',myEntity, function(error, result, response){
    if(!error){
        console.log('inserted');
    }
});





/*

//Azure Table Operations

var tableSvc = azure.createTableService();
var entityGen = azure.TableUtilities.entityGenerator;


//delete table
tableSvc.deleteTableIfExists('mytable', function(error){
  if(!error){
    console.log('table deleted!');
    // Table exists or created
  }
});



// Create Table
tableSvc.createTableIfNotExists('mytable', function(error, result, response){
  if(!error){
    console.log('table created!');
    // Table exists or created
  }
});

var default_content = [
    '"use strict";',
    'function Person(age) {',
    '   if (age) {',
    '       this.age = age;',
    '   }',
    '}',
    'Person.prototype.getAge = function () {',
    '   return this.age;',
    '};'
].join('\n');

// createEntity
var myEntity = createEntity('myproject','1','default.js', default_content);


// insert entity in the table
tableSvc.insertEntity('mytable',myEntity, function(error, result, reponse){
    if(!error){
        console.log('inserted');
    }
});

function createEntity(project_id, file_id, filename, file_content){
    var entity = {
        PartitionKey: entityGen.String(project_id),
        RowKey: entityGen.String(file_id),
        filename: entityGen.String(filename),
        fileContent: entityGen.String(file_content)
    };
    return entity;
}

// Retrieve Entity
tableSvc.retrieveEntity('mytable', 'myproject', '1', function(error, result, response){
  if(!error){
    // result contains the entity
    console.log(result);
  }
});

*/


