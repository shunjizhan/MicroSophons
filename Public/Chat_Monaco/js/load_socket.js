
var socket = io();

$(document).ready(socket_function);

function socket_function(){
    // send message
    $('form#send').submit(function(){
      var id = $('#name').text();
      msg =  id + ": " + $('#m').val();
      console.log(msg)
      socket.emit('chat message', msg); 
      $('#m').val('');
      return false;
    });

    socket.on('chat message', function(msg){  
      $('#messages').append($('<li>').text(msg));
    });

    // when there is user name change, emit user_change event to everyone
    $('form#user_form').submit(function(){  
      var name = $('#user_name').val();
      $('#user_name').val('');

      var del = '#' + $('#prev').text()

      $('#prev').text(name); // save the user name locally   
      socket.emit('user', {name: name, del: del}); 

      return false;
    });

    socket.on('user', function(data){  
      $('#name').html(data.name);    // set user name

      $('#online_users').append($('<li>').attr('id', data.name).text(data.name)); // update the online users

            // alert(data.del)
            // alert(data.name)
      $(data.del).remove(); // remove the previous name

      
    });
	
}

