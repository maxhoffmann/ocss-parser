var ocss = require('ocss-parser');
var codemirror = require('codemirror');
require('codemirror/mode/sass/sass');
require('codemirror/mode/css/css');
require('codemirror/mode/javascript/javascript');

var filenameElement = document.querySelector('.header-filename');
var inputElement = document.querySelector('.editor-input');
var outputElements = {
  'css': document.querySelector('.editor-output_css'),
  'ast': document.querySelector('.editor-output_ast')
};
var tabsElement = document.querySelector('.header-output_tabs');
var statusElement = document.querySelector('.status');

var filename = filenameElement.value;

filenameElement.addEventListener('input', function(event) {
  filename = event.currentTarget.value;
  updateOutputs(filename, input.getValue());
}, false);

var input = codemirror.fromTextArea(inputElement, {
  lineNumbers: true,
  mode: 'sass',
  theme: 'base16-dark',
  autofocus: true,
  tabSize: 2,
  indentWithTabs: true
});

var cssOutput = codemirror.fromTextArea(outputElements.css, {
  lineNumbers: true,
  mode: 'css',
  theme: 'base16-light',
  readOnly: true,
  tabSize: 2
});

var astOutput = codemirror.fromTextArea(outputElements.ast, {
  mode: 'none',
  theme: 'base16-light',
  readOnly: true,
  tabSize: 2
});

updateOutputs(filename, input.getValue());
outputElements.ast.nextElementSibling.classList.add('CodeMirror--hidden');

input.on('change', function(event) {
  updateOutputs(filename, event.getValue());
});

tabsElement.addEventListener('click', toggleOutput, false);

function updateOutputs(filename, input) {
  try {
    var ast = ocss.parse(filename, input);
    astOutput.setValue(JSON.stringify(ast, null, 2));
    cssOutput.setValue(ocss.stringify(ast));
    statusElement.classList.add('status--valid');
    statusElement.classList.remove('status--invalid');
    statusElement.innerHTML = '\u2713 No errors';
  } catch(e) {
    statusElement.classList.remove('status--valid');
    statusElement.classList.add('status--invalid');
    statusElement.innerHTML = '&times; Error: '+e.message;
  }
}

function toggleOutput(event) {
  event.preventDefault();
  [].slice.call(event.target.parentElement.children).forEach(function(element) {
    if (element === event.target) {
      element.classList.add('header-output_tabs-tab--active');
      element.classList.remove('header-output_tabs-tab--inactive');
    } else {
      element.classList.remove('header-output_tabs-tab--active');
      element.classList.add('header-output_tabs-tab--inactive');
    }
  });
  Object.keys(outputElements).forEach(function(output) {
    if ( outputElements[output].className.slice(-3) === event.target.getAttribute('href').slice(1)) {
      outputElements[output].nextElementSibling.classList.remove('CodeMirror--hidden');
    } else {
      outputElements[output].nextElementSibling.classList.add('CodeMirror--hidden');
    }
  });
}
