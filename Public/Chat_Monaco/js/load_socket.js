
var socket = io();

$(document).ready(socket_function);

function socket_function(){
    $('form#send').submit(function(){
      var id = $('#name').text();
      msg =  id + ": " + $('#m').val();
      console.log(msg)
      socket.emit('chat message', msg); 
      $('#m').val('');
      return false;
    });

    $('form#user_form').submit(function(){
      var name = $('#user_name').val();
      $('#name').html(name);
      $('#user_name').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
	
}

