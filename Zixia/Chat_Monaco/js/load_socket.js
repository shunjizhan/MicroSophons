var socket = io();
//var content = '';

var splitURL = window.location.href.split('/');
var projectID = splitURL[splitURL.length-1];


$(document).ready(socket_function);

function socket_function(){
    //alert(projectID);
    var num = Math.floor(Math.random()*99);
    $('#name').text('User'+num);
    socket.emit('add-user', {room: projectID, number: num });

    // send message
    $('form#send').submit(function(){
        var id = $('#name').text();
        //alert("Hello! I am an alert box!!");
        msg =  id + ": " + $('#m').val();
        message = {room: projectID, msg: msg};
        socket.emit('chat message', message); 
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg){  
        $('#messages').append($('<li>').text(msg));
    });

    /*
    socket.on('current user', function(current){
        var currentstring=current.toString();
        $('#currentcount').html(currentstring);
    });
    */

    // when there is user name change, emit user event to server
    $('form#user_form').submit(function(){  
        var name = $('#user_name').val();
        $('#user_name').val('');
        $('#name').text(name);    // set user name
        //$('#prev').text(name);
        var msg = {room: projectID, name: name}
        socket.emit('user-name', msg); 

        return false;
    });

    socket.on('update_user', function(users){  // users is an array containing all user names
        console.log(users);
        $('#online_users').html("");
        users.forEach( function(user, index) {
            $('#online_users').append($('<li>').attr('id', user.name).text(user.name)); // update the online users
        });
        $('#currentcount').text(users.length);

    });

    socket.on('user-name', function(msg){
        $('#' +msg.old_name).attr('id', msg.new_name).text(msg.new_name);
    });

    socket.on('reply-content', function(msg){
        content=msg.content;
        lang=msg.language;
        editorID=msg.editorID;
        filenames=msg.filenames;
    });


    // default name
    /*
    name = "ShaB" + Math.floor(Math.random() * 20);
    $('#name').html(name); 
    $('#prev').text(name);
	socket.emit('user', {name: name, del: ""});
    */
}









