var ocss = require('ocss-parser');
var codemirror = require('codemirror');
require('codemirror/mode/sass/sass');
require('codemirror/mode/css/css');

var inputElement = document.querySelector('textarea.input');
var outputElement = document.querySelector('textarea.output');

var input = codemirror.fromTextArea(inputElement, {
  lineNumbers: true,
  mode: 'sass',
  theme: 'base16-dark',
  autofocus: true,
  tabSize: 2,
  smartIndent: false
});

var output = codemirror.fromTextArea(outputElement, {
  lineNumbers: true,
  mode: 'css',
  theme: 'base16-light',
  readOnly: true,
  tabSize: 2
});

input.on('change', function(event) {
  try {
    var ast = ocss.parse('object', event.getValue());
    output.setValue(ocss.stringify(ast));
  } catch(e) {
    output.setValue(e.message);
  }
});

var ast = ocss.parse('object', inputElement.value);
output.setValue(ocss.stringify(ast));
