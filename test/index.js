var test = require('tape');
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

test('AST', function(is) {
  is.plan(2);

  var ast = parse('test', '');
  var desired = {
    type: 'object',
    name: 'test',
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(ast, desired, 'empty AST for empty string');

  ast = parse('test', '\n');
  desired = {
    type: 'object',
    name: 'test',
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(ast, desired, 'empty AST for empty lines');
});
