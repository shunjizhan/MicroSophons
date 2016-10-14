function main(){
    console.log("yes");
    alert("Bazinga!");
    $('.box').css('background-color',random_color());
	$('.box').on('click', change_color);
}

function change_color(){
	$(this).css('background-color',random_color());
}

function random_color(){
	return "rgb(" + Math.floor(Math.random() * 255)
      + "," + Math.floor(Math.random() * 255) + ","
      + Math.floor(Math.random() * 255) + ")";
}

console.log("in js");
$(document).ready(main);
