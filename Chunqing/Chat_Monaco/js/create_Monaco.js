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
require(['vs/editor/editor.main'], function() {
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
        while(output.childNodes.length > 6) {
            output.removeChild(output.firstChild.nextSibling.nextSibling);
        }
        output.appendChild(document.createTextNode(str));
        output.appendChild(document.createElement('br'));
    }



    editor.onMouseMove(function (e) {
        showEvent('mousemove - ' + e.target.position.lineNumber + ', ' + e.target.position.column);
    });
    editor.onMouseDown(function (e) {
		var y = e.target.position.lineNumber;
		var x = e.target.position.column;
        showEvent('mousedown - '  + y + ', ' + x);
		socket.emit('chat message', y + ', ' + x); 
    });
    editor.onContextMenu(function (e) {
        showEvent('contextmenu - ' +  + e.target.position.lineNumber + ', ' + e.target.position.column);
    });
    editor.onMouseLeave(function (e) {
        showEvent('mouseleave');
    });


});
