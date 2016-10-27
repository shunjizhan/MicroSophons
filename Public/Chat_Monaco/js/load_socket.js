
var socket = io();

$(document).ready(socket_function);

function socket_function(){
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
	
}

