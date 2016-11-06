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
  var editor = monaco.editor.create(document.getElementById('container'), {
        value: jsCode,
        language: "javascript",
        glyphMargin: true,
        nativeContextMenu: false
  });

    // var jsCode_ = 'cooooooooooooool';
    // editor.setValue(jsCode_);
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
    	var s = editor.getModel().getWordAtPosition(e.position).word;
    	// var sr = editor.getModel().getValueInRange(range: new monaco.Range(2,8,2,2));
    	// var sr = editor.getModel().getValueInRange(monaco.Range(e.position.column, e.position.lineNumber, e.position.column, e.position.lineNumber));
		socket.emit('cursor', e.position.lineNumber + ' ' + e.position.column);
		socket.emit('content', s);
	});


	// editor.onMouseMove(function (e) {
	// 	showEvent('mousemove - ' + e.target.toString());
	// });
	// editor.onMouseDown(function (e) {
	// 	showEvent('mousedown - ' + e.target.toString());
	// });
	// editor.onContextMenu(function (e) {
	// 	showEvent('contextmenu - ' + e.target.toString());
	// });
	// editor.onMouseLeave(function (e) {
	// 	showEvent('mouseleave');
	// });

	socket.on('cursor', function(msg){
		showEvent('remote cursor change - ' + msg);
		var cor=msg.toString().split(' ');
		editor.setPosition({lineNumber: parseInt(cor[0]), column: parseInt(cor[1])});
    });

	socket.on('content', function(msg){
		showEvent('this word is ' + msg);
		// var cor=msg.toString().split(' ');
		// editor.setPosition({lineNumber: parseInt(cor[0]), column: parseInt(cor[1])});
		// editor.setValue(jsCode + msg);
    });



});
