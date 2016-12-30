var direction = 4;
var last_dir = 4;
var score = 0;
var head_pos={top: 0, left: 0};
var id;
var end = false;
var time_out = 800;

$(document).ready(main);

function main(){
	$('#start').click(start);
}

function start(){
	$('#start').hide();
	score = 0;
	$('#score').text(score);
	if(end){
		$('#snake').empty();
		$('#snake').append($('<div/>', {
			'class': 'snake-node',
			'css': {'top': 4, 'left':4}
		}));
		$('#snake').append($('<div/>', {
			'class': 'con connector-v',
			'css': {'top': 16, 'left':4}
		}));
		$('#snake').append($('<div/>', {
			'class': 'snake-node',
			'css': {'top': 24, 'left':4}
		}));
		time_out = 800;
		direction = 4;
		end = false;
	}
	document.onkeydown = function(e) {

		var new_dir = e.keyCode - 36;
		if(new_dir>=1&&new_dir<=4){
			if((last_dir===1&&new_dir!==3)||(last_dir===3&&new_dir!==1)||(last_dir===2&&new_dir!==4)||(last_dir===4&&new_dir!==2)){
				direction = new_dir;
			}
		}
    };
	head_pos.top = $('.snake-node').last().position().top;
	head_pos.left = $('.snake-node').last().position().left;
	prepareFood();
	callback();
}

function callback(){
	move();
	if(end){
		return;
	}
	id = setTimeout(callback, time_out);
}

function move(){

		var new_head, new_connector;
		switch(direction){
			case 2: // up
			new_connector = $('<div/>', {
				'class':'con connector-v',
				'css':{
					'top': head_pos.top - 8,
					'left': head_pos.left
				}
			});
			head_pos.top -= 20;
			break;
			case 1: // left
			new_connector = $('<div/>', {
				'class':'con connector-h',
				'css':{
					'top': head_pos.top,
					'left': head_pos.left - 8
				}
			});
			head_pos.left -= 20;
			break;
			case 4: // down
			new_connector = $('<div/>', {
				'class':'con connector-v',
				'css':{
					'top': head_pos.top + 12,
					'left': head_pos.left
				}
			});
			head_pos.top += 20;

			break;
			case 3: // right
			new_connector = $('<div/>', {
				'class':'con connector-h',
				'css':{
					'top': head_pos.top,
					'left': head_pos.left + 12
				}
			});
			head_pos.left += 20;
			break;
		}

		new_head = $('<div/>', {
			'class':'snake-node',
			'css':{
				'top': head_pos.top,
				'left': head_pos.left
			}
		});

		if(hitFood()){
			score++;
			if(time_out>100){
				time_out-=6;
			}
			$('#score').text(score);
			prepareFood();
		}
		else{
			$('.snake-node')[0].remove();
			$('.con')[0].remove();
		}
		$('#snake').append(new_connector);
		
		if(hitWall()||hitSelf()){
			endgame();
			return;
		}
		$('#snake').append(new_head);
		last_dir=direction;

}

function prepareFood(){
	var x = Math.floor(Math.random() * 21)*20+4;
	var y = Math.floor(Math.random() * 21)*20+4;
	if(y===$('#food').position().top&&x===$('#food').position().left){
		return prepareFood();
	}
	if(y===head_pos.top&&x===head_pos.left){
		return prepareFood();
	}
	var nodes = $('.snake-node').first();
	while(nodes.length!==0){
		if(nodes.position().left===x && nodes.position().top===y){
			return prepareFood();
		}
		nodes=nodes.next().next();
	}

	$('#food').css({'top': y, 'left': x});
}

function hitFood(){
	return head_pos.top===$('#food').position().top&&head_pos.left===$('#food').position().left;
}

function hitWall(){
	return head_pos.top<0||head_pos.top>420||head_pos.left<0||head_pos.left>420;
}

function hitSelf(){
	var nodes = $('.snake-node').first();
	while(nodes.length!==0){
		if(nodes.position().left===head_pos.left&&nodes.position().top===head_pos.top){
			return true;
		}
		nodes=nodes.next().next();
	}
	return false;
}

function endgame(){
	//clearTimeout(id);
	end = true;
	$('#start').show();
	return;
}