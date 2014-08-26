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

test('comments', function(is) {
  is.plan(1);

  var actual = parse('test', '# Comment 1\ndisplay: block # Comment 2\n\t#asdas');
  var expected = {
    type: 'object',
    name: 'test',
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block'
    }],
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(actual, expected, 'skips comments');
});

test('AST', function(is) {
  is.plan(5);

  var actual = parse('test', '');
  var expected = {
    type: 'object',
    name: 'test',
    declarations: [],
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(actual, expected, 'empty AST for empty string');

  actual = parse('test', '\n');
  expected = {
    type: 'object',
    name: 'test',
    declarations: [],
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(actual, expected, 'empty AST for empty lines');

  actual = parse('test', 'display: block');
  expected = {
    type: 'object',
    name: 'test',
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block'
    }],
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(actual, expected, 'adds element with declaration');

  actual = parse('test', 'display: block\ncolor: red');
  expected = {
    type: 'object',
    name: 'test',
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block'
    },
    {
      type: 'declaration',
      property: 'color',
      value: 'red'
    }],
    elements: [],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(actual, expected, 'adds element with declarations');

  actual = parse('test', 'display: block\ncolor: red\nchild');
  expected = {
    type: 'object',
    name: 'test',
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block'
    },
    {
      type: 'declaration',
      property: 'color',
      value: 'red'
    }],
    elements: [{
      type: 'element',
      name: 'child',
      declarations: [],
      elements: []
    }],
    modifiers: [],
    parentModifiers: [],
    variables: []
  };
  is.same(actual, expected, 'adds element without declaration');
});
