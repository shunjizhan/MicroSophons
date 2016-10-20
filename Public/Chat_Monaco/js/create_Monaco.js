
    require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
      var editor = monaco.editor.create(document.getElementById('container'), {
        value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
        ].join('\n'),
        language: 'javascript'
      });
    });
