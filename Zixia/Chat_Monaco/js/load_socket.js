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

    $("#invite").click(function(){
        $("#invite-box").show();
    });
    $("#invite-form").submit(function(){
        var sender = "trexluan@gmail.com";
        var emails = $("#emails").val().split(",");
        var subject = "Invitation from " + projectID;
        var say = "Dear Collaborator,\n" +
        "You are invited to join our project: " + projectID + " in Microsophons.\n" +
        "Click the link below to help us to code!\n" + window.location.href + "\n";
        var token = "2cf52e22-800d-4f46-8d04-b8401fe62119";
        var smtp = "smtp-mail.outlook.com";

        for(var i=0;i<emails.length;i++){
            console.log(emails[i]);
            Email.send(sender, emails[i], subject, say, {token: token});
        }
        $("#invite-box").hide();
        console.log("email sent");
        return false;
    });
    $("#invite-cancel").click(function(){
        $("#invite-box").hide();
		return false;
    });


    // default name
    /*
    name = "ShaB" + Math.floor(Math.random() * 20);
    $('#name').html(name); 
    $('#prev').text(name);
	socket.emit('user', {name: name, del: ""});
    */
}









