module.exports = function(name, ocss) {
  validate(arguments);

  var ast = object(name);

  return ocss
    .split('\n')
    .reduce(function(context, line, linenum, rules) {
      return context;
    }, ast);

  function validate(args) {
    var name = args[0];
    var ocss = args[1];

    if ( ! name) throw new Error('missing object name param');
    if ( /-/.test(name)) throw new Error('dashes are not allowed in object names');

    if (typeof ocss !== 'string') throw new Error('missing ocss param');
  }

  function empty(string) {
    return !/^\s*$/.test(string);
  }

  function comment(string) {
    return !/^#/.test(string);
  }

  function notIndented(string) {
    return !/^\s/.test(string);
  }

  function object(name) {
    return {
      type: 'object',
      name: name,
      variables: [],
      elements: [],
      modifiers: [],
      parentModifiers: []
    };
  }

};
