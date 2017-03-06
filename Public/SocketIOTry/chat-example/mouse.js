var jsCode = [
	'"use strict";',
	'function Person(zixia) {',
	'	if (zixia) {',
	'		this.zixia = zixia;',
	'	}',
	'}',
	'Person.prototype.getZixia = function () {',
	'	return this.zixia;',
	'};'
].join('\n');

require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
  var editor = monaco.editor.create(document.getElementById('container_m'), {
        value: jsCode,
        language: "javascript",
        glyphMargin: true,
        nativeContextMenu: false,
        // theme: "vs-dark",
  });

    // var jsCode_ = 'cooooooooooooool';
    // editor.setValue(jsCode_);
	var decorations = editor.deltaDecorations([], [
		{
			range: new monaco.Range(3,1,5,1),
			options: {
				isWholeLine: true,
				value: "abc",
				className: 'myContentClass',
				glyphMarginClassName: 'myGlyphMarginClass'
			}
		}
	]);

	// Add a zone to make hit testing more interesting
	var viewZoneId = null;
	editor.changeViewZones(function(changeAccessor) {
			var domNode = document.createElement('div');
			domNode.style.background = 'white';
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
	// editor.addContentWidget(contentWidget);

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
				this.domNode.style.top = '60px';
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

	function simulateKeyPress(character) {
 	 jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
	}

    	// editor.onDidChangeContentPosition
	// editor.addEventListeneronKeyUp = k(e);

	// editor.onKeyUp(function (e){
	// 	showEvent('key on ' + editor.getPosition);
	// })
	// editor.onMouseMove(function (e) {
	// 	showEvent('mousemove - ' + e.target.toString());
	// });

	// editor.onContextMenu(function (e) {
	// 	showEvent('contextmenu - ' + e.target.toString());
	// });
	// editor.onMouseLeave(function (e) {
	// 	showEvent('mouseleave');
	// });

    	// socket.on('content', function(msg, e){

	// 	var jsCodePrime = jsCode.split('\n');

	// 	showEvent('this char is ' + msg + 'position is ' + e.position.lineNumber + ' ' + e.position.column + ' biu ' + jsCodePrime[e.position.lineNumber-1]);
	// 	var cor=msg.toString().split(' ');
	// 	// editor.Emitter.fire(e);

	// 	var insertCtt = jsCodePrime[e.position.lineNumber-1];
	// 	var txtAfterInsert = insertCtt.substr(0, e.position.column) + msg + insertCtt.substr(e.position.column);
	// 	jsCodePrime[e.position.lineNumber-1] = txtAfterInsert;
	// 	// showEvent('cool' + jsCodePrime[e.position.lineNumber-1]);
	// 	// var x = .substr(0, e.position.column) + "value" + str.substr(e.position.column);
	// 	jsCode = jsCodePrime.join('\n');

	// 	// showEvent('biebiue ' + y);
	// 	editor.setValue(jsCode);
	// 	// editor.setPosition(e.position.lineNumber, e.position.column+1);
	// 	// exit(1);
 //    });

	var sendCursor=false;

	editor.onDidChangeCursorPosition(function(e){

    	showEvent('cursor change - ' + e.position );

    	var s = editor.getModel().getWordAtPosition(e.position).word;
    	// var r = range: new monaco.Range(3,1,3,1)
    	var sr = editor.getModel().getValueInRange({startLineNumber: e.position.lineNumber, startColumn: e.position.column-1, endLineNumber: e.position.lineNumber, endColumn: e.position.column});
    	// var sr = editor.getModel().getValueInRange(monaco.Range(e.position.column, e.position.lineNumber, e.position.column, e.position.lineNumber));
		if(e.reason!==0||sendCursor){
            socket.emit('cursor', {
                id: socket.io.engine.id,
                lineNumber: e.position.lineNumber,
                column: e.position.column});
            sendCursor=false;
	    }
		// socket.emit('cursor', e.position.lineNumber + ' ' + e.position.column);
		// socket.emit('content', sr, e);
	});

    var sendContent = true;

    editor.onDidChangeModelContent(function(e){
        if(sendContent){
            showEvent('content change: '+ e.range + ' ' + e.rangeLength + ' ' + e.text);
            sendCursor=true;
            if(e.rangeLength===0){
                socket.emit('content', e.range.startLineNumber + ' ' + e.range.startColumn + ' ' + e.text);
            }
            else{
                socket.emit('content-delete', e.range.endLineNumber + ' ' + e.range.endColumn + ' ' + e.rangeLength);
            }
            //socket.emit('cursor', socket.io.engine.id + ' ' + e.range.endLineNumber + ' ' + e.range.endColumn);
        }
    });

	socket.on('cursor', function(msg){
		//var data=msg.toString().split(' ');
        showEvent('remote cursor change - ' + msg);
        //console.log($('#'+data[0]));
        var y = $("[lineNumber="+msg.lineNumber+"]").position().top;
        var x = Math.round((msg.column)*7.2175-7.5965);
        if($('#'+msg.id).length===0){
            showEvent('creating cursor');
            create_cursor(msg.id, y, x);
        }
        else{
            $('#'+msg.id).css('top', y);
            $('#'+msg.id).css('left', x);
        }
        $('#'+msg.id+'label').remove();

        var cur= $('<div/>',{
               'class': 'object',
               'id': msg.id + 'label',
            'css':{'top': y-15, 'left': x,  'background-color': msg.color},
               'text':msg.username
           });
           $(".cursors-layer").append(cur);
           //$(".object").text(data[3]);
           $('#'+msg.id+'label').fadeOut(1000);
    });

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


     socket.on('content', function(msg){
        showEvent('remote content change - ' + msg);
        data=msg.split(' ');
        old_pos=editor.getPosition();
        sendContent=false;
        editor.setPosition({lineNumber: parseInt(data[0]), column: parseInt(data[1])});
        if(data[2]=='')
            data[2]=' ';
        editor.trigger('keyboard', 'type', {text: data[2]});
        editor.setPosition(old_pos);
        sendContent=true;

    })
     socket.on('content-delete', function(msg){
        showEvent('remote content delete - ' + msg);
        data=msg.split(' ');
        old_pos=editor.getPosition();
        sendContent=false;
        editor.setPosition({lineNumber: parseInt(data[0]), column: parseInt(data[1])});
        for(var i=0; i<parseInt(data[2]); i++){
            editor.trigger('keyboard', 'deleteLeft', 0);
        }
        editor.setPosition(old_pos);
        sendContent=true;
    });


    socket.on('request-content', function(msg){
        //showEvent('content requested');
        console.log('content requested');
        socket.emit('reply-content', editor.getValue());
    });

    $("#file-upload").on('change', function(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        sendContent=false;
        reader.onload = function(f){
            editor.setValue(f.target.result);
            socket.emit("new-file", f.target.result);
        };
        sendContent=true;
    });

    $("#save-as").on('click',function(){
        var file_blob = new Blob([editor.getValue()], {type:'text/plaint'});
        var file_name = 'default.js';
        var downloadLink = document.createElement("a");
        downloadLink.download = file_name;
        downloadLink.innerHTML = "Download File";
        downloadLink.setAttribute("target", "_blank");
        if (window.webkitURL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(file_blob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(file_blob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    });

    socket.on('new-file', function(msg){
        sendContent=false;
        editor.setValue(msg);
        sendContent=true;
    });

    socket.on('current user', function(current){
        showEvent('current user: '+ current);
    });


	socket.on('new-user', function(msg){
		showEvent("new user: " + msg);
        create_cursor(msg, 0, 0);
	});

    socket.on('user-exit', function(msg){
        $('#'+msg).remove();   //remove cursor
	$('#'+msg+'label').remove();  //remove label
    });
});


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
