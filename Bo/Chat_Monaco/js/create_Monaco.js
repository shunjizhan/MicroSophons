var default_content = [
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
    var jsCode;
    if(content!==''){
        jsCode=content;
    }
    else{
        jsCode=default_content;
    }
    all_content[0]=jsCode;
    var editor = monaco.editor.create(document.getElementById('container0'), {
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

    //setup_editor(editor);


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
        var filename = file.name;
        var split_name = filename.split('.');
        var extension = split_name[split_name.length-1];
        console.log(extension);
        var type = get_type(extension);
        console.log(type);
        var reader = new FileReader();
        reader.readAsText(file);
        sendContent=false;
        reader.onload = function(f){
            editor.setModel(monaco.editor.createModel(f.target.result, type));
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

    $('#new-tab').on('click', function(){

        all_content[content_index]=editor.getValue();
        all_content.push(default_content);
        content_index=all_content.length-1;
        var new_li = $('<li/>',{
            'id': 'tab-' + content_index,
            'class': 'tab',
            'text': 'default_' + content_index + '.js',
            'css': {'background-color': 'Yellow'}
        });
        new_li.on('click', function(){
            console.log('tab clicked!');
            var id = parseInt($(this).attr('id').split('-')[1]);
            console.log(id);
            if(id!==content_index){
                $('#tab-' + content_index).css('background-color', 'White');
                all_content[content_index]=editor.getValue();
                content_index = id;
                $('#tab-' + content_index).css('background-color', 'Yellow');
                console.log(content_index);
                content = all_content[content_index];
                editor.setValue(content);
            }
        });
        $('.tab-bar').append(new_li);

        /*
        var new_a = $('<button/>', {
            'id': 'tab-' + (all_content.length-1),
            'class': 'tab',
            'text': 'default_' + (all_content.length-1) + '.js'
        });
        new_li.append(new_a);
        */


        content = all_content[content_index];
        editor.setValue(content);
    })

    $('.tab').on('click',function(){
        console.log('tab clicked!');
        var id = parseInt($(this).attr('id').split('-')[1]);
        console.log(id);
        if(id!==content_index){
            $('#tab-' + content_index).css('background-color', 'White');
            all_content[content_index]=editor.getValue();
            content_index = id;
            $('#tab-' + content_index).css('background-color', 'Yellow');
            console.log(content_index);
            content = all_content[content_index];
            editor.setValue(content);
        }
    })

    socket.on('new-file', function(msg){
        sendContent=false;
        editor.setValue(msg);
        sendContent=true;
    });

}		


function setup_editor(editor){

    
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

function get_type(extension){
    switch(extension){
        case 'js':
            return 'javascript';
        case 'py':
            return 'python';
        case 'java':
            return 'java';
        case 'cpp':
            return 'cpp';
        case 'c':
            return 'c';
        case 'h':
            return 'c';
        case 'hpp':
            return 'cpp';
        case 'txt':
            return 'plaintext';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'ts':
            return 'typescript';
        case 'cs':
            return 'csharp';
        case 'xml':
            return 'xml';
        case 'swift':
            return 'swift';
        case 'm':
            return 'objective-c';
        default:
            return 'plaintext';

    }
}


