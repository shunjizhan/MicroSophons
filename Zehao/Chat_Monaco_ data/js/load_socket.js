var socket = io();
//var content = '';

$(document).ready(socket_function);

function socket_function(){

    // send message
    $('form#send').submit(function(){
       var id = $('#name').text();
       msg =  id + ": " + $('#m').val();
       socket.emit('chat message', msg); 
       $('#m').val('');
       return false;
    });

    socket.on('chat message', function(msg){  
       $('#messages').append($('<li>').text(msg));
    });

    socket.on('current user', function(current){
        var currentstring=current.toString();
        $('#currentcount').html(currentstring);
    });

    // when there is user name change, emit user event to server
    $('form#user_form').submit(function(){  
       var name = $('#user_name').val();
       $('#user_name').val('');
       $('#name').html(name);    // set user name
       $('#prev').text(name);
       socket.emit('user-name', name); 

       return false;
    });

    socket.on('update_user', function(users){  // users is an array containing all user names
        $('#online_users').html("")
        users.forEach( function(user, index) {
            $('#online_users').append($('<li>').attr('id', user).text(user)); // update the online users
       });
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









