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

var users={}; // dictionary: key: id, value: nickname

require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], editor_function);

function editor_function() {
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
        while(output.childNodes.length > 6) {
            output.removeChild(output.firstChild.nextSibling.nextSibling);
        }
        output.appendChild(document.createTextNode(str));
        output.appendChild(document.createElement('br'));
    }


	editor.onDidChangeCursorPosition(function(e){
    	showEvent('cursor change - ' + e.position);
		socket.emit('cursor', socket.io.engine.id + ' ' + $('.cursor').position().top + ' ' + $('.cursor').position().left);
	});
	/*

    editor.onMouseMove(function (e) {
        showEvent('mousemove - ' + e.target.position.lineNumber + ', ' + e.target.position.column);
    });

	
	editor.onKeyUp(function(e){
        showEvent('keyup - '  + editor.getPosition());
		socket.emit('cursor', editor.getPosition().lineNumber + ' ' + editor.getPosition().column); 
	});
	
    editor.onMouseDown(function(e){
        showEvent('mousedown - '  + e.target.position);
		socket.emit('cursor', e.target.position.lineNumber + ' ' + e.target.position.column); 
	});
    editor.onContextMenu(function (e) {
        showEvent('contextmenu - ' + e.target.position);
    });
    editor.onMouseLeave(function (e) {
        showEvent('mouseleave');
    });
	*/



    //cursor_nickname combined code below
    editor.onMouseUp(function(e){
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


    
    var myCondition1 = editor.createContextKey('myCondition1', true);
	editor.addCommand(monaco.KeyCode.KEY_Q, function(){
    	editor.trigger('mouse','createCursor',{
        	position: { lineNumber: 1, column: 1},
        	viewPosition: editor.getPosition(),
        	wholeLine: false
		});
	}, 'myCondition1');
	
	
	socket.on('cursor', function(msg){
		var data=msg.toString().split(' ');
		if(data[0]!==socket.io.engine.id){
			showEvent('remote cursor change - ' + msg);
			$('#'+data[0]).css('top', parseInt(data[1]));
			$('#'+data[0]).css('left', parseInt(data[2]));
		}
    });
	
	socket.on('new-user', function(msg){
		showEvent("new user: " + msg);
		users[msg]='';
		$(".cursors-layer").append($('<div/>', {
			'class': 'other-cursor',
			'id': msg,
			'css': {
				'background-color': 'Green',
				'top': 0,
				'left': 0
			}
		}));
	});
}			  
