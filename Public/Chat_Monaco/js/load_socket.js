
var socket = io();

$(document).ready(socket_function);

function socket_function(){
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val()); 
      $('#m').val('');
      return false;
    });
	
	

    socket.on('chat message', function(msg){
      //alert("1111111");
      $('#messages').append($('<li>').text(msg));
    });
	
}

