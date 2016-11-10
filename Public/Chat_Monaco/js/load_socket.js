
var socket = io();

$(document).ready(socket_function);

function socket_function(){
	
	while(socket.io.engine.id===null){}
	socket.emit('new-user', socket.io.engine.id);
	
    $('form').submit(function(){
      msg =  socket.io.engine.id + ": " + $('#m').val();
      console.log(msg)
      socket.emit('chat message', msg); 
      $('#m').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
	
}

