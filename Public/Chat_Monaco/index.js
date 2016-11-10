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
var u = [];

app.use(express.static(path.join(__dirname, '.'))); //app.use(express.static('js'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    if (ini == false) { 
        ini_json();     // initialize JSON
        ini = true;
        console.log('initialized JSON!')
    } 

    var this_user_name = "ShaB" + Math.floor(Math.random() * 20);
    write(this_user_name);  // write this user to JSON
    update_users();  // emit events for clients to update users
  

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('cursor',function(msg) {
        io.emit('cursor',msg);
    });

    socket.on('user',function(new_name) {
       // alert("on user!");
        delete_user(this_user_name);
        this_user_name = new_name;
        write(this_user_name);
        update_users();
    });

    socket.on('disconnect', function() {
        console.log('disconnected:' + this_user_name);
        delete_user(this_user_name);
    });

});

function ini_json() {
    var empty = {'users': []};
    fs.writeFile( "users.json", JSON.stringify(empty), "utf8", null );
}

function write(name) {
    fs.readFile("users.json", 'utf8', function readFileCallback(err, data){
        if (err){ 
            console.log(err); 
        } 
        else {
            obj = JSON.parse(data); //now it an object
            user = { "name": name };
            obj['users'].push(user);
            var users = JSON.stringify(obj); //convert it back to json
            fs.writeFile( "users.json", users, "utf8", null );

            console.log(users);
        }
    });

}

function delete_user(name) {
    fs.readFile("users.json", 'utf8', function readFileCallback(err, data){
        if (err) { 
            console.log(err); 
        } 
        else {
            obj = JSON.parse(data); //now it an object
            console.log(data);
            findAndRemove(obj.users, 'name', name);
            var users = JSON.stringify(obj); //convert it back to json
            fs.writeFile( "users.json", users, "utf8", null );
        }
    });
}

function findAndRemove(array, property, value) {
    array.forEach(function(result, index) {
        if(result[property] === value) {
            array.splice(index, 1);
        }    
    });
}

function update_users() {
    var users = [];
    fs.readFile("users.json", 'utf8', function readFileCallback(err, data){
        if (err) { 
            console.log(err); 
        } 
        else {
            obj = JSON.parse(data); //now it an object
            //console.log(data);
            obj.users.forEach( function(element, index) {
                console.log(element);
                //users.push(element.name);
            });   

            console.log('updated users, current users:')
            console.log(users);
        }
    });

    //io.emit('user', users);

    
}














