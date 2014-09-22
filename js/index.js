var t;
var o = require('observable');
var h = require('hyperscript');
var ocss = require('ocss-parser');

document.body.appendChild(
  h('div',
    t = h('textarea.in', '', { autofocus: true }),
    h('pre.out', o.transform(o.input(t), function(txt) {
      try { return ocss.stringify(ocss.parse('object', txt)); }
      catch(e) { return e; }
    }))
  )
);
