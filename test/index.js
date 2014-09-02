var test = require('tape');
var fs   = require('fs');
var path = require('path');

var parse = require('../').parse;

test('params', function(is) {
  is.plan(4);

  is.throws(parse, 'throws without params');
  is.throws(function() {
    parse('');
  }, 'throws without object name');
  is.throws(function() {
    parse('invalid-name');
  }, 'throws if object name is invalid');
  is.throws(function() {
    parse('test');
  }, 'throws without ocss');
});

test('errors', function(is) {
  is.throws(function() {
    parse('test', 'element\n\t\tdisplay: block');
  }, 'too much indentation');

  is.throws(function() {
    parse('test', 'display: block\n\tcolor: red');
  }, 'indentation after declaration');

  is.throws(function() {
    parse('test', 'element\n\t=modifier');
  }, 'nested modifier');

  is.end();
});

var cases = fs.readdirSync(path.join(__dirname, 'cases'));

cases.forEach(function(name) {

  test(name, function(is) {
    var dir    = path.join(__dirname, 'cases', name);
    var source = path.join(dir, 'test.ocss');
    var ast    = path.join(dir, 'ast.json');

    var actual = parse('test', readFile(source));
    var expected = JSON.parse(readFile(ast));

    is.same(actual, expected, name);
    is.end();
  });

});

function readFile(file) {
  var src = fs.readFileSync(file, 'utf8');
  src = src.replace(/\r\n/, '\n'); // normalize line endings
  return src;
}
