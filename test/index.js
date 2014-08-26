var test = require('tape');
var fs   = require('fs');
var path = require('path');

var parse = require('../');

test('throws errors using invalid params', function(is) {
  is.plan(4);

  is.throws(parse, 'throws without params');
  is.throws(function() {
    parse('');
  }, 'throws without object name');
  is.throws(function() {
    parse('has-dash');
  }, 'throws if object name has dashes');
  is.throws(function() {
    parse('test');
  }, 'throws without ocss');
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
