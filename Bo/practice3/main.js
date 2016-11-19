$(document).ready(func);

function func(){
	$('#file-upload').on('change', function(e){
		var file = e.target.files[0];
		console.log(file);
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(f){
			console.log(f.target.result);
			$('body').append('<div/>', {'text': f.target.result});
		};
	});
}