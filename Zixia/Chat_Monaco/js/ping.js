var received = false;

var interval = setInterval(ping, 10000);

function ping(){
	socket.emit("ping","ping");
	received = false;
	var timeout = setTimeout(checkReceive, 9000);
}

function checkReceive(){
	if(!received){
		$('#disconnect').show();
	    for (var i = editors.length - 1; i >= 0; i--) {
	        editors[i].updateOptions({readOnly:true});
	    }
	    socket.connect();

	}
	else{
		$('#disconnect').hide();
	    for (var i = editors.length - 1; i >= 0; i--) {
	        editors[i].updateOptions({readOnly:false});
	    }
	   	
	}
}

socket.on('ping', function(msg){
	received = true;
});