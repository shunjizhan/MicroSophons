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

var azure = require("azure-storage");
var tableSvc = azure.createTableService();
var entityGen = azure.TableUtilities.entityGenerator;

/*
var userID = [];
var users = [];
//var address;

var color = [];
*/
var rooms = {};


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
    var added = false;

    //set up user data structure
    var user_object = {
        id: socket.id,
        name: "User" + Math.floor(Math.random() * 99),
        color: "rgb("+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+","+Math.floor(Math.random()*191+64)+")"
    };


    //add user to the room
    socket.on('add-user',function(msg){
        if(!added){
            added=true;
            room = msg.room;
            socket.join(room);
            user_object.name = msg.name;
            if(rooms[room]===undefined){
                rooms[room] = [user_object];
            }
            else{
                rooms[room].push(user_object);
            }
            if(msg.reconnect){
                console.log("reconnect:");
            }
            console.log(io.sockets.adapter.rooms);
            //console.log(rooms);
            io.in(room).emit('update_user', rooms[room]);
            socket.broadcast.to(room).emit('new-user', socket.id); // create cursor
            if(!msg.reconnect){
                socket.broadcast.to((rooms[room])[0].id).emit('request-content', socket.id);
            }
        }
    });
    

    
    socket.on('reply-content', function(msg){
        console.log(msg);
        socket.broadcast.to(msg.senderID).emit('reply-content', msg);
    });

    socket.on('chat message', function(msg) {
        io.in(msg.room).emit('chat message', msg.msg);
        //io.emit('chat message', msg);
    });

    socket.on('cursor',function(msg) {
        msg.username = user_object.name;
        msg.color = user_object.color;
        socket.broadcast.to(msg.room).emit('cursor', msg); 
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

    socket.on('my-ping', function(msg){
        socket.emit('my-ping',msg);
    })


    socket.on('cloud-save',function(obj) {
        var fname=obj.ffname;
        var pid=obj.ppid;
        var content=obj.ccontent;
        //fid
        var query = new azure.TableQuery().where("PartitionKey eq 'B' and PID eq '"+pid+"' and FN eq '"+fname+"'");
        tableSvc.queryEntities('myfile',query, null, function(error, result, response) {
            if(!error) {
                console.log(result.entries.length);
                console.log("find if need new");
                if (result.entries.length==0){
                    console.log("need new");
                    insertnewfiletable(fname,pid,content);
                }
                else{
                    console.log("need not new");
                    var keyid=result.entries[0].RowKey;
                    console.log(keyid['_']);
                    updatefiletable(keyid['_'],fname,pid,content);
                }
            }
            else{
                console.log(error);
            }
        });
        //var keyid=(Math.floor((Math.random() * 1000) + 1)).toString();
    });
    

    socket.on('get-saved',function(ppid){
        var query = new azure.TableQuery().where("PartitionKey eq 'B' and PID eq '"+ppid+"'");
        tableSvc.queryEntities('myfile',query, null, function(error, result, response) {
            if (!error){
                console.log(result);
                if (result.entries.length===0){
                    console.log("thats a new project, no file saved before");               
                }
                else{
                    var data = result.entries;
                    var receive = {filename:[], content:[]};

                    for (var i = 0; i < data.length; i++) {
                        receive.filename.push(data[i].FN._);
                        receive.content.push(data[i].CC._);
                    }

                    console.log(receive);
                    socket.emit('receive-saved', receive);
                }
            }
            else{
                console.log(error);
            }
        });

    });


    socket.on('disconnect', function() {
        console.log('disconnected:' + socket.id + ' ' + user_object.name);
        count--;
        //var current=count;
        //io.emit('current user',current);

        if(rooms[room]!==undefined){
            rooms[room].splice(rooms[room].indexOf(user_object), 1);
        }
        io.in(room).emit('update_user', rooms[room]);
        socket.broadcast.to(room).emit('user-exit', socket.id);
        console.log(io.sockets.adapter.rooms);
        //console.log(rooms);
        //console.log(room);
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

// tableSvc.deleteTableIfExists('mytable', function(error){
//   if(!error){
//     console.log('table deleted!');
//   }
//   else{
//     console.log('table deleted failllllll!');
//   }
// });

// tableSvc.deleteTableIfExists('myfile', function(error){

//   if(!error){
//     console.log('file table deleted!');
//   }
//   else{
//     console.log('file table deleted failllllll!');
//   }
// });

// tableSvc.createTableIfNotExists('mytable', function(error,result,response){


//   if(!error){
//     console.log('id table created!');
//   }
//   else{
//     console.log('id table created failllllll!');
//   }
// });

// tableSvc.createTableIfNotExists('myfile', function(error,result,response){


//   if(!error){
//     console.log('file table created!');
//   }
//   else{
//     console.log('file table created failllllll!');
//   }

// });


function createPEntity(project_id, password){
    var entity = {
        PartitionKey: entityGen.String('A'),
        RowKey: entityGen.String(project_id),
        password: entityGen.String(password)
    };
    return entity;
}


function createFEntity(file_id, file_name, project_id, content){
    var entity = {
        PartitionKey: entityGen.String('B'),
        RowKey: entityGen.String(file_id),
        FN:entityGen.String(file_name),
        PID:entityGen.String(project_id),
        CC:entityGen.String(content)
    };
    return entity;
}


function insertatable(name,entity){
    tableSvc.insertEntity(name,entity, function(error, result, response){


    if(!error){
        console.log(name+' inserted');
    }
    else{
        console.log(name+' inserted failllllll');
    }
});   

}


function insertnewfiletable(file_name, p_id, c_ontent){

        var keyid=(Math.floor((Math.random() * 100000) + 1)).toString();
        console.log(keyid);

    var newen=createFEntity(keyid,file_name,p_id,c_ontent);
    tableSvc.insertEntity('myfile',newen, function(error, result, response){
        if(!error){
            console.log('new file inserted');
        }
        else{
            console.log('new file inserted failllllll');
        } 
    });

}



function updatefiletable(key_id,file_name, p_id, c_ontent){

    console.log(key_id);

    var newen=createFEntity(key_id,file_name,p_id,c_ontent);
    tableSvc.replaceEntity('myfile',newen, function(error, result, response){
        if(!error){
            console.log('new file updated');
        }
        else{
            console.log('new file updated failllllll');
        } 
    });

}




// var myEntity = createPEntity('aaa','123456');
// var myEntity2 = createFEntity('1','default.js','aaa','hello world!');


// tableSvc.insertEntity('mytable',myEntity, function(error, result, response){


//     if(!error){
//         console.log('mytable inserted');
//     }
//     else{
//         console.log(error);
//         console.log('mytable inserted failllllll');
//         insertatable('mytable',myEntity);
//     }
// });

// tableSvc.insertEntity('myfile',myEntity2, function(error, result, response){


//     if(!error){
//         console.log('myfile inserted');
//     }
//     else{
//         console.log(error);
//         console.log('myfile inserted failllllll');
//         insertatable('myfile',myEntity2);
//     }
// });


