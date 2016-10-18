var rgb='';

function main(){
    console.log("yes");
    alert("Bazinga!");	

	box_array(5, 5);
	
    $('.box').css('background-color',random_color());
	$('.rgb').text(rgb);
	
	console.log($('.check').is(':checked'));

	mouse();
	$('.submit').click(rearrange);
	$('.check').click(mouse);
}

function change_color(){
	$(this).css('background-color',random_color());
	$('.rgb').text(rgb);
}

function random_color(){
	rgb = "rgb(" + Math.floor(Math.random() * 255)
      + ", " + Math.floor(Math.random() * 255) + ", "
      + Math.floor(Math.random() * 255) + ")";
	return rgb;
}

function rearrange(){
	dim1 = $('#dim1').val();
	dim2 = $('#dim2').val();
	console.log(dim1 +','+dim2);
	
	$('.box-array').empty();
	box_array(dim1, dim2);
	$('.box').css('background-color',rgb);
	mouse();
}


function mouse(){
	console.log($('.check').is(':checked'));
	if($('.check').is(':checked')){
		$('.box').off('click');
		$('.box').mouseenter(change_color);
	}
	else{
		$('.box').off('mouseenter');
		$('.box').click(change_color);
	}
}

function box_array(a, b){
	for(var i=0;i<a;i++){
		$('<div/>', {
			'class': 'box-row',
		}).appendTo('.box-array');
	}
	for(var i=0;i<b;i++){
		$('<div/>',{
			'class': 'box',
		}).appendTo('.box-row');
	}
	if(a<=5&&b<=10){
		$('.box').css('height','100px');
		$('.box').css('width','100px');
	}
	else if((a>5||b>10)&&a<=10&&b<=20){
		$('.box').css('height','50px');
		$('.box').css('width','50px');
	}
	else{
		$('.box').css('height','20px');
		$('.box').css('width','20px');
	}
}

$(document).ready(main);
