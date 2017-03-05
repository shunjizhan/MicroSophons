var colors = {
	'green': {
		left_container: '#307850',
		body: '#669C7F',
		messages: '#E8F5E9',
		chat_box: '#C8E6C9',
		tab_select_bg: '#EFE',
		item: '#FFF',
		right_text: '#000',
		send_button: '#8FD',
		editor_theme_light:true
	},
	'blue':{
		left_container: '#3A629E',
		body: '#6C8BB6',
		messages: '#E8EAF6',
		chat_box: '#6C8BB6',
		tab_select_bg: '#EEF',
		item: '#FFF',
		right_text: '#000',
		send_button: '#3A629E',
		editor_theme_light:true
	}, 
	'red':{
		left_container: '#C64E36',
		body: '#D58370',
		messages: '#FBE9E7',
		chat_box: '#FFCCBC',
		tab_select_bg: '#FEE',
		item: '#FFF',
		right_text: '#000',
		send_button: '#F8B',
		editor_theme_light:true
	}, 'black':{
		left_container: '#444',
		body: '#666',
		messages: '#445',
		chat_box: '#555',
		tab_select_bg: '#000',
		item: '#FFF',
		right_text: '#FFF',
		send_button: '#444',
		editor_theme_light:false
	}, 'purple':{
		left_container: '#82407E',
		body: '#AB7FA8',
		messages: '#F3E5F5',
		chat_box: '#E1BEE7',
		tab_select_bg: '#FEF',
		item: '#FFF',
		right_text: '#000',
		send_button: '#EA80FC',
		editor_theme_light:true
	}, 'random':{
		left_container: '',
		body: '',
		messages: '',
		chat_box: '',
		tab_select_bg: '',
		item: '',
		right_text: '',
		send_button: '',
		editor_theme_light:true
	}
};


$('#theme').hover(function(){
	//alert("hovered");
	$('#color-panel').fadeIn(500);

	if($('#theme').height()>40){
        $('#theme').css({'line-height':'100%'});
    }
},function(){
	$('#color-panel').hide();
	$('#theme').css({'line-height':'40px'});
});

$('.colors').hover(function() {
	 $(this).css('border-radius', '0%');
}, function() {
	 $(this).css('border-radius', '50%');
});

$('.colors').click(function(){
	var col = $(this).attr('id');
	light = colors[col].editor_theme_light;
	$('body').css({'background-color': colors[col].body});
	$('#left_container').css({'background-color': colors[col].left_container});
	$('#messages').css({'background-color': colors[col].messages, 'color': colors[col].right_text});
	$('#chat-box').css({'background-color': colors[col].chat_box, 'color': colors[col].right_text});
	$('.tab').css({'background-color': colors[col].body, 'color': colors[col].item})
	$('.tab-selected').css({'background-color':colors[col].tab_select_bg,'color': light?colors[col].left_container:"#FFF"});
	$('#send-button').css({'background-color':colors[col].send_button});
	$('i').css({'color': light?colors[col].left_container:"#FFF"});
	$('.item i').css({'color':colors[col].item});
	$('.item').css({'color':colors[col].item});
	$('#currentcount').css({'color': colors[col].right_text});
	$('#name').css({'color': colors[col].right_text});
	$('#online_users').css({'color': colors[col].right_text});
	for(var i=0; i<editors.length;i++){
		editors[i].updateOptions({'theme':colors[col].editor_theme_light?'vs':'hc-black'});
	}
})

/*
$('#green').click(function(){
	$('body').css({'background-color':'#DED'});
	$('#left_container').css({'background-color':'#1A6'});
	$('#messages').css({'background-color':'#DFE'});
	$('#chat-box').css({'background-color':'#BEA'});
	$('.tab-selected').css({'background-color':'#BFA'});
	$('#send-button').css({'background-color':'#8FD'});
});
$('#red').click(function(){
	$('body').css({'background-color':'#EDD'});
	$('#left_container').css({'background-color':'#A53'});
	$('#messages').css({'background-color':'#FDD'});
	$('#chat-box').css({'background-color':'#EBA'});
	$('.tab-selected').css({'background-color':'#FBA'});
	$('#send-button').css({'background-color':'#F8B'});
});
$('#blue').click(function(){
	$('body').css({'background-color':'#6C8BB6'});
	$('#left_container').css({'background-color':'#3A629E'});
	$('#messages').css({'background-color':'#E8EAF6'});
	$('#chat-box').css({'background-color':'#EEEEEE'});
	$('.tab').css({'background-color':'#6C8BB6', 'color':'#FFF'})
	$('.tab-selected').css({'background-color':'#EEF','color':'#3A629E'});
	$('#send-button').css({'background-color':'#8DF'});
	$('i').css({'color':'#3A629E'});
	$('.item i').css({'color':'#FFF'});
	$('.item').css({'color':'#FFF'});

});
$('#black').click(function(){
	$('body').css({'background-color':'#444'});
	$('#left_container').css({'background-color':'#556'});
	$('#messages').css({'background-color':'#555'});
	$('#chat-box').css({'background-color':'#555'});
	$('.tab-selected').css({'background-color':'#333'});
	$('#send-button').css({'background-color':'#225'});
});
$('#purple').click(function(){
	$('body').css({'background-color':'#616'});
	$('#left_container').css({'background-color':'#92A'});
	$('#messages').css({'background-color':'#A7A'});
	$('#chat-box').css({'background-color':'#D5D'});
	$('.tab-selected').css({'background-color':'#C4C'});
	$('#send-button').css({'background-color':'#FDF'});
});
*/
$('#random').click(function(){
	$('body').css('background-color', getRandomColor());
	$('#left_container').css('background-color', getRandomColor());
	$('#messages').css('background-color', getRandomColor());
	$('#chat-box').css('background-color', getRandomColor());
	$('.tab-selected').css('background-color', getRandomColor());
	$('#send-button').css('background-color', getRandomColor());

	var x = Math.floor(Math.random() * 10);
	if(x < 6) {
		setLight();
	} else {
		setDark();
	}
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setLight() {	
	light = true;
	$('.tab-selected').css({'color':'black'});
	$('#user_id').css({'color':'black'});
	$('#send-button').css({'color':'black'});
	$('#messages').css({'color':'black'});
	for(var i=0; i<editors.length;i++){
		editors[i].updateOptions({'theme':'vs'});
	}
}

function setDark() {
	light = false;
	$('.tab-selected').css({'color':'white'});
	$('#user_id').css({'color':'white'});
	$('#send-button').css({'color':'white'});
	$('#messages').css({'color':'white'});
	for(var i=0; i<editors.length;i++){
		editors[i].updateOptions({'theme':'hc-black'});
	}	
}

let expand2 = false;
$('#change-name').click(() => {
	if (!expand2) {
		$('#user_form').stop().fadeIn(300);
		$('#user_id').stop().animate({'height': '70px'});
		$('#lower-container').stop().animate({'top': '70px'}, 300);
		$('#user_form').stop().fadeIn(300);
	} else {
		$('#user_form').stop().fadeOut(300);
		$('#user_id').stop().animate({'height': '50px'});
		$('#lower-container').stop().animate({'top': '50px'}, 300);
		$('#user_form').stop().fadeOut(300);
	}
	expand2 = !expand2;
});

$('#blue').click();
