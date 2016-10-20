var pos_x=200, pos_y=200, mouse_x=200, mouse_y=200;
var a=0.05, k=0.01, v_x=0, v_y=0;
var id;
var objects=[]

$(document).ready(main);

function main(){
	console.log('in main');
    $('#window').mousemove(function(e){
		mouse_x=e.pageX;
		mouse_y=e.pageY;
		$('#position').text('(' + mouse_x + ', ' + mouse_y + ')');
		$('#position').css('top' ,mouse_y);
		$('#position').css('left', mouse_x);
		if($('#colorful').is(':checked')){
			$('.object').css('background-color', "rgb(" + Math.floor(Math.random() * 255)
      + ", " + Math.floor(Math.random() * 255) + ", "
      + Math.floor(Math.random() * 255) + ")");
			$('h2').css('color', "rgb(" + Math.floor(Math.random() * 255)
      + ", " + Math.floor(Math.random() * 255) + ", "
      + Math.floor(Math.random() * 255) + ")");
		}
		if($('#crazy').is(':checked')){
			$('#window').css('background-color', "rgb(" + Math.floor(Math.random() * 255)
      + ", " + Math.floor(Math.random() * 255) + ", "
      + Math.floor(Math.random() * 255) + ")");
		}
	});
	$('.submit').click(function(){
		a = $('#acc').val();
		k = $('#res').val();
	});
	$('.reset').click(function(){
		a = 0.05;
		k = 0.01;
	});
	$('input').mouseenter(function(){
		$('#position').hide();
	})
	$('input').mouseleave(function(){
		$('#position').show();					  
	});
    console.log("after mousemove");
    id = setInterval(move, 10);
}

function move(){
    var Y = mouse_y - pos_y, X = mouse_x - pos_x;
	var a_x = a * X- k * v_x; 
	var	a_y = a * Y- k * v_y;
	v_x += a_x;
	v_y += a_y;
	pos_x += v_x;
	pos_y += v_y;
	//$('.object').css('top', pos_y);
	//$('.object').css('left', pos_x);
	
	var count = 50;
	if(!$('#trail').is(':checked')){
		count = 2;
	}
	var newObject = $('<div/>', {
		'class': 'object',
		'css':{
			'top':pos_y, 'left': pos_x
		}
	});
	objects.push(newObject);
	while(objects.length>=count){
		objects.shift().remove();
	}
	newObject.prependTo('#window');
	newObject.fadeOut('slow');

}
