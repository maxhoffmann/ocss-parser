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
    return line.replace(/ ?#.*$/, '');
  }

  function toObjects(line, linenum) {
    return {
      raw: line,
      position: {
        line: linenum+1
      }
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
    line.type = type(line.raw, line.position);
    return line;
  }

  function type(string, position) {
    if (isElement(string)) return 'element';
    if (isModifier(string)) return 'modifier';
    if (isParentModifier(string)) return 'parentmodifier';
    if (isDeclaration(string)) return 'declaration';

    throw new Error('Syntax error on line '+position.line+': '+string);
  }

  function isElement(string) {
    return /^\w+$/.test(string);
  }

  function isModifier(string) {
    return /^=\w+$/.test(string);
  }

  function isParentModifier(string) {
    return /^\^\w+$/.test(string);
  }

  function isDeclaration(string) {
    return /^\s*([A-z-]+):\s*([A-z\-]+)\s*$/.test(string);
  }

  var parse = {};

  parse.object = function(name) {
    return {
      type: 'object',
      name: name,
      indentation: -1
    };
  };

  parse.element = function(line) {
    line.name = line.raw.trim();
    return line;
  };

  parse.modifier = function(line) {
    line.name = line.raw.replace('=', '');
    return line;
  };

  parse.parentmodifier = function(line) {
    line.name = line.raw.replace('^', '');
    return line;
  };

  parse.declaration = function(line) {
    var values = line.raw.match(/^(.+):\s*(.+)$/);

    line.property = values[1];
    line.value = values[2];

    return line;
  };

  function toAST(previousLine, currentLine, index, lines) {
    if (currentLine.indentation > previousLine.indentation+1) {
      throw new Error('wrong indentation at line '+currentLine.position.line);
    }

    var nesting = (previousLine.indentation-currentLine.indentation)+1;
    var parent = addParent(currentLine, getNestedParent(nesting, previousLine));

    if (!parent[currentLine.type+'s']) {
      parent[currentLine.type+'s'] = [];
    }
    parent[currentLine.type+'s'].push(currentLine);

    if (index === lines.length-1) {
      return lines[0].parent;
    }
    return currentLine;
  }

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
    return node.parent;
  }

  function getNestedParent(nesting, node) {
    while(nesting--) {
      node = node.parent;
    }
    return node;
  }

  return ocss
    .split('\n')
    .map(removeComments)
    .map(toObjects)
    .filter(isNotEmpty)
    .map(addIndentation)
    .map(addType)
    .map(parseType)
    .reduce(toAST, parse.object(name));
};
