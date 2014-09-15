module.exports = function stringify(node, parent) {
  node.parent = parent;

  var css = '';

  if ('declarations' in node) {
    css += selector(node, parent);
    css += openBrackets();
    css += declarations(node);
    css += closeBrackets();
  }

  if ('elements' in node) {
    css += node.elements.map(function(element) {
      return stringify(element, node);
    }).join('');
  }

  if ('pseudoelements' in node) {
    css += node.pseudoelements.map(function(element) {
      return stringify(element, node);
    }).join('');
  }

  if ('modifiers' in node) {
    css += node.modifiers.map(function(element) {
      return stringify(element, node);
    }).join('');
  }

  return css;
};

function selector(node, parent) {
  if (!parent)
    return '.'+node.name;

  if (node.type === 'modifier')
    return selector(parent, parent.parent)+selector(parent, parent.parent) + '--' + node.name + ',\n'
      +selector(parent, parent.parent) + '--' + node.name + ' ' + selector(parent, parent.parent);

  if (node.type === 'pseudoelement')
    return selector(parent, parent.parent) + ':' + node.name;

  if (parent.type === 'pseudoelement')
    return selector(parent, parent.parent) + ' .' + root(node).name + '-' + node.name;

  if (parent.type === 'modifier')
    return '.'+root(node).name+'--'+parent.name + ' .' + root(node).name + '-' + node.name;

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
