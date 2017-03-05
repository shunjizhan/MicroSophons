let collapsed = false;

$('#settings').click(() => {
  console.log("!!!!!")
  if(collapsed) {
    expand();
    collapsed = !collapsed;
  } else {
    collapse();
    collapsed = !collapsed;
  }
  });

  let collapse = () => {
   $('.menu-word').css({
    'display': 'none'
  });

   $('#left_container').animate({
    'width': '5%'
  }, 500);

      	// $('#left_container > li').animate({
      	// 	'text-align': 'center',
      	// 	'padding-left': '0'
      	// }, 500);

        $('#left_container i').animate({
          'font-size': '130%'
        }, 500);

        $('#center').animate({
          'width': '73%',
          'left': '5%'
        }, 500);
      }

      let expand = () => {
       setTimeout(() => {
        $('.menu-word').css({
         'display': 'inline'
       });
      }, 500);	

       $('#left_container').animate({
        'width': '15%',
      }, 500);

      	// $('#left_container > li').animate({
      	// 	'text-align': 'center',
      	// 	'padding-left': '0'
      	// }, 500);

      	$('#left_container i').animate({
      		'font-size': '100%'
      	}, 500);

      	$('#center').animate({
          'width': '63%',
          'left': '15%'
        }, 500);
      }