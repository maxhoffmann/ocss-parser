module.exports = function(name, ocss) {
  validate(arguments);

  var regex = {
    empty: /^\s*$/,
    comment: / ?#.*$/,
    indentation: /^\s*/,
    declaration: /^(.+)\s*:\s*(.+)$/,
    element: /^\w+$/,
    modifier: /^=\w+$/,
    parentmodifier: /^\^\w+$/,
  };

  return ocss
    .split('\n')
    .map(removeComments)
    .map(toObjects)
    .filter(isNotEmpty)
    .map(addIndentation)
    .map(addType)
    .reduce(toAST, object(name));

  function validate(args) {
    var name = args[0];
    var ocss = args[1];

    if ( ! name) throw new Error('missing object name param');
    if (/-/.test(name)) throw new Error('dashes are not allowed in object names');

    if (typeof ocss !== 'string') throw new Error('missing ocss param');
  }

  function removeComments(line) {
    return line.replace(regex.comment, '');
  }

  function toObjects(line, linenum) {
    var _line = {
      position: {
        line: linenum+1
      }
    };
    addNonEnumerable(_line, 'raw', line);
    return _line;
  }

  function isNotEmpty(line) {
    return ! regex.empty.test(line.raw);
  }

  function addIndentation(line) {
    addNonEnumerable(line, 'indentation', line.raw.match(regex.indentation)[0].length);
    line.raw = line.raw;
    return line;
  }

  function addType(line) {
    var string = line.raw.trim();
    if (regex.declaration.test(string))     return declaration(line);
    if (regex.element.test(string))         return element(line);
    if (regex.modifier.test(string))        return modifier(line);
    if (regex.parentmodifier.test(string))  return parentmodifier(line);

    error(line, 'unknown type');
  }

  function object(name) {
    var _object = {
      type: 'object',
      name: name
    };
    addNonEnumerable(_object, 'indentation', -1);
    return _object;
  }

  function declaration(line) {
    line.type = 'declaration';

    var values = line.raw.trim().match(regex.declaration);
    line.property = values[1];
    line.value = values[2];

    return line;
  }

  function element(line) {
    line.type = 'element';
    line.name = line.raw.trim();
    return line;
  }

  function modifier(line) {
    if (line.indentation > 0) error('nested modifier');
    line.type = 'modifier';
    line.name = line.raw.replace('=', '');
    return line;
  }

  function parentmodifier(line) {
    if (line.indentation > 0) error('nested parent modifier');
    line.type = 'parentmodifier';
    line.name = line.raw.replace('^', '');
    return line;
  }

  function toAST(previousLine, currentLine, index, lines) {
    if (currentLine.indentation > previousLine.indentation + 1) {
      error(currentLine, 'wrong indentation (nested at least one level too deep)');
    }
    if (previousLine.type === 'declaration' && previousLine.parent.type === 'object' &&
      currentLine.indentation > previousLine.indentation) {
      error(currentLine, 'wrong indentation (nesting under a declaration)');
    }

    var nesting = (previousLine.indentation-currentLine.indentation)+1;
    addNonEnumerable(currentLine, 'parent', getNestedParent(nesting, previousLine));
    var parent = currentLine.parent;

    if (!parent[currentLine.type+'s']) {
      parent[currentLine.type+'s'] = [];
    }
    parent[currentLine.type+'s'].push(currentLine);

    if (index === lines.length-1) {
      return lines[0].parent;
    }
    return currentLine;
  }

  function addNonEnumerable(node, property, value) {
    Object.defineProperty(node, property, {
      configurable: true,
      writable: true,
      enumerable: false,
      value: value
    });
  }

  function getNestedParent(nesting, node) {
    while(nesting--) {
      node = node.parent;
    }
    return node;
  }

  function error(line, message) {
    throw new Error('line '+line.position.line+': '+message+' `'+line.raw+'`');
  }

};
