var pos_x=100, pos_y=100, mouse_x=100, mouse_y=100;
var a=0.05, k=0.03, v_x=0, v_y=0;
var id;

$(document).ready(main);

function main(){
	console.log('in main');
    $('#window').mousemove(function(e){
		mouse_x=e.pageX;
		mouse_y=e.pageY;
		$('#position').text('(' + mouse_x + ', ' + mouse_y + ')');
		$('#position').css('top' ,mouse_y);
		$('#position').css('left', mouse_x);
	
	});
    console.log("after mousemove");
    id = setInterval(move, 33);
}


function move(){
	if(pos_x==NaN||pos_y==NaN){
		pos_x=100;
		pos_y=100;
	}
    var Y = mouse_y - pos_y, X = mouse_x - pos_x;
	var angle = Math.atan2(Y,X);
	var a_x = a * X- k * v_x; 
	var	a_y = a * Y- k * v_y;
	v_x += a_x;
	v_y += a_y;
	pos_x += v_x;
	pos_y += v_y;
	//console.log(a_x+', '+a_y);
	$('#object').css('top', pos_y);
	$('#object').css('left', pos_x);
}
