var socket = io();
$('form').submit(function(){
         var id = socket.io.engine.id;
         msg =  id + ": " + $('#m').val();
         console.log(msg)
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
    $('div#user_form').submit(function(){
       var name = $('#user_name').val();
       $('#user_name').val('');
       $('#my_name').html(name);    // set user name
       socket.emit('user', name);

       return false;
    });

    socket.on('update_user', function(users){  // users is an array containing all user names
        console.log('update_user()!!')
        $('#online_users').html("")
        users.forEach( function(user, index) {
            $('#online_users').append($('<li>').attr('id', user).text(user)); // update the online users
       });
    });
