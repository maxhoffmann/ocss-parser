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
    indentation: -1,
    declarations: [{
      position: {
        line: 2
      },
      indentation: 0,
      type: 'declaration',
      property: 'display',
      value: 'block',
      raw: 'display: block'
    }]
  };
  is.same(actual, expected, 'skips comments');
});

test.only('AST', function(is) {
  is.plan(7);

  var actual = parse('test', '');
  var expected = {
    type: 'object',
    name: 'test',
    indentation: -1
  };
  is.same(actual, expected, 'empty AST for empty string');

  actual = parse('test', '\n');
  expected = {
    type: 'object',
    name: 'test',
    indentation: -1
  };
  is.same(actual, expected, 'empty AST for empty lines');

  actual = parse('test', 'display: block');
  expected = {
    type: 'object',
    name: 'test',
    indentation: -1,
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block',
      raw: 'display: block',
      indentation: 0,
      position: {
        line: 1
      }
    }]
  };
  is.same(actual, expected, 'adds declaration');

  actual = parse('test', 'display: block\ncolor: red');
  expected = {
    type: 'object',
    name: 'test',
    indentation: -1,
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block',
      position: {
        line: 1
      },
      indentation: 0,
      raw: 'display: block'
    },
    {
      type: 'declaration',
      property: 'color',
      value: 'red',
      position: {
        line: 2
      },
      indentation: 0,
      raw: 'color: red'
    }]
  };
  is.same(actual, expected, 'adds declarations');

  actual = parse('test', 'display: block\ncolor: red\nchild');
  expected = {
    type: 'object',
    name: 'test',
    indentation: -1,
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block',
      position: {
        line: 1
      },
      indentation: 0,
      raw: 'display: block'
    },
    {
      type: 'declaration',
      property: 'color',
      value: 'red',
      position: {
        line: 2
      },
      indentation: 0,
      raw: 'color: red'
    }],
    elements: [{
      type: 'element',
      name: 'child',
      position: {
        line: 3
      },
      indentation: 0,
      raw: 'child'
    }]
  };
  is.same(actual, expected, 'adds element without declarations');

  actual = parse('test', 'display: block\ncolor: red\nchild\n\tcolor: blue');
  expected = {
    type: 'object',
    name: 'test',
    indentation: -1,
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block',
      position: {
        line: 1
      },
      indentation: 0,
      raw: 'display: block'
    },
    {
      type: 'declaration',
      property: 'color',
      value: 'red',
      position: {
        line: 2
      },
      indentation: 0,
      raw: 'color: red'
    }],
    elements: [{
      type: 'element',
      name: 'child',
      position: {
        line: 3
      },
      indentation: 0,
      raw: 'child',
      declarations: [{
        type: 'declaration',
        property: 'color',
        value: 'blue',
        position: {
          line: 4
        },
        indentation: 1,
        raw: 'color: blue'
      }]
    }]
  };
  is.same(actual, expected, 'adds element with declaration');

  actual = parse('test', 'display: block\ncolor: red\nchild\n\tcolor: blue\n\tbackground: transparant');
  expected = {
    type: 'object',
    name: 'test',
    indentation: -1,
    declarations: [{
      type: 'declaration',
      property: 'display',
      value: 'block',
      position: {
        line: 1
      },
      indentation: 0,
      raw: 'display: block'
    },
    {
      type: 'declaration',
      property: 'color',
      value: 'red',
      position: {
        line: 2
      },
      indentation: 0,
      raw: 'color: red'
    }],
    elements: [{
      type: 'element',
      name: 'child',
      position: {
        line: 3
      },
      indentation: 0,
      raw: 'child',
      declarations: [{
        type: 'declaration',
        property: 'color',
        value: 'blue',
        position: {
          line: 4
        },
        indentation: 1,
        raw: 'color: blue'
      },{
        type: 'declaration',
        property: 'background',
        value: 'transparant',
        position: {
          line: 5
        },
        indentation: 1,
        raw: 'background: transparant'
      }]
    }]
  };
  is.same(actual, expected, 'adds element with declarations');
});
