var jsCode = [
    '"use strict";',
    'function Person(age) {',
    '   if (age) {',
    '       this.age = age;',
    '   }',
    '}',
    'Person.prototype.getAge = function () {',
    '   return this.age;',
    '};'
].join('\n');

require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], editor_function);

function editor_function() {
    if(content!==''){
        jsCode=content;
    }
    var editor = monaco.editor.create(document.getElementById('container'), {
        value: jsCode,
        language: "javascript",
        glyphMargin: true,
        nativeContextMenu: false
 	 });


	    var decorations = editor.deltaDecorations([], [
        {
            range: new monaco.Range(3,1,3,1),
            options: {
                isWholeLine: true,
                className: 'myContentClass',
                glyphMarginClassName: 'myGlyphMarginClass'
            }
        }
    ]);

    // Add a zone to make hit testing more interesting
    var viewZoneId = null;
    editor.changeViewZones(function(changeAccessor) {
            var domNode = document.createElement('div');
            domNode.style.background = 'lightgreen';
            viewZoneId = changeAccessor.addZone({
                        afterLineNumber: 3,
                        heightInLines: 3,
                        domNode: domNode
            });
    });

    // Add a content widget (scrolls inline with text)
    var contentWidget = {
        domNode: null,
        getId: function() {
            return 'my.content.widget';
        },
        getDomNode: function() {
            if (!this.domNode) {
                this.domNode = document.createElement('div');
                this.domNode.innerHTML = 'My content widget';
                this.domNode.style.background = 'grey';
            }
            return this.domNode;
        },
        getPosition: function() {
            return {
                position: {
                    lineNumber: 7,
                    column: 8
                },
                preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.BELOW]
            };
        }
    };
    editor.addContentWidget(contentWidget);

    // Add an overlay widget
    var overlayWidget = {
        domNode: null,
        getId: function() {
            return 'my.overlay.widget';
        },
        getDomNode: function() {
            if (!this.domNode) {
                this.domNode = document.createElement('div');
                this.domNode.innerHTML = 'My overlay widget';
                this.domNode.style.background = 'grey';
                this.domNode.style.right = '30px';
                this.domNode.style.top = '50px';
            }
            return this.domNode;
        },
        getPosition: function() {
            return null;
        }
    };
    editor.addOverlayWidget(overlayWidget);

    var output = document.getElementById('output');
    function showEvent(str) {
        while(output.childNodes.length > 10) {
            output.removeChild(output.firstChild.nextSibling.nextSibling);
        }
        output.appendChild(document.createTextNode(str));
        output.appendChild(document.createElement('br'));
    }


    var sendCursor=false;
	editor.onDidChangeCursorPosition(function(e){
    	showEvent('cursor change - ' + e.position + e.reason);

        if(e.reason!==0||sendCursor){
            socket.emit('cursor', socket.io.engine.id + ' ' + e.position.lineNumber + ' ' + e.position.column);
            sendCursor=false;
	    }
    });

    var sendContent = true;
    editor.onDidChangeModelContent(function(e){
        if(sendContent){
            showEvent('content change: '+ e.range + ' ' + e.rangeLength + ' ' + e.text);
            sendCursor=true;
            //if(e.rangeLength!==0)
            socket.emit('content', e.range.startLineNumber + ' ' + e.range.startColumn + ' ' + e.rangeLength + ' ' + e.text);
            
  
        }
    });

/*
    editor.onMouseUp(function(e){
       $('.object').remove();
       var str= $('#name').text();
       var cur= $('<div/>',{
           'class': 'object',
           'css':{'top':$(".cursor").position().top-15, 'left':$(".cursor").position().left}
       });
       $(".cursors-layer").append(cur);
     
       $(".object").text(str);
       $(".object").fadeOut(1000); //need to change the value to adjust the blinking name
     });
   //cursor_nickname combined above
*/

    socket.on('cursor', function(msg){
        var data=msg.toString().split(' ');
        showEvent('remote cursor change - ' + msg);
        //console.log($('#'+data[0]));
        var y = $("[lineNumber="+data[1]+"]").position().top;
        var x = Math.round((parseInt(data[2]))*7.2175-7.5965);
        if($('#'+data[0]).length===0){
            showEvent('creating cursor');
            create_cursor(data[0], y, x);
        }
        else{
            $('#'+data[0]).css('top', y);
            $('#'+data[0]).css('left', x);
        }
        $('#'+data[0]+'label').remove();
        var str= data[3];

	var color_store=data[4];
        var cur= $('<div/>',{
               'class': 'object',
               'id': data[0] + 'label',
            'css':{'top': y-15, 'left': x,  'background-color': data[4]},
               'text':data[3]
           });
           $(".cursors-layer").append(cur);
           //$(".object").text(data[3]);
           $('#'+data[0]+'label').fadeOut(1000); 

    });

    socket.on('current user', function(current){
        showEvent('current user: '+ current);
    });

    socket.on('content', function(msg){
        showEvent('remote content change - ' + msg);
        data=msg.split(' ');
        old_pos=editor.getPosition();
        sendContent=false;
        editor.setPosition({lineNumber: parseInt(data[0]), column: parseInt(data[1])});

        for(var i=0; i<parseInt(data[2]); i++){
            editor.trigger('keyboard', 'deleteRight', 0);
        }

        var addition = data.splice(3, data.length).join(' ');
        editor.trigger('keyboard', 'type', {text: addition});
        editor.setPosition(old_pos);
        sendContent=true;

    })
   
	
	socket.on('new-user', function(msg){
		showEvent("new user: " + msg);
        create_cursor(msg, 0, 0);
	});

    socket.on('user-exit', function(msg){
        $('#'+msg).remove();   //remove cursor
	$('#'+msg+'label').remove();  //remove label
    });

    socket.on('request-content', function(msg){
        //showEvent('content requested');
        console.log('content requested');
        socket.emit('reply-content', editor.getValue());
    });


}		

function create_cursor(user_id, y, x){
    $(".cursors-layer").append($('<div/>', {
        'class': 'other-cursor',
        'id': user_id,
        'css': {
            'background-color': 'Green',
            'top': y,
            'left': x
        }
    }));
}


