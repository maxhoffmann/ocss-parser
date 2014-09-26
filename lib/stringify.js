module.exports = function stringify(node, parent) {
  node.parent = parent;

  var css = '';

  if ('declarations' in node) {
    css += selector(node, parent);
    css += openBrackets();
    css += declarations(node);
    css += closeBrackets();
  }

  css += walk('elements', node);
  css += walk('pseudoelements', node);
  css += walk('modifiers', node);

  function walk(type, node) {
    if (! node[type]) return '';
    return node[type].map(function(element) {
      return stringify(element, node);
    }).join('');
  }

  return css;
};

function selector(node, parent) {
  if (!parent)
    return '.'+node.name;

  if (node.type === 'modifier')
    return selector(parent, parent.parent) + '--' + node.name;

  if (node.type === 'pseudoelement')
    return selector(parent, parent.parent) + ':' + node.name;

  if (parent.type === 'pseudoelement')
    return selector(parent, parent.parent) + ' .' + root(node).name + '-' + node.name;

  if (parent.type === 'modifier')
    return selector(parent, parent.parent) + ' .' + root(node).name + '-' + node.name;

  return selector(parent, parent.parent) + '-' + node.name;
}

function root(node) {
  if (!node.parent)
    return node;
  return root(node.parent);
}

function declarations(node) {
  return node.declarations.map(function(declaration) {
    return '\t'+declaration.property+': '+declaration.value+';\n';
  }).join('');
}

function openBrackets() {
  return ' {\n';
}

function closeBrackets() {
  return '}\n';
}
