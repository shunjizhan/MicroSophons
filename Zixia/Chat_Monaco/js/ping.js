var received = false;

var interval = setInterval(ping, 10000)

var time_send;
var latency;

function ping(){
	socket.emit("my-ping","");
	received = false;
	time_send = Date.now();
	var timeout = setTimeout(checkReceive, 9900);
}

function checkReceive(){
	if(!received){
		console.log('ping time out');
		// $('#disconnect').show();
	 //    for (var i = editors.length - 1; i >= 0; i--) {
	 //        editors[i].updateOptions({readOnly:true});
	 //    }
	    // socket.connect();

	}
	else{
		$('#disconnect').hide();
	    for (var i = editors.length - 1; i >= 0; i--) {
	        editors[i].updateOptions({readOnly:false});
	    }
	}
}

socket.on('my-ping', function(msg){
	received = true;
	latency = Date.now() - time_send;
	console.log(latency);
});