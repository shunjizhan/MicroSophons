var socket = io();
//var content = '';

var splitURL = window.location.href.split('/');
var projectID = splitURL[splitURL.length-1];
if(projectID.slice(-1)==='?'||projectID.slice(-1)==='#'){
    projectID = projectID.substring(0, projectID(length));
}


$(document).ready(socket_function);

function socket_function(){
    //alert(projectID);
    document.title = projectID + " | Sophons";
    var num = Math.floor(Math.random()*99);
    $('#name').text('User'+num);

    socket.on('error', function(err){
        console.log('error: ');
        console.log(err);
    })

    socket.on('reconnecting', function(times){
        console.log("attempting to reconnect: " + times);
    })

    socket.on('reconnect_error', function(err){
        console.log("reconnect error");
        console.log(err);
    })

    socket.on('reconnect_failed', function(msg){
        console.log("reconnect failed");
    })

    socket.io.on('pong', function(latency){
        console.log("latency: "+latency);
    })

    socket.emit('add-user', {room: projectID, name: 'User'+num, reconnect: false });

    socket.on('reconnect', function(msg){
        console.log("reconnect successful");
        if(editors.length>0){
            socket.emit('add-user', {room: projectID, name: $('#name').text(), reconnect: true });
            console.log("reconnected!");
        }
    });

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

    socket.on('reply-content', function(msg){ // get information from other users
        content=msg.content;
        lang=msg.language;
        editorID=msg.editorID;
        filenames=msg.filenames;
    });



    $("#invite").click(function(){
        $("#invite-box").show();
        $("#url").text(window.location.href);
        $("#url").focus();
        $("#url").select();
    });
    $("#copy").click(function(){
        $("#url").focus();
        $("#url").select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } 
        catch (err) {
            console.log('Oops, unable to copy');
        }
    });
    
    $("#invite-form").submit(function(){
        var sender = "microsophons@outlook.com";
        var emails = $("#emails").val().split(",");
        var subject = "Invitation from " + projectID;
        var say = "Dear Collaborator,\n" +
        "You are invited to join our project: " + projectID + " in Sophons.\n" +
        "Click the link below to help us to code!\n" + window.location.href + "\n";
        say = encodeURIComponent(say);
        var mailto_link = 'mailto:' + emails.join(';') + '?subject=' + subject + '&body=' + say;
        var win = window.open(mailto_link, 'emailWindow');
        if (win && win.open && !win.closed){
            win.close();
        }
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









