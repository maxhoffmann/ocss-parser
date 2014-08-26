module.exports = function(name, ocss) {
  validate(arguments);

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
    if (isElement(line.raw))        return element(line);
    if (isModifier(line.raw))       return modifier(line);
    if (isParentModifier(line.raw)) return parentmodifier(line);
    if (isDeclaration(line.raw))    return declaration(line);

    error(line, 'unknown type');
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

  function object(name) {
    return {
      type: 'object',
      name: name,
      indentation: -1
    };
  }

  function declaration(line) {
    line.type = 'declaration';

    var values = line.raw.match(/^(.+):\s*(.+)$/);
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
    line.type = 'modifier';
    line.name = line.raw.replace('=', '');
    return line;
  }

  function parentmodifier(line) {
    line.type = 'parentmodifier';
    line.name = line.raw.replace('^', '');
    return line;
  }

  function toAST(previousLine, currentLine, index, lines) {
    if (currentLine.indentation > previousLine.indentation + 1) {
      error(currentLine, 'wrong indentation (nested at least one level too deep)');
    }
    if (previousLine.type === 'declaration' &&
      currentLine.indentation > previousLine.indentation) {
      error(currentLine, 'wrong indentation (nesting under a declaration)');
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

  function error(line, message) {
    throw new Error('line '+line.position.line+': '+message+' `'+line.raw+'`');
  }

};
