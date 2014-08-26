module.exports = function(name, ocss) {
  validate(arguments);

  function validate(args) {
    var name = args[0];
    var ocss = args[1];

    if ( ! name) throw new Error('missing object name param');
    if (/-/.test(name)) throw new Error('dashes are not allowed in object names');

    if (typeof ocss !== 'string') throw new Error('missing ocss param');
  }

  function removeComments(line) {
    return line.replace(/#.*$/, '');
  }

  function toObjects(line, linenum) {
    return {
      raw: line.trim(),
      linenum: linenum+1
    };
  }

  function isNotEmpty(line) {
    return ! /^\s*$/.test(line.raw);
  }

  function addIndentation(line) {
    line.indentation = line.raw.match(/^\s*/)[0].length;
    line.raw = line.raw.replace(/^\s+/, '');
    return line;
  }

  function addType(line) {
    line.type = type(line.raw, line.linenum);
    return line;
  }

  function type(string, linenum) {
    if (isElement(string)) return 'element';
    if (isDeclaration(string)) return 'declaration';

    throw new Error('Syntax error on line '+linenum+': '+string);
  }

  function isElement(string) {
    return /^[A-z]+$/.test(string);
  }

  function isDeclaration(string) {
    return /^\s*([A-z-]+):\s*([A-z\-]+)\s*$/.test(string);
  }

  function parseType(line) {
    return parse[line.type](line);
  }

  function toAST(context, line, index, lines) {
    if (index === lines.length-1) return line;
    var ast = lines[lines.length-1];
    if (!line.indentation) {
      context = ast;
      if (line.type === 'declaration') context = ast.elements[0];
    }
    context = context[line.type+'s'];
    delete line.indentation;
    delete line.linenum;
    delete line.raw;
    context.push(line);
    return context;
  }

  var parse = {};

  parse.object = function(name) {
    return {
      type: 'object',
      name: name,
      variables: [],
      elements: [parse.element({raw: name})],
      modifiers: [],
      parentModifiers: []
    };
  };

  parse.element = function(line) {
    line.type = line.type || 'element';
    line.name = line.raw;
    line.declarations = [];
    line.elements = [];
    delete line.raw;

    return line;
  };

  parse.declaration = function(line) {
    var values = line.raw.match(/^(.+):\s*(.+)$/);

    line.property = values[1];
    line.value = values[2];

    return line;
  };

  var object = parse.object(name);

  return ocss
    .split('\n')
    .map(removeComments)
    .map(toObjects)
    .filter(isNotEmpty)
    .map(addIndentation)
    .map(addType)
    .map(parseType)
    .concat(object)
    .reduce(toAST, object);
};
