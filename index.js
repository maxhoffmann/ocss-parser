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

  function toAST(previous, current, index, lines) {

    if (index === lines.length-1) return current;

    if (current.indentation > previous.indentation+1) throw new Error('wrong indentation');

    if (current.indentation < previous.indentation ) {
      var diff = (previous.indentation-current.indentation)+1;
      addParent(current, getParent(diff, previous));
    } else if (current.indentation === previous.indentation+1) {
      addParent(current, previous);
    } else {
      addParent(current, previous.parent);
    }

    if (!current.parent[current.type+'s']) {
      current.parent[current.type+'s'] = [];
    }
    current.parent[current.type+'s'].push(current);

    return current;

    function getParent(nesting, previous) {
      for(var i = 0; i < nesting; i++) {
        previous = previous.parent;
      }
      return previous;
    }
  }

  var parse = {};

  parse.declaration = function(line) {
    var values = line.raw.match(/^(.+):\s*(.+)$/);

    line.property = values[1];
    line.value = values[2];

    return line;
  };

  function parseType(line) {
    if (parse[line.type]) {
      var parsedLine = parse[line.type](line);
    }
    return parsedLine;
  }

  function addParent(node, value) {
    Object.defineProperty(node, 'parent', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: value || null
    });
  }

  var object = {type: 'object', indentation: -1, name: name};

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
