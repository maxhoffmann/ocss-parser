var t;
var o = require('observable');
var h = require('hyperscript');
var ocss = require('ocss-parser');

document.body.appendChild(
  h('div',
    t = h('textarea.in', '', { autofocus: true }),
    h('pre.out', o.transform(o.input(t), function(txt) {
      try { return JSON.stringify(ocss('OCSS_REPL', txt), null, 2); }
      catch(e) { return e; }
    }))
  )
);
