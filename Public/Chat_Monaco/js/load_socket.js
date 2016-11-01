
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
      var del = '#' + $('#prev').text()
      var name = $('#user_name').val();
      $('#user_name').val('');

      var del = '#' + $('#prev').text()

      $('#name').html(name);    // set user name
      $('#prev').text(name); // save the user name locally   
      socket.emit('user', {name: name, del: del}); 

      return false;
    });

    socket.on('user', function(data){  
      $('#online_users').append($('<li>').attr('id', data.name).text(data.name)); // update the online users
      $(data.del).remove(); // remove the previous name 
    });

    /*
    socket.on('user_leave', function(del){
      $(del).remove();
    });
    */
    // default name
    name = "ShaB" + Math.floor(Math.random() * 20);
    $('#name').html(name); 
    $('#prev').text(name);
	  socket.emit('user', {name: name, del: ""});
    

}











