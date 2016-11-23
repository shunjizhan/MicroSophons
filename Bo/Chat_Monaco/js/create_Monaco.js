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
            socket.emit('cursor', { 
                id: socket.io.engine.id,
                lineNumber: e.position.lineNumber,
                column: e.position.column});
            sendCursor=false;
	    }
    });

    var sendContent = true;
    editor.onDidChangeModelContent(function(e){
        if(sendContent){
            showEvent('content change: '+ e.range + ' ' + e.rangeLength + ' ' + e.text);
            sendCursor=true;
            //if(e.rangeLength!==0)
            socket.emit('content', {range: e.range, text: e.text});            
  
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

    socket.on('current user', function(current){
        showEvent('current user: '+ current);
    });

    socket.on('content', function(msg){
        showEvent('remote content change - ' + msg);

        sendContent=false;
        editor.executeEdits('keyboard', [{
            identifier: {major: 0, minor: 0},
            range: monaco.Range.lift(msg.range),
            text: msg.text,
            forceMoveMarkers: false,
            isAutoWhitespaceEdit: false
        }]);
        
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


