(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/mhoffmann/Sites/ocss-parser/index.js":[function(require,module,exports){
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

},{"hyperscript":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/index.js","observable":"/Users/mhoffmann/Sites/ocss-parser/node_modules/observable/index.js","ocss-parser":"/Users/mhoffmann/Sites/ocss-parser/node_modules/ocss-parser/index.js"}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/index.js":[function(require,module,exports){
var split = require('browser-split')
var ClassList = require('class-list')
var DataSet = require('data-set')
require('html-element')

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        var m = split(string, /([\.#]?[a-zA-Z0-9_:-]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              if (e.addEventListener){
                e.addEventListener(k.substring(2), l[k], false)
                cleanupFuncs.push(function(){
                  e.removeEventListener(k.substring(2), l[k], false)
                })
              }else{
                e.attachEvent(k, l[k])
                cleanupFuncs.push(function(){
                  e.detachEvent(k, l[k])
                })
              }
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  e.style.setProperty(s, l[k][s])
              })(s, l[k][s])
            }
          } else if (k.substr(0, 5) === "data-") {
            DataSet(e)[k.substr(5)] = l[k]
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function isText (el) {
  return el && el.nodeName === '#text' && el.nodeType == 3
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

},{"browser-split":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/browser-split/index.js","class-list":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/class-list/index.js","data-set":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/index.js","html-element":"/Users/mhoffmann/Sites/ocss-parser/node_modules/watchify/node_modules/browserify/node_modules/browser-resolve/empty.js"}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/browser-split/index.js":[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/class-list/index.js":[function(require,module,exports){
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/class-list/node_modules/indexof/index.js"}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/class-list/node_modules/indexof/index.js":[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/index.js":[function(require,module,exports){
var Weakmap = require("weakmap")
var Individual = require("individual")

var datasetMap = Individual("__DATA_SET_WEAKMAP", Weakmap())

module.exports = DataSet

function DataSet(elem) {
    if (elem.dataset) {
        return elem.dataset
    }

    var hash = datasetMap.get(elem)

    if (!hash) {
        hash = createHash(elem)
        datasetMap.set(elem, hash)
    }

    return hash
}

function createHash(elem) {
    var attributes = elem.attributes
    var hash = {}

    if (attributes === null || attributes === undefined) {
        return hash
    }

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i]

        if (attr.name.substr(0,5) !== "data-") {
            continue
        }

        hash[attr.name.substr(5)] = attr.value
    }

    return hash
}

},{"individual":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/node_modules/individual/index.js","weakmap":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/node_modules/weakmap/weakmap.js"}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/node_modules/individual/index.js":[function(require,module,exports){
var root = require("global")

module.exports = Individual

function Individual(key, value) {
    if (root[key]) {
        return root[key]
    }

    Object.defineProperty(root, key, {
        value: value
        , configurable: true
    })

    return value
}

},{"global":"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/node_modules/individual/node_modules/global/index.js"}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/node_modules/individual/node_modules/global/index.js":[function(require,module,exports){
(function (global){
/*global window, global*/
if (typeof global !== "undefined") {
    module.exports = global
} else if (typeof window !== "undefined") {
    module.exports = window
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/hyperscript/node_modules/data-set/node_modules/weakmap/weakmap.js":[function(require,module,exports){
/* (The MIT License)
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included with all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
// Updated and bugfixed by Raynos @ https://gist.github.com/1638059
// Expanded by Benvie @ https://github.com/Benvie/harmony-collections

void function(global, undefined_, undefined){
  var getProps = Object.getOwnPropertyNames,
      defProp  = Object.defineProperty,
      toSource = Function.prototype.toString,
      create   = Object.create,
      hasOwn   = Object.prototype.hasOwnProperty,
      funcName = /^\n?function\s?(\w*)?_?\(/;


  function define(object, key, value){
    if (typeof key === 'function') {
      value = key;
      key = nameOf(value).replace(/_$/, '');
    }
    return defProp(object, key, { configurable: true, writable: true, value: value });
  }

  function nameOf(func){
    return typeof func !== 'function'
          ? '' : 'name' in func
          ? func.name : toSource.call(func).match(funcName)[1];
  }

  // ############
  // ### Data ###
  // ############

  var Data = (function(){
    var dataDesc = { value: { writable: true, value: undefined } },
        datalock = 'return function(k){if(k===s)return l}',
        uids     = create(null),

        createUID = function(){
          var key = Math.random().toString(36).slice(2);
          return key in uids ? createUID() : uids[key] = key;
        },

        globalID = createUID(),

        storage = function(obj){
          if (hasOwn.call(obj, globalID))
            return obj[globalID];

          if (!Object.isExtensible(obj))
            throw new TypeError("Object must be extensible");

          var store = create(null);
          defProp(obj, globalID, { value: store });
          return store;
        };

    // common per-object storage area made visible by patching getOwnPropertyNames'
    define(Object, function getOwnPropertyNames(obj){
      var props = getProps(obj);
      if (hasOwn.call(obj, globalID))
        props.splice(props.indexOf(globalID), 1);
      return props;
    });

    function Data(){
      var puid = createUID(),
          secret = {};

      this.unlock = function(obj){
        var store = storage(obj);
        if (hasOwn.call(store, puid))
          return store[puid](secret);

        var data = create(null, dataDesc);
        defProp(store, puid, {
          value: new Function('s', 'l', datalock)(secret, data)
        });
        return data;
      }
    }

    define(Data.prototype, function get(o){ return this.unlock(o).value });
    define(Data.prototype, function set(o, v){ this.unlock(o).value = v });

    return Data;
  }());


  var WM = (function(data){
    var validate = function(key){
      if (key == null || typeof key !== 'object' && typeof key !== 'function')
        throw new TypeError("Invalid WeakMap key");
    }

    var wrap = function(collection, value){
      var store = data.unlock(collection);
      if (store.value)
        throw new TypeError("Object is already a WeakMap");
      store.value = value;
    }

    var unwrap = function(collection){
      var storage = data.unlock(collection).value;
      if (!storage)
        throw new TypeError("WeakMap is not generic");
      return storage;
    }

    var initialize = function(weakmap, iterable){
      if (iterable !== null && typeof iterable === 'object' && typeof iterable.forEach === 'function') {
        iterable.forEach(function(item, i){
          if (item instanceof Array && item.length === 2)
            set.call(weakmap, iterable[i][0], iterable[i][1]);
        });
      }
    }


    function WeakMap(iterable){
      if (this === global || this == null || this === WeakMap.prototype)
        return new WeakMap(iterable);

      wrap(this, new Data);
      initialize(this, iterable);
    }

    function get(key){
      validate(key);
      var value = unwrap(this).get(key);
      return value === undefined_ ? undefined : value;
    }

    function set(key, value){
      validate(key);
      // store a token for explicit undefined so that "has" works correctly
      unwrap(this).set(key, value === undefined ? undefined_ : value);
    }

    function has(key){
      validate(key);
      return unwrap(this).get(key) !== undefined;
    }

    function delete_(key){
      validate(key);
      var data = unwrap(this),
          had = data.get(key) !== undefined;
      data.set(key, undefined);
      return had;
    }

    function toString(){
      unwrap(this);
      return '[object WeakMap]';
    }

    try {
      var src = ('return '+delete_).replace('e_', '\\u0065'),
          del = new Function('unwrap', 'validate', src)(unwrap, validate);
    } catch (e) {
      var del = delete_;
    }

    var src = (''+Object).split('Object');
    var stringifier = function toString(){
      return src[0] + nameOf(this) + src[1];
    };

    define(stringifier, stringifier);

    var prep = { __proto__: [] } instanceof Array
      ? function(f){ f.__proto__ = stringifier }
      : function(f){ define(f, stringifier) };

    prep(WeakMap);

    [toString, get, set, has, del].forEach(function(method){
      define(WeakMap.prototype, method);
      prep(method);
    });

    return WeakMap;
  }(new Data));

  var defaultCreator = Object.create
    ? function(){ return Object.create(null) }
    : function(){ return {} };

  function createStorage(creator){
    var weakmap = new WM;
    creator || (creator = defaultCreator);

    function storage(object, value){
      if (value || arguments.length === 2) {
        weakmap.set(object, value);
      } else {
        value = weakmap.get(object);
        if (value === undefined) {
          value = creator(object);
          weakmap.set(object, value);
        }
      }
      return value;
    }

    return storage;
  }


  if (typeof module !== 'undefined') {
    module.exports = WM;
  } else if (typeof exports !== 'undefined') {
    exports.WeakMap = WM;
  } else if (!('WeakMap' in global)) {
    global.WeakMap = WM;
  }

  WM.createStorage = createStorage;
  if (global.WeakMap)
    global.WeakMap.createStorage = createStorage;
}((0, eval)('this'));

},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/observable/index.js":[function(require,module,exports){
;(function () {

// bind a to b -- One Way Binding
function bind1(a, b) {
  a(b()); b(a)
}
//bind a to b and b to a -- Two Way Binding
function bind2(a, b) {
  b(a()); a(b); b(a);
}

//---util-funtions------

//check if this call is a get.
function isGet(val) {
  return undefined === val
}

//check if this call is a set, else, it's a listen
function isSet(val) {
  return 'function' !== typeof val
}

function isFunction (fun) {
  return 'function' === typeof fun
}

function assertObservable (observable) {
  if(!isFunction(observable))
    throw new Error('transform expects an observable')
  return observable
}

//trigger all listeners
function all(ary, val) {
  for(var k in ary)
    ary[k](val)
}

//remove a listener
function remove(ary, item) {
  delete ary[ary.indexOf(item)]
}

//register a listener
function on(emitter, event, listener) {
  (emitter.on || emitter.addEventListener)
    .call(emitter, event, listener, false)
}

function off(emitter, event, listener) {
  (emitter.removeListener || emitter.removeEventListener || emitter.off)
    .call(emitter, event, listener, false)
}

//An observable that stores a value.

function value (initialValue) {
  var _val = initialValue, listeners = []
  observable.set = function (val) {
    all(listeners, _val = val)
  }
  return observable

  function observable(val) {
    return (
      isGet(val) ? _val
    : isSet(val) ? all(listeners, _val = val)
    : (listeners.push(val), val(_val), function () {
        remove(listeners, val)
      })
  )}}
  //^ if written in this style, always ends )}}

/*
##property
observe a property of an object, works with scuttlebutt.
could change this to work with backbone Model - but it would become ugly.
*/

function property (model, key) {
  return function (val) {
    return (
      isGet(val) ? model.get(key) :
      isSet(val) ? model.set(key, val) :
      (on(model, 'change:'+key, val), val(model.get(key)), function () {
        off(model, 'change:'+key, val)
      })
    )}}

/*
note the use of the elvis operator `?:` in chained else-if formation,
and also the comma operator `,` which evaluates each part and then
returns the last value.

only 8 lines! that isn't much for what this baby can do!
*/

function transform (observable, down, up) {
  assertObservable(observable)
  return function (val) {
    return (
      isGet(val) ? down(observable())
    : isSet(val) ? observable((up || down)(val))
    : observable(function (_val) { val(down(_val)) })
    )}}

function not(observable) {
  return transform(observable, function (v) { return !v })
}

function listen (element, event, attr, listener) {
  function onEvent () {
    listener(isFunction(attr) ? attr() : element[attr])
  }
  on(element, event, onEvent)
  onEvent()
  return function () {
    off(element, event, onEvent)
  }
}

//observe html element - aliased as `input`
function attribute(element, attr, event) {
  attr = attr || 'value'; event = event || 'input'
  return function (val) {
    return (
      isGet(val) ? element[attr]
    : isSet(val) ? element[attr] = val
    : listen(element, event, attr, val)
    )}
}

// observe a select element
function select(element) {
  function _attr () {
      return element[element.selectedIndex].value;
  }
  function _set(val) {
    for(var i=0; i < element.options.length; i++) {
      if(element.options[i].value == val) element.selectedIndex = i;
    }
  }
  return function (val) {
    return (
      isGet(val) ? element.options[element.selectedIndex].value
    : isSet(val) ? _set(val)
    : listen(element, 'change', _attr, val)
    )}
}

//toggle based on an event, like mouseover, mouseout
function toggle (el, up, down) {
  var i = false
  return function (val) {
    function onUp() {
      i || val(i = true)
    }
    function onDown () {
      i && val(i = false)
    }
    return (
      isGet(val) ? i
    : isSet(val) ? undefined //read only
    : (on(el, up, onUp), on(el, down || up, onDown), val(i), function () {
      off(el, up, onUp); off(el, down || up, onDown)
    })
  )}}

function error (message) {
  throw new Error(message)
}

function compute (observables, compute) {
  var cur = observables.map(function (e) {
    return e()
  }), init = true

  var v = value()

  observables.forEach(function (f, i) {
    f(function (val) {
      cur[i] = val
      if(init) return
      v(compute.apply(null, cur))
    })
  })
  v(compute.apply(null, cur))
  init = false
  v(function () {
    compute.apply(null, cur)
  })

  return v
}

function boolean (observable, truthy, falsey) {
  return (
    transform(observable, function (val) {
      return val ? truthy : falsey
    }, function (val) {
      return val == truthy ? true : false
    })
  )
}

function signal () {
  var _val, listeners = []
  return function (val) {
    return (
      isGet(val) ? _val
        : isSet(val) ? (!(_val===val) ? all(listeners, _val = val):"")
        : (listeners.push(val), val(_val), function () {
           remove(listeners, val)
        })
    )}}

var exports = value
exports.bind1     = bind1
exports.bind2     = bind2
exports.value     = value
exports.not       = not
exports.property  = property
exports.input     =
exports.attribute = attribute
exports.select    = select
exports.compute   = compute
exports.transform = transform
exports.boolean   = boolean
exports.toggle    = toggle
exports.hover     = function (e) { return toggle(e, 'mouseover', 'mouseout')}
exports.focus     = function (e) { return toggle(e, 'focus', 'blur')}
exports.signal    = signal

if('object' === typeof module) module.exports = exports
else                           this.observable = exports
})()

},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/ocss-parser/index.js":[function(require,module,exports){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":"/Users/mhoffmann/Sites/ocss-parser/node_modules/ocss-parser/lib/parse.js","./lib/stringify":"/Users/mhoffmann/Sites/ocss-parser/node_modules/ocss-parser/lib/stringify.js"}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/ocss-parser/lib/parse.js":[function(require,module,exports){
module.exports = function parse(objectName, ocss) {

  var regex = {
    empty: /^\s*$/,
    comment: / ?\/\/.*$/,
    indentation: /^\s*/,
    object: /^\w+$/,
    declaration: /^(.+):(.+)$/,
    element: /^\w+$/,
    pseudoelement: /^:.+$/,
    modifier: /^=\w+$/
  };

  validate(objectName, ocss);

  return ocss
    .split('\n')
    .map(removeComments)
    .map(toObjects)
    .filter(isNotEmpty)
    .map(addIndentation)
    .map(addType)
    .reduce(toAST, object(objectName));

  function validate(objectName, ocss) {
    if ( ! objectName)
      throw new Error('missing object name param');

    if ( ! regex.object.test(objectName))
      throw new Error('object name may only contain letters and underscore');

    if (typeof ocss !== 'string')
      throw new Error('missing ocss param');
  }

  function removeComments(rawLine) {
    return rawLine.replace(regex.comment, '');
  }

  function toObjects(rawLine, linenum) {
    var line = {
      position: {
        line: linenum+1
      }
    };
    addNonEnumerable(line, 'raw', rawLine);
    return line;
  }

  function isNotEmpty(line) {
    return ! regex.empty.test(line.raw);
  }

  function addIndentation(line) {
    addNonEnumerable(line, 'indentation', line.raw.match(regex.indentation)[0].length);
    return line;
  }

  function addType(line) {
    var trimmedLine = line.raw.trim();
    if (regex.declaration.test(trimmedLine))     return declaration(line);
    if (regex.element.test(trimmedLine))         return element(line);
    if (regex.pseudoelement.test(trimmedLine))   return pseudoelement(line);
    if (regex.modifier.test(trimmedLine))        return modifier(line);

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

    var values = line.raw.match(regex.declaration);
    line.property = values[1].trim();
    line.value = values[2].trim();

    return line;
  }

  function element(line) {
    line.type = 'element';
    line.name = line.raw.trim();
    return line;
  }

  function pseudoelement(line) {
    line.type = 'pseudoelement';
    line.name = line.raw.replace(':', '').trim();
    return line;
  }

  function modifier(line) {
    if (line.indentation > 0) error(line, 'nested modifier');
    line.type = 'modifier';
    line.name = line.raw.replace('=', '');
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

},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/ocss-parser/lib/stringify.js":[function(require,module,exports){
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

},{}],"/Users/mhoffmann/Sites/ocss-parser/node_modules/watchify/node_modules/browserify/node_modules/browser-resolve/empty.js":[function(require,module,exports){

},{}]},{},["/Users/mhoffmann/Sites/ocss-parser/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taG9mZm1hbm4vU2l0ZXMvb2Nzcy1wYXJzZXIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWhvZmZtYW5uL1NpdGVzL29jc3MtcGFyc2VyL2luZGV4LmpzIiwiL1VzZXJzL21ob2ZmbWFubi9TaXRlcy9vY3NzLXBhcnNlci9ub2RlX21vZHVsZXMvaHlwZXJzY3JpcHQvaW5kZXguanMiLCIvVXNlcnMvbWhvZmZtYW5uL1NpdGVzL29jc3MtcGFyc2VyL25vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1zcGxpdC9pbmRleC5qcyIsIi9Vc2Vycy9taG9mZm1hbm4vU2l0ZXMvb2Nzcy1wYXJzZXIvbm9kZV9tb2R1bGVzL2h5cGVyc2NyaXB0L25vZGVfbW9kdWxlcy9jbGFzcy1saXN0L2luZGV4LmpzIiwiL1VzZXJzL21ob2ZmbWFubi9TaXRlcy9vY3NzLXBhcnNlci9ub2RlX21vZHVsZXMvaHlwZXJzY3JpcHQvbm9kZV9tb2R1bGVzL2NsYXNzLWxpc3Qvbm9kZV9tb2R1bGVzL2luZGV4b2YvaW5kZXguanMiLCIvVXNlcnMvbWhvZmZtYW5uL1NpdGVzL29jc3MtcGFyc2VyL25vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC9ub2RlX21vZHVsZXMvZGF0YS1zZXQvaW5kZXguanMiLCIvVXNlcnMvbWhvZmZtYW5uL1NpdGVzL29jc3MtcGFyc2VyL25vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC9ub2RlX21vZHVsZXMvZGF0YS1zZXQvbm9kZV9tb2R1bGVzL2luZGl2aWR1YWwvaW5kZXguanMiLCIvVXNlcnMvbWhvZmZtYW5uL1NpdGVzL29jc3MtcGFyc2VyL25vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC9ub2RlX21vZHVsZXMvZGF0YS1zZXQvbm9kZV9tb2R1bGVzL2luZGl2aWR1YWwvbm9kZV9tb2R1bGVzL2dsb2JhbC9pbmRleC5qcyIsIi9Vc2Vycy9taG9mZm1hbm4vU2l0ZXMvb2Nzcy1wYXJzZXIvbm9kZV9tb2R1bGVzL2h5cGVyc2NyaXB0L25vZGVfbW9kdWxlcy9kYXRhLXNldC9ub2RlX21vZHVsZXMvd2Vha21hcC93ZWFrbWFwLmpzIiwiL1VzZXJzL21ob2ZmbWFubi9TaXRlcy9vY3NzLXBhcnNlci9ub2RlX21vZHVsZXMvb2JzZXJ2YWJsZS9pbmRleC5qcyIsIi9Vc2Vycy9taG9mZm1hbm4vU2l0ZXMvb2Nzcy1wYXJzZXIvbm9kZV9tb2R1bGVzL29jc3MtcGFyc2VyL2luZGV4LmpzIiwiL1VzZXJzL21ob2ZmbWFubi9TaXRlcy9vY3NzLXBhcnNlci9ub2RlX21vZHVsZXMvb2Nzcy1wYXJzZXIvbGliL3BhcnNlLmpzIiwiL1VzZXJzL21ob2ZmbWFubi9TaXRlcy9vY3NzLXBhcnNlci9ub2RlX21vZHVsZXMvb2Nzcy1wYXJzZXIvbGliL3N0cmluZ2lmeS5qcyIsIi9Vc2Vycy9taG9mZm1hbm4vU2l0ZXMvb2Nzcy1wYXJzZXIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHQ7XG52YXIgbyA9IHJlcXVpcmUoJ29ic2VydmFibGUnKTtcbnZhciBoID0gcmVxdWlyZSgnaHlwZXJzY3JpcHQnKTtcbnZhciBvY3NzID0gcmVxdWlyZSgnb2Nzcy1wYXJzZXInKTtcblxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChcbiAgaCgnZGl2JyxcbiAgICB0ID0gaCgndGV4dGFyZWEuaW4nLCAnJywgeyBhdXRvZm9jdXM6IHRydWUgfSksXG4gICAgaCgncHJlLm91dCcsIG8udHJhbnNmb3JtKG8uaW5wdXQodCksIGZ1bmN0aW9uKHR4dCkge1xuICAgICAgdHJ5IHsgcmV0dXJuIG9jc3Muc3RyaW5naWZ5KG9jc3MucGFyc2UoJ29iamVjdCcsIHR4dCkpOyB9XG4gICAgICBjYXRjaChlKSB7IHJldHVybiBlOyB9XG4gICAgfSkpXG4gIClcbik7XG4iLCJ2YXIgc3BsaXQgPSByZXF1aXJlKCdicm93c2VyLXNwbGl0JylcbnZhciBDbGFzc0xpc3QgPSByZXF1aXJlKCdjbGFzcy1saXN0JylcbnZhciBEYXRhU2V0ID0gcmVxdWlyZSgnZGF0YS1zZXQnKVxucmVxdWlyZSgnaHRtbC1lbGVtZW50JylcblxuZnVuY3Rpb24gY29udGV4dCAoKSB7XG5cbiAgdmFyIGNsZWFudXBGdW5jcyA9IFtdXG5cbiAgZnVuY3Rpb24gaCgpIHtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwgZSA9IG51bGxcbiAgICBmdW5jdGlvbiBpdGVtIChsKSB7XG4gICAgICB2YXIgclxuICAgICAgZnVuY3Rpb24gcGFyc2VDbGFzcyAoc3RyaW5nKSB7XG4gICAgICAgIHZhciBtID0gc3BsaXQoc3RyaW5nLCAvKFtcXC4jXT9bYS16QS1aMC05XzotXSspLylcbiAgICAgICAgaWYoL15cXC58Iy8udGVzdChtWzFdKSlcbiAgICAgICAgICBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgZm9yRWFjaChtLCBmdW5jdGlvbiAodikge1xuICAgICAgICAgIHZhciBzID0gdi5zdWJzdHJpbmcoMSx2Lmxlbmd0aClcbiAgICAgICAgICBpZighdikgcmV0dXJuXG4gICAgICAgICAgaWYoIWUpXG4gICAgICAgICAgICBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh2KVxuICAgICAgICAgIGVsc2UgaWYgKHZbMF0gPT09ICcuJylcbiAgICAgICAgICAgIENsYXNzTGlzdChlKS5hZGQocylcbiAgICAgICAgICBlbHNlIGlmICh2WzBdID09PSAnIycpXG4gICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnaWQnLCBzKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZihsID09IG51bGwpXG4gICAgICAgIDtcbiAgICAgIGVsc2UgaWYoJ3N0cmluZycgPT09IHR5cGVvZiBsKSB7XG4gICAgICAgIGlmKCFlKVxuICAgICAgICAgIHBhcnNlQ2xhc3MobClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUuYXBwZW5kQ2hpbGQociA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGwpKVxuICAgICAgfVxuICAgICAgZWxzZSBpZignbnVtYmVyJyA9PT0gdHlwZW9mIGxcbiAgICAgICAgfHwgJ2Jvb2xlYW4nID09PSB0eXBlb2YgbFxuICAgICAgICB8fCBsIGluc3RhbmNlb2YgRGF0ZVxuICAgICAgICB8fCBsIGluc3RhbmNlb2YgUmVnRXhwICkge1xuICAgICAgICAgIGUuYXBwZW5kQ2hpbGQociA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGwudG9TdHJpbmcoKSkpXG4gICAgICB9XG4gICAgICAvL3RoZXJlIG1pZ2h0IGJlIGEgYmV0dGVyIHdheSB0byBoYW5kbGUgdGhpcy4uLlxuICAgICAgZWxzZSBpZiAoaXNBcnJheShsKSlcbiAgICAgICAgZm9yRWFjaChsLCBpdGVtKVxuICAgICAgZWxzZSBpZihpc05vZGUobCkpXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQociA9IGwpXG4gICAgICBlbHNlIGlmKGwgaW5zdGFuY2VvZiBUZXh0KVxuICAgICAgICBlLmFwcGVuZENoaWxkKHIgPSBsKVxuICAgICAgZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBsKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gbCkge1xuICAgICAgICAgIGlmKCdmdW5jdGlvbicgPT09IHR5cGVvZiBsW2tdKSB7XG4gICAgICAgICAgICBpZigvXm9uXFx3Ky8udGVzdChrKSkge1xuICAgICAgICAgICAgICBpZiAoZS5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgICAgICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoay5zdWJzdHJpbmcoMiksIGxba10sIGZhbHNlKVxuICAgICAgICAgICAgICAgIGNsZWFudXBGdW5jcy5wdXNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICBlLnJlbW92ZUV2ZW50TGlzdGVuZXIoay5zdWJzdHJpbmcoMiksIGxba10sIGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGUuYXR0YWNoRXZlbnQoaywgbFtrXSlcbiAgICAgICAgICAgICAgICBjbGVhbnVwRnVuY3MucHVzaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgZS5kZXRhY2hFdmVudChrLCBsW2tdKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmFibGVcbiAgICAgICAgICAgICAgZVtrXSA9IGxba10oKVxuICAgICAgICAgICAgICBjbGVhbnVwRnVuY3MucHVzaChsW2tdKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgZVtrXSA9IHZcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYoayA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgaWYoJ3N0cmluZycgPT09IHR5cGVvZiBsW2tdKSB7XG4gICAgICAgICAgICAgIGUuc3R5bGUuY3NzVGV4dCA9IGxba11cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBmb3IgKHZhciBzIGluIGxba10pIChmdW5jdGlvbihzLCB2KSB7XG4gICAgICAgICAgICAgICAgaWYoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHYpIHtcbiAgICAgICAgICAgICAgICAgIC8vIG9ic2VydmFibGVcbiAgICAgICAgICAgICAgICAgIGUuc3R5bGUuc2V0UHJvcGVydHkocywgdigpKVxuICAgICAgICAgICAgICAgICAgY2xlYW51cEZ1bmNzLnB1c2godihmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuc3R5bGUuc2V0UHJvcGVydHkocywgdmFsKVxuICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICBlLnN0eWxlLnNldFByb3BlcnR5KHMsIGxba11bc10pXG4gICAgICAgICAgICAgIH0pKHMsIGxba11bc10pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChrLnN1YnN0cigwLCA1KSA9PT0gXCJkYXRhLVwiKSB7XG4gICAgICAgICAgICBEYXRhU2V0KGUpW2suc3Vic3RyKDUpXSA9IGxba11cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZVtrXSA9IGxba11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGwpIHtcbiAgICAgICAgLy9hc3N1bWUgaXQncyBhbiBvYnNlcnZhYmxlIVxuICAgICAgICB2YXIgdiA9IGwoKVxuICAgICAgICBlLmFwcGVuZENoaWxkKHIgPSBpc05vZGUodikgPyB2IDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodikpXG5cbiAgICAgICAgY2xlYW51cEZ1bmNzLnB1c2gobChmdW5jdGlvbiAodikge1xuICAgICAgICAgIGlmKGlzTm9kZSh2KSAmJiByLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICByLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKHYsIHIpLCByID0gdlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHIudGV4dENvbnRlbnQgPSB2XG4gICAgICAgIH0pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gclxuICAgIH1cbiAgICB3aGlsZShhcmdzLmxlbmd0aClcbiAgICAgIGl0ZW0oYXJncy5zaGlmdCgpKVxuXG4gICAgcmV0dXJuIGVcbiAgfVxuXG4gIGguY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsZWFudXBGdW5jcy5sZW5ndGg7IGkrKyl7XG4gICAgICBjbGVhbnVwRnVuY3NbaV0oKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBoXG59XG5cbnZhciBoID0gbW9kdWxlLmV4cG9ydHMgPSBjb250ZXh0KClcbmguY29udGV4dCA9IGNvbnRleHRcblxuZnVuY3Rpb24gaXNOb2RlIChlbCkge1xuICByZXR1cm4gZWwgJiYgZWwubm9kZU5hbWUgJiYgZWwubm9kZVR5cGVcbn1cblxuZnVuY3Rpb24gaXNUZXh0IChlbCkge1xuICByZXR1cm4gZWwgJiYgZWwubm9kZU5hbWUgPT09ICcjdGV4dCcgJiYgZWwubm9kZVR5cGUgPT0gM1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoIChhcnIsIGZuKSB7XG4gIGlmIChhcnIuZm9yRWFjaCkgcmV0dXJuIGFyci5mb3JFYWNoKGZuKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgZm4oYXJyW2ldLCBpKVxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSdcbn1cbiIsIi8qIVxuICogQ3Jvc3MtQnJvd3NlciBTcGxpdCAxLjEuMVxuICogQ29weXJpZ2h0IDIwMDctMjAxMiBTdGV2ZW4gTGV2aXRoYW4gPHN0ZXZlbmxldml0aGFuLmNvbT5cbiAqIEF2YWlsYWJsZSB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqIEVDTUFTY3JpcHQgY29tcGxpYW50LCB1bmlmb3JtIGNyb3NzLWJyb3dzZXIgc3BsaXQgbWV0aG9kXG4gKi9cblxuLyoqXG4gKiBTcGxpdHMgYSBzdHJpbmcgaW50byBhbiBhcnJheSBvZiBzdHJpbmdzIHVzaW5nIGEgcmVnZXggb3Igc3RyaW5nIHNlcGFyYXRvci4gTWF0Y2hlcyBvZiB0aGVcbiAqIHNlcGFyYXRvciBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSByZXN1bHQgYXJyYXkuIEhvd2V2ZXIsIGlmIGBzZXBhcmF0b3JgIGlzIGEgcmVnZXggdGhhdCBjb250YWluc1xuICogY2FwdHVyaW5nIGdyb3VwcywgYmFja3JlZmVyZW5jZXMgYXJlIHNwbGljZWQgaW50byB0aGUgcmVzdWx0IGVhY2ggdGltZSBgc2VwYXJhdG9yYCBpcyBtYXRjaGVkLlxuICogRml4ZXMgYnJvd3NlciBidWdzIGNvbXBhcmVkIHRvIHRoZSBuYXRpdmUgYFN0cmluZy5wcm90b3R5cGUuc3BsaXRgIGFuZCBjYW4gYmUgdXNlZCByZWxpYWJseVxuICogY3Jvc3MtYnJvd3Nlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIHNwbGl0LlxuICogQHBhcmFtIHtSZWdFeHB8U3RyaW5nfSBzZXBhcmF0b3IgUmVnZXggb3Igc3RyaW5nIHRvIHVzZSBmb3Igc2VwYXJhdGluZyB0aGUgc3RyaW5nLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtsaW1pdF0gTWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0IGFycmF5LlxuICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBzdWJzdHJpbmdzLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBCYXNpYyB1c2VcbiAqIHNwbGl0KCdhIGIgYyBkJywgJyAnKTtcbiAqIC8vIC0+IFsnYScsICdiJywgJ2MnLCAnZCddXG4gKlxuICogLy8gV2l0aCBsaW1pdFxuICogc3BsaXQoJ2EgYiBjIGQnLCAnICcsIDIpO1xuICogLy8gLT4gWydhJywgJ2InXVxuICpcbiAqIC8vIEJhY2tyZWZlcmVuY2VzIGluIHJlc3VsdCBhcnJheVxuICogc3BsaXQoJy4ud29yZDEgd29yZDIuLicsIC8oW2Etel0rKShcXGQrKS9pKTtcbiAqIC8vIC0+IFsnLi4nLCAnd29yZCcsICcxJywgJyAnLCAnd29yZCcsICcyJywgJy4uJ11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gc3BsaXQodW5kZWYpIHtcblxuICB2YXIgbmF0aXZlU3BsaXQgPSBTdHJpbmcucHJvdG90eXBlLnNwbGl0LFxuICAgIGNvbXBsaWFudEV4ZWNOcGNnID0gLygpPz8vLmV4ZWMoXCJcIilbMV0gPT09IHVuZGVmLFxuICAgIC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG4gICAgc2VsZjtcblxuICBzZWxmID0gZnVuY3Rpb24oc3RyLCBzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBgbmF0aXZlU3BsaXRgXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzZXBhcmF0b3IpICE9PSBcIltvYmplY3QgUmVnRXhwXVwiKSB7XG4gICAgICByZXR1cm4gbmF0aXZlU3BsaXQuY2FsbChzdHIsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH1cbiAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/IFwiaVwiIDogXCJcIikgKyAoc2VwYXJhdG9yLm11bHRpbGluZSA/IFwibVwiIDogXCJcIikgKyAoc2VwYXJhdG9yLmV4dGVuZGVkID8gXCJ4XCIgOiBcIlwiKSArIC8vIFByb3Bvc2VkIGZvciBFUzZcbiAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ID8gXCJ5XCIgOiBcIlwiKSxcbiAgICAgIC8vIEZpcmVmb3ggMytcbiAgICAgIGxhc3RMYXN0SW5kZXggPSAwLFxuICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgIHNlcGFyYXRvciA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyBcImdcIiksXG4gICAgICBzZXBhcmF0b3IyLCBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoO1xuICAgIHN0ciArPSBcIlwiOyAvLyBUeXBlLWNvbnZlcnRcbiAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnKSB7XG4gICAgICAvLyBEb2Vzbid0IG5lZWQgZmxhZ3MgZ3ksIGJ1dCB0aGV5IGRvbid0IGh1cnRcbiAgICAgIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKFwiXlwiICsgc2VwYXJhdG9yLnNvdXJjZSArIFwiJCg/IVxcXFxzKVwiLCBmbGFncyk7XG4gICAgfVxuICAgIC8qIFZhbHVlcyBmb3IgYGxpbWl0YCwgcGVyIHRoZSBzcGVjOlxuICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICogSWYgMCwgSW5maW5pdHksIG9yIE5hTjogMFxuICAgICAqIElmIHBvc2l0aXZlIG51bWJlcjogbGltaXQgPSBNYXRoLmZsb29yKGxpbWl0KTsgaWYgKGxpbWl0ID4gNDI5NDk2NzI5NSkgbGltaXQgLT0gNDI5NDk2NzI5NjtcbiAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgKiBJZiBvdGhlcjogVHlwZS1jb252ZXJ0LCB0aGVuIHVzZSB0aGUgYWJvdmUgcnVsZXNcbiAgICAgKi9cbiAgICBsaW1pdCA9IGxpbWl0ID09PSB1bmRlZiA/IC0xID4+PiAwIDogLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgIGxpbWl0ID4+PiAwOyAvLyBUb1VpbnQzMihsaW1pdClcbiAgICB3aGlsZSAobWF0Y2ggPSBzZXBhcmF0b3IuZXhlYyhzdHIpKSB7XG4gICAgICAvLyBgc2VwYXJhdG9yLmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goc3RyLnNsaWNlKGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgIGZvclxuICAgICAgICAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cHNcbiAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZyAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB1bmRlZikge1xuICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdW5kZWY7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaC5pbmRleCA8IHN0ci5sZW5ndGgpIHtcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW1pdCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2VwYXJhdG9yLmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgc2VwYXJhdG9yLmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHIubGVuZ3RoKSB7XG4gICAgICBpZiAobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yLnRlc3QoXCJcIikpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goXCJcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKHN0ci5zbGljZShsYXN0TGFzdEluZGV4KSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltaXQgPyBvdXRwdXQuc2xpY2UoMCwgbGltaXQpIDogb3V0cHV0O1xuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufSkoKTtcbiIsIi8vIGNvbnRhaW5zLCBhZGQsIHJlbW92ZSwgdG9nZ2xlXG52YXIgaW5kZXhvZiA9IHJlcXVpcmUoJ2luZGV4b2YnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzTGlzdFxuXG5mdW5jdGlvbiBDbGFzc0xpc3QoZWxlbSkge1xuICAgIHZhciBjbCA9IGVsZW0uY2xhc3NMaXN0XG5cbiAgICBpZiAoY2wpIHtcbiAgICAgICAgcmV0dXJuIGNsXG4gICAgfVxuXG4gICAgdmFyIGNsYXNzTGlzdCA9IHtcbiAgICAgICAgYWRkOiBhZGRcbiAgICAgICAgLCByZW1vdmU6IHJlbW92ZVxuICAgICAgICAsIGNvbnRhaW5zOiBjb250YWluc1xuICAgICAgICAsIHRvZ2dsZTogdG9nZ2xlXG4gICAgICAgICwgdG9TdHJpbmc6ICR0b1N0cmluZ1xuICAgICAgICAsIGxlbmd0aDogMFxuICAgICAgICAsIGl0ZW06IGl0ZW1cbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3NMaXN0XG5cbiAgICBmdW5jdGlvbiBhZGQodG9rZW4pIHtcbiAgICAgICAgdmFyIGxpc3QgPSBnZXRUb2tlbnMoKVxuICAgICAgICBpZiAoaW5kZXhvZihsaXN0LCB0b2tlbikgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgbGlzdC5wdXNoKHRva2VuKVxuICAgICAgICBzZXRUb2tlbnMobGlzdClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmUodG9rZW4pIHtcbiAgICAgICAgdmFyIGxpc3QgPSBnZXRUb2tlbnMoKVxuICAgICAgICAgICAgLCBpbmRleCA9IGluZGV4b2YobGlzdCwgdG9rZW4pXG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgc2V0VG9rZW5zKGxpc3QpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udGFpbnModG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGluZGV4b2YoZ2V0VG9rZW5zKCksIHRva2VuKSA+IC0xXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlKHRva2VuKSB7XG4gICAgICAgIGlmIChjb250YWlucyh0b2tlbikpIHtcbiAgICAgICAgICAgIHJlbW92ZSh0b2tlbilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkKHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICR0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGVsZW0uY2xhc3NOYW1lXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXRlbShpbmRleCkge1xuICAgICAgICB2YXIgdG9rZW5zID0gZ2V0VG9rZW5zKClcbiAgICAgICAgcmV0dXJuIHRva2Vuc1tpbmRleF0gfHwgbnVsbFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRva2VucygpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lXG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcihjbGFzc05hbWUuc3BsaXQoXCIgXCIpLCBpc1RydXRoeSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUb2tlbnMobGlzdCkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGhcblxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGxpc3Quam9pbihcIiBcIilcbiAgICAgICAgY2xhc3NMaXN0Lmxlbmd0aCA9IGxlbmd0aFxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2xhc3NMaXN0W2ldID0gbGlzdFtpXVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGxpc3RbbGVuZ3RoXVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyIChhcnIsIGZuKSB7XG4gICAgdmFyIHJldCA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZuKGFycltpXSkpIHJldC5wdXNoKGFycltpXSlcbiAgICB9XG4gICAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBpc1RydXRoeSh2YWx1ZSkge1xuICAgIHJldHVybiAhIXZhbHVlXG59XG4iLCJcbnZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnIsIG9iail7XG4gIGlmIChpbmRleE9mKSByZXR1cm4gYXJyLmluZGV4T2Yob2JqKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoYXJyW2ldID09PSBvYmopIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn07IiwidmFyIFdlYWttYXAgPSByZXF1aXJlKFwid2Vha21hcFwiKVxudmFyIEluZGl2aWR1YWwgPSByZXF1aXJlKFwiaW5kaXZpZHVhbFwiKVxuXG52YXIgZGF0YXNldE1hcCA9IEluZGl2aWR1YWwoXCJfX0RBVEFfU0VUX1dFQUtNQVBcIiwgV2Vha21hcCgpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFTZXRcblxuZnVuY3Rpb24gRGF0YVNldChlbGVtKSB7XG4gICAgaWYgKGVsZW0uZGF0YXNldCkge1xuICAgICAgICByZXR1cm4gZWxlbS5kYXRhc2V0XG4gICAgfVxuXG4gICAgdmFyIGhhc2ggPSBkYXRhc2V0TWFwLmdldChlbGVtKVxuXG4gICAgaWYgKCFoYXNoKSB7XG4gICAgICAgIGhhc2ggPSBjcmVhdGVIYXNoKGVsZW0pXG4gICAgICAgIGRhdGFzZXRNYXAuc2V0KGVsZW0sIGhhc2gpXG4gICAgfVxuXG4gICAgcmV0dXJuIGhhc2hcbn1cblxuZnVuY3Rpb24gY3JlYXRlSGFzaChlbGVtKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBlbGVtLmF0dHJpYnV0ZXNcbiAgICB2YXIgaGFzaCA9IHt9XG5cbiAgICBpZiAoYXR0cmlidXRlcyA9PT0gbnVsbCB8fCBhdHRyaWJ1dGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGhhc2hcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyaWJ1dGVzW2ldXG5cbiAgICAgICAgaWYgKGF0dHIubmFtZS5zdWJzdHIoMCw1KSAhPT0gXCJkYXRhLVwiKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaGFzaFthdHRyLm5hbWUuc3Vic3RyKDUpXSA9IGF0dHIudmFsdWVcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzaFxufVxuIiwidmFyIHJvb3QgPSByZXF1aXJlKFwiZ2xvYmFsXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gSW5kaXZpZHVhbFxuXG5mdW5jdGlvbiBJbmRpdmlkdWFsKGtleSwgdmFsdWUpIHtcbiAgICBpZiAocm9vdFtrZXldKSB7XG4gICAgICAgIHJldHVybiByb290W2tleV1cbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocm9vdCwga2V5LCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gdmFsdWVcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qZ2xvYmFsIHdpbmRvdywgZ2xvYmFsKi9cbmlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxcbn0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93XG59XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIi8qIChUaGUgTUlUIExpY2Vuc2UpXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxMiBCcmFuZG9uIEJlbnZpZSA8aHR0cDovL2JiZW52aWUuY29tPlxyXG4gKlxyXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kXHJcbiAqIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxyXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gKiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgd2l0aCBhbGwgY29waWVzIG9yXHJcbiAqIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HXHJcbiAqIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4gKiBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZICBDTEFJTSxcclxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vLyBPcmlnaW5hbCBXZWFrTWFwIGltcGxlbWVudGF0aW9uIGJ5IEdvemFsYSBAIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEyNjk5OTFcclxuLy8gVXBkYXRlZCBhbmQgYnVnZml4ZWQgYnkgUmF5bm9zIEAgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTYzODA1OVxyXG4vLyBFeHBhbmRlZCBieSBCZW52aWUgQCBodHRwczovL2dpdGh1Yi5jb20vQmVudmllL2hhcm1vbnktY29sbGVjdGlvbnNcclxuXHJcbnZvaWQgZnVuY3Rpb24oZ2xvYmFsLCB1bmRlZmluZWRfLCB1bmRlZmluZWQpe1xyXG4gIHZhciBnZXRQcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxyXG4gICAgICBkZWZQcm9wICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcclxuICAgICAgdG9Tb3VyY2UgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsXHJcbiAgICAgIGNyZWF0ZSAgID0gT2JqZWN0LmNyZWF0ZSxcclxuICAgICAgaGFzT3duICAgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxyXG4gICAgICBmdW5jTmFtZSA9IC9eXFxuP2Z1bmN0aW9uXFxzPyhcXHcqKT9fP1xcKC87XHJcblxyXG5cclxuICBmdW5jdGlvbiBkZWZpbmUob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICAgIGlmICh0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHZhbHVlID0ga2V5O1xyXG4gICAgICBrZXkgPSBuYW1lT2YodmFsdWUpLnJlcGxhY2UoL18kLywgJycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZlByb3Aob2JqZWN0LCBrZXksIHsgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbmFtZU9mKGZ1bmMpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nXHJcbiAgICAgICAgICA/ICcnIDogJ25hbWUnIGluIGZ1bmNcclxuICAgICAgICAgID8gZnVuYy5uYW1lIDogdG9Tb3VyY2UuY2FsbChmdW5jKS5tYXRjaChmdW5jTmFtZSlbMV07XHJcbiAgfVxyXG5cclxuICAvLyAjIyMjIyMjIyMjIyNcclxuICAvLyAjIyMgRGF0YSAjIyNcclxuICAvLyAjIyMjIyMjIyMjIyNcclxuXHJcbiAgdmFyIERhdGEgPSAoZnVuY3Rpb24oKXtcclxuICAgIHZhciBkYXRhRGVzYyA9IHsgdmFsdWU6IHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfSB9LFxyXG4gICAgICAgIGRhdGFsb2NrID0gJ3JldHVybiBmdW5jdGlvbihrKXtpZihrPT09cylyZXR1cm4gbH0nLFxyXG4gICAgICAgIHVpZHMgICAgID0gY3JlYXRlKG51bGwpLFxyXG5cclxuICAgICAgICBjcmVhdGVVSUQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyIGtleSA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xyXG4gICAgICAgICAgcmV0dXJuIGtleSBpbiB1aWRzID8gY3JlYXRlVUlEKCkgOiB1aWRzW2tleV0gPSBrZXk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2xvYmFsSUQgPSBjcmVhdGVVSUQoKSxcclxuXHJcbiAgICAgICAgc3RvcmFnZSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICAgICAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBnbG9iYWxJRCkpXHJcbiAgICAgICAgICAgIHJldHVybiBvYmpbZ2xvYmFsSURdO1xyXG5cclxuICAgICAgICAgIGlmICghT2JqZWN0LmlzRXh0ZW5zaWJsZShvYmopKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG11c3QgYmUgZXh0ZW5zaWJsZVwiKTtcclxuXHJcbiAgICAgICAgICB2YXIgc3RvcmUgPSBjcmVhdGUobnVsbCk7XHJcbiAgICAgICAgICBkZWZQcm9wKG9iaiwgZ2xvYmFsSUQsIHsgdmFsdWU6IHN0b3JlIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHN0b3JlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgLy8gY29tbW9uIHBlci1vYmplY3Qgc3RvcmFnZSBhcmVhIG1hZGUgdmlzaWJsZSBieSBwYXRjaGluZyBnZXRPd25Qcm9wZXJ0eU5hbWVzJ1xyXG4gICAgZGVmaW5lKE9iamVjdCwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmope1xyXG4gICAgICB2YXIgcHJvcHMgPSBnZXRQcm9wcyhvYmopO1xyXG4gICAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBnbG9iYWxJRCkpXHJcbiAgICAgICAgcHJvcHMuc3BsaWNlKHByb3BzLmluZGV4T2YoZ2xvYmFsSUQpLCAxKTtcclxuICAgICAgcmV0dXJuIHByb3BzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gRGF0YSgpe1xyXG4gICAgICB2YXIgcHVpZCA9IGNyZWF0ZVVJRCgpLFxyXG4gICAgICAgICAgc2VjcmV0ID0ge307XHJcblxyXG4gICAgICB0aGlzLnVubG9jayA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICAgICAgdmFyIHN0b3JlID0gc3RvcmFnZShvYmopO1xyXG4gICAgICAgIGlmIChoYXNPd24uY2FsbChzdG9yZSwgcHVpZCkpXHJcbiAgICAgICAgICByZXR1cm4gc3RvcmVbcHVpZF0oc2VjcmV0KTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSBjcmVhdGUobnVsbCwgZGF0YURlc2MpO1xyXG4gICAgICAgIGRlZlByb3Aoc3RvcmUsIHB1aWQsIHtcclxuICAgICAgICAgIHZhbHVlOiBuZXcgRnVuY3Rpb24oJ3MnLCAnbCcsIGRhdGFsb2NrKShzZWNyZXQsIGRhdGEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWZpbmUoRGF0YS5wcm90b3R5cGUsIGZ1bmN0aW9uIGdldChvKXsgcmV0dXJuIHRoaXMudW5sb2NrKG8pLnZhbHVlIH0pO1xyXG4gICAgZGVmaW5lKERhdGEucHJvdG90eXBlLCBmdW5jdGlvbiBzZXQobywgdil7IHRoaXMudW5sb2NrKG8pLnZhbHVlID0gdiB9KTtcclxuXHJcbiAgICByZXR1cm4gRGF0YTtcclxuICB9KCkpO1xyXG5cclxuXHJcbiAgdmFyIFdNID0gKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYgKGtleSA9PSBudWxsIHx8IHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgV2Vha01hcCBrZXlcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHdyYXAgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCB2YWx1ZSl7XHJcbiAgICAgIHZhciBzdG9yZSA9IGRhdGEudW5sb2NrKGNvbGxlY3Rpb24pO1xyXG4gICAgICBpZiAoc3RvcmUudmFsdWUpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBpcyBhbHJlYWR5IGEgV2Vha01hcFwiKTtcclxuICAgICAgc3RvcmUudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdW53cmFwID0gZnVuY3Rpb24oY29sbGVjdGlvbil7XHJcbiAgICAgIHZhciBzdG9yYWdlID0gZGF0YS51bmxvY2soY29sbGVjdGlvbikudmFsdWU7XHJcbiAgICAgIGlmICghc3RvcmFnZSlcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiV2Vha01hcCBpcyBub3QgZ2VuZXJpY1wiKTtcclxuICAgICAgcmV0dXJuIHN0b3JhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluaXRpYWxpemUgPSBmdW5jdGlvbih3ZWFrbWFwLCBpdGVyYWJsZSl7XHJcbiAgICAgIGlmIChpdGVyYWJsZSAhPT0gbnVsbCAmJiB0eXBlb2YgaXRlcmFibGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBpdGVyYWJsZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgaXRlcmFibGUuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKXtcclxuICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkgJiYgaXRlbS5sZW5ndGggPT09IDIpXHJcbiAgICAgICAgICAgIHNldC5jYWxsKHdlYWttYXAsIGl0ZXJhYmxlW2ldWzBdLCBpdGVyYWJsZVtpXVsxXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gV2Vha01hcChpdGVyYWJsZSl7XHJcbiAgICAgIGlmICh0aGlzID09PSBnbG9iYWwgfHwgdGhpcyA9PSBudWxsIHx8IHRoaXMgPT09IFdlYWtNYXAucHJvdG90eXBlKVxyXG4gICAgICAgIHJldHVybiBuZXcgV2Vha01hcChpdGVyYWJsZSk7XHJcblxyXG4gICAgICB3cmFwKHRoaXMsIG5ldyBEYXRhKTtcclxuICAgICAgaW5pdGlhbGl6ZSh0aGlzLCBpdGVyYWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0KGtleSl7XHJcbiAgICAgIHZhbGlkYXRlKGtleSk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHVud3JhcCh0aGlzKS5nZXQoa2V5KTtcclxuICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWRfID8gdW5kZWZpbmVkIDogdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xyXG4gICAgICB2YWxpZGF0ZShrZXkpO1xyXG4gICAgICAvLyBzdG9yZSBhIHRva2VuIGZvciBleHBsaWNpdCB1bmRlZmluZWQgc28gdGhhdCBcImhhc1wiIHdvcmtzIGNvcnJlY3RseVxyXG4gICAgICB1bndyYXAodGhpcykuc2V0KGtleSwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZF8gOiB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFzKGtleSl7XHJcbiAgICAgIHZhbGlkYXRlKGtleSk7XHJcbiAgICAgIHJldHVybiB1bndyYXAodGhpcykuZ2V0KGtleSkgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWxldGVfKGtleSl7XHJcbiAgICAgIHZhbGlkYXRlKGtleSk7XHJcbiAgICAgIHZhciBkYXRhID0gdW53cmFwKHRoaXMpLFxyXG4gICAgICAgICAgaGFkID0gZGF0YS5nZXQoa2V5KSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICBkYXRhLnNldChrZXksIHVuZGVmaW5lZCk7XHJcbiAgICAgIHJldHVybiBoYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcoKXtcclxuICAgICAgdW53cmFwKHRoaXMpO1xyXG4gICAgICByZXR1cm4gJ1tvYmplY3QgV2Vha01hcF0nO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciBzcmMgPSAoJ3JldHVybiAnK2RlbGV0ZV8pLnJlcGxhY2UoJ2VfJywgJ1xcXFx1MDA2NScpLFxyXG4gICAgICAgICAgZGVsID0gbmV3IEZ1bmN0aW9uKCd1bndyYXAnLCAndmFsaWRhdGUnLCBzcmMpKHVud3JhcCwgdmFsaWRhdGUpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB2YXIgZGVsID0gZGVsZXRlXztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc3JjID0gKCcnK09iamVjdCkuc3BsaXQoJ09iamVjdCcpO1xyXG4gICAgdmFyIHN0cmluZ2lmaWVyID0gZnVuY3Rpb24gdG9TdHJpbmcoKXtcclxuICAgICAgcmV0dXJuIHNyY1swXSArIG5hbWVPZih0aGlzKSArIHNyY1sxXTtcclxuICAgIH07XHJcblxyXG4gICAgZGVmaW5lKHN0cmluZ2lmaWVyLCBzdHJpbmdpZmllcik7XHJcblxyXG4gICAgdmFyIHByZXAgPSB7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5XHJcbiAgICAgID8gZnVuY3Rpb24oZil7IGYuX19wcm90b19fID0gc3RyaW5naWZpZXIgfVxyXG4gICAgICA6IGZ1bmN0aW9uKGYpeyBkZWZpbmUoZiwgc3RyaW5naWZpZXIpIH07XHJcblxyXG4gICAgcHJlcChXZWFrTWFwKTtcclxuXHJcbiAgICBbdG9TdHJpbmcsIGdldCwgc2V0LCBoYXMsIGRlbF0uZm9yRWFjaChmdW5jdGlvbihtZXRob2Qpe1xyXG4gICAgICBkZWZpbmUoV2Vha01hcC5wcm90b3R5cGUsIG1ldGhvZCk7XHJcbiAgICAgIHByZXAobWV0aG9kKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBXZWFrTWFwO1xyXG4gIH0obmV3IERhdGEpKTtcclxuXHJcbiAgdmFyIGRlZmF1bHRDcmVhdG9yID0gT2JqZWN0LmNyZWF0ZVxyXG4gICAgPyBmdW5jdGlvbigpeyByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKSB9XHJcbiAgICA6IGZ1bmN0aW9uKCl7IHJldHVybiB7fSB9O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVTdG9yYWdlKGNyZWF0b3Ipe1xyXG4gICAgdmFyIHdlYWttYXAgPSBuZXcgV007XHJcbiAgICBjcmVhdG9yIHx8IChjcmVhdG9yID0gZGVmYXVsdENyZWF0b3IpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHN0b3JhZ2Uob2JqZWN0LCB2YWx1ZSl7XHJcbiAgICAgIGlmICh2YWx1ZSB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgd2Vha21hcC5zZXQob2JqZWN0LCB2YWx1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgPSB3ZWFrbWFwLmdldChvYmplY3QpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IGNyZWF0b3Iob2JqZWN0KTtcclxuICAgICAgICAgIHdlYWttYXAuc2V0KG9iamVjdCwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0b3JhZ2U7XHJcbiAgfVxyXG5cclxuXHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFdNO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBleHBvcnRzLldlYWtNYXAgPSBXTTtcclxuICB9IGVsc2UgaWYgKCEoJ1dlYWtNYXAnIGluIGdsb2JhbCkpIHtcclxuICAgIGdsb2JhbC5XZWFrTWFwID0gV007XHJcbiAgfVxyXG5cclxuICBXTS5jcmVhdGVTdG9yYWdlID0gY3JlYXRlU3RvcmFnZTtcclxuICBpZiAoZ2xvYmFsLldlYWtNYXApXHJcbiAgICBnbG9iYWwuV2Vha01hcC5jcmVhdGVTdG9yYWdlID0gY3JlYXRlU3RvcmFnZTtcclxufSgoMCwgZXZhbCkoJ3RoaXMnKSk7XHJcbiIsIjsoZnVuY3Rpb24gKCkge1xuXG4vLyBiaW5kIGEgdG8gYiAtLSBPbmUgV2F5IEJpbmRpbmdcbmZ1bmN0aW9uIGJpbmQxKGEsIGIpIHtcbiAgYShiKCkpOyBiKGEpXG59XG4vL2JpbmQgYSB0byBiIGFuZCBiIHRvIGEgLS0gVHdvIFdheSBCaW5kaW5nXG5mdW5jdGlvbiBiaW5kMihhLCBiKSB7XG4gIGIoYSgpKTsgYShiKTsgYihhKTtcbn1cblxuLy8tLS11dGlsLWZ1bnRpb25zLS0tLS0tXG5cbi8vY2hlY2sgaWYgdGhpcyBjYWxsIGlzIGEgZ2V0LlxuZnVuY3Rpb24gaXNHZXQodmFsKSB7XG4gIHJldHVybiB1bmRlZmluZWQgPT09IHZhbFxufVxuXG4vL2NoZWNrIGlmIHRoaXMgY2FsbCBpcyBhIHNldCwgZWxzZSwgaXQncyBhIGxpc3RlblxuZnVuY3Rpb24gaXNTZXQodmFsKSB7XG4gIHJldHVybiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdmFsXG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZ1bikge1xuICByZXR1cm4gJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZ1blxufVxuXG5mdW5jdGlvbiBhc3NlcnRPYnNlcnZhYmxlIChvYnNlcnZhYmxlKSB7XG4gIGlmKCFpc0Z1bmN0aW9uKG9ic2VydmFibGUpKVxuICAgIHRocm93IG5ldyBFcnJvcigndHJhbnNmb3JtIGV4cGVjdHMgYW4gb2JzZXJ2YWJsZScpXG4gIHJldHVybiBvYnNlcnZhYmxlXG59XG5cbi8vdHJpZ2dlciBhbGwgbGlzdGVuZXJzXG5mdW5jdGlvbiBhbGwoYXJ5LCB2YWwpIHtcbiAgZm9yKHZhciBrIGluIGFyeSlcbiAgICBhcnlba10odmFsKVxufVxuXG4vL3JlbW92ZSBhIGxpc3RlbmVyXG5mdW5jdGlvbiByZW1vdmUoYXJ5LCBpdGVtKSB7XG4gIGRlbGV0ZSBhcnlbYXJ5LmluZGV4T2YoaXRlbSldXG59XG5cbi8vcmVnaXN0ZXIgYSBsaXN0ZW5lclxuZnVuY3Rpb24gb24oZW1pdHRlciwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gIChlbWl0dGVyLm9uIHx8IGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcilcbiAgICAuY2FsbChlbWl0dGVyLCBldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBvZmYoZW1pdHRlciwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gIChlbWl0dGVyLnJlbW92ZUxpc3RlbmVyIHx8IGVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciB8fCBlbWl0dGVyLm9mZilcbiAgICAuY2FsbChlbWl0dGVyLCBldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxufVxuXG4vL0FuIG9ic2VydmFibGUgdGhhdCBzdG9yZXMgYSB2YWx1ZS5cblxuZnVuY3Rpb24gdmFsdWUgKGluaXRpYWxWYWx1ZSkge1xuICB2YXIgX3ZhbCA9IGluaXRpYWxWYWx1ZSwgbGlzdGVuZXJzID0gW11cbiAgb2JzZXJ2YWJsZS5zZXQgPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgYWxsKGxpc3RlbmVycywgX3ZhbCA9IHZhbClcbiAgfVxuICByZXR1cm4gb2JzZXJ2YWJsZVxuXG4gIGZ1bmN0aW9uIG9ic2VydmFibGUodmFsKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzR2V0KHZhbCkgPyBfdmFsXG4gICAgOiBpc1NldCh2YWwpID8gYWxsKGxpc3RlbmVycywgX3ZhbCA9IHZhbClcbiAgICA6IChsaXN0ZW5lcnMucHVzaCh2YWwpLCB2YWwoX3ZhbCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVtb3ZlKGxpc3RlbmVycywgdmFsKVxuICAgICAgfSlcbiAgKX19XG4gIC8vXiBpZiB3cml0dGVuIGluIHRoaXMgc3R5bGUsIGFsd2F5cyBlbmRzICl9fVxuXG4vKlxuIyNwcm9wZXJ0eVxub2JzZXJ2ZSBhIHByb3BlcnR5IG9mIGFuIG9iamVjdCwgd29ya3Mgd2l0aCBzY3V0dGxlYnV0dC5cbmNvdWxkIGNoYW5nZSB0aGlzIHRvIHdvcmsgd2l0aCBiYWNrYm9uZSBNb2RlbCAtIGJ1dCBpdCB3b3VsZCBiZWNvbWUgdWdseS5cbiovXG5cbmZ1bmN0aW9uIHByb3BlcnR5IChtb2RlbCwga2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzR2V0KHZhbCkgPyBtb2RlbC5nZXQoa2V5KSA6XG4gICAgICBpc1NldCh2YWwpID8gbW9kZWwuc2V0KGtleSwgdmFsKSA6XG4gICAgICAob24obW9kZWwsICdjaGFuZ2U6JytrZXksIHZhbCksIHZhbChtb2RlbC5nZXQoa2V5KSksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb2ZmKG1vZGVsLCAnY2hhbmdlOicra2V5LCB2YWwpXG4gICAgICB9KVxuICAgICl9fVxuXG4vKlxubm90ZSB0aGUgdXNlIG9mIHRoZSBlbHZpcyBvcGVyYXRvciBgPzpgIGluIGNoYWluZWQgZWxzZS1pZiBmb3JtYXRpb24sXG5hbmQgYWxzbyB0aGUgY29tbWEgb3BlcmF0b3IgYCxgIHdoaWNoIGV2YWx1YXRlcyBlYWNoIHBhcnQgYW5kIHRoZW5cbnJldHVybnMgdGhlIGxhc3QgdmFsdWUuXG5cbm9ubHkgOCBsaW5lcyEgdGhhdCBpc24ndCBtdWNoIGZvciB3aGF0IHRoaXMgYmFieSBjYW4gZG8hXG4qL1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm0gKG9ic2VydmFibGUsIGRvd24sIHVwKSB7XG4gIGFzc2VydE9ic2VydmFibGUob2JzZXJ2YWJsZSlcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNHZXQodmFsKSA/IGRvd24ob2JzZXJ2YWJsZSgpKVxuICAgIDogaXNTZXQodmFsKSA/IG9ic2VydmFibGUoKHVwIHx8IGRvd24pKHZhbCkpXG4gICAgOiBvYnNlcnZhYmxlKGZ1bmN0aW9uIChfdmFsKSB7IHZhbChkb3duKF92YWwpKSB9KVxuICAgICl9fVxuXG5mdW5jdGlvbiBub3Qob2JzZXJ2YWJsZSkge1xuICByZXR1cm4gdHJhbnNmb3JtKG9ic2VydmFibGUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiAhdiB9KVxufVxuXG5mdW5jdGlvbiBsaXN0ZW4gKGVsZW1lbnQsIGV2ZW50LCBhdHRyLCBsaXN0ZW5lcikge1xuICBmdW5jdGlvbiBvbkV2ZW50ICgpIHtcbiAgICBsaXN0ZW5lcihpc0Z1bmN0aW9uKGF0dHIpID8gYXR0cigpIDogZWxlbWVudFthdHRyXSlcbiAgfVxuICBvbihlbGVtZW50LCBldmVudCwgb25FdmVudClcbiAgb25FdmVudCgpXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgb2ZmKGVsZW1lbnQsIGV2ZW50LCBvbkV2ZW50KVxuICB9XG59XG5cbi8vb2JzZXJ2ZSBodG1sIGVsZW1lbnQgLSBhbGlhc2VkIGFzIGBpbnB1dGBcbmZ1bmN0aW9uIGF0dHJpYnV0ZShlbGVtZW50LCBhdHRyLCBldmVudCkge1xuICBhdHRyID0gYXR0ciB8fCAndmFsdWUnOyBldmVudCA9IGV2ZW50IHx8ICdpbnB1dCdcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNHZXQodmFsKSA/IGVsZW1lbnRbYXR0cl1cbiAgICA6IGlzU2V0KHZhbCkgPyBlbGVtZW50W2F0dHJdID0gdmFsXG4gICAgOiBsaXN0ZW4oZWxlbWVudCwgZXZlbnQsIGF0dHIsIHZhbClcbiAgICApfVxufVxuXG4vLyBvYnNlcnZlIGEgc2VsZWN0IGVsZW1lbnRcbmZ1bmN0aW9uIHNlbGVjdChlbGVtZW50KSB7XG4gIGZ1bmN0aW9uIF9hdHRyICgpIHtcbiAgICAgIHJldHVybiBlbGVtZW50W2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gX3NldCh2YWwpIHtcbiAgICBmb3IodmFyIGk9MDsgaSA8IGVsZW1lbnQub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoZWxlbWVudC5vcHRpb25zW2ldLnZhbHVlID09IHZhbCkgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNHZXQodmFsKSA/IGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdLnZhbHVlXG4gICAgOiBpc1NldCh2YWwpID8gX3NldCh2YWwpXG4gICAgOiBsaXN0ZW4oZWxlbWVudCwgJ2NoYW5nZScsIF9hdHRyLCB2YWwpXG4gICAgKX1cbn1cblxuLy90b2dnbGUgYmFzZWQgb24gYW4gZXZlbnQsIGxpa2UgbW91c2VvdmVyLCBtb3VzZW91dFxuZnVuY3Rpb24gdG9nZ2xlIChlbCwgdXAsIGRvd24pIHtcbiAgdmFyIGkgPSBmYWxzZVxuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIGZ1bmN0aW9uIG9uVXAoKSB7XG4gICAgICBpIHx8IHZhbChpID0gdHJ1ZSlcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Eb3duICgpIHtcbiAgICAgIGkgJiYgdmFsKGkgPSBmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIGlzR2V0KHZhbCkgPyBpXG4gICAgOiBpc1NldCh2YWwpID8gdW5kZWZpbmVkIC8vcmVhZCBvbmx5XG4gICAgOiAob24oZWwsIHVwLCBvblVwKSwgb24oZWwsIGRvd24gfHwgdXAsIG9uRG93biksIHZhbChpKSwgZnVuY3Rpb24gKCkge1xuICAgICAgb2ZmKGVsLCB1cCwgb25VcCk7IG9mZihlbCwgZG93biB8fCB1cCwgb25Eb3duKVxuICAgIH0pXG4gICl9fVxuXG5mdW5jdGlvbiBlcnJvciAobWVzc2FnZSkge1xuICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSlcbn1cblxuZnVuY3Rpb24gY29tcHV0ZSAob2JzZXJ2YWJsZXMsIGNvbXB1dGUpIHtcbiAgdmFyIGN1ciA9IG9ic2VydmFibGVzLm1hcChmdW5jdGlvbiAoZSkge1xuICAgIHJldHVybiBlKClcbiAgfSksIGluaXQgPSB0cnVlXG5cbiAgdmFyIHYgPSB2YWx1ZSgpXG5cbiAgb2JzZXJ2YWJsZXMuZm9yRWFjaChmdW5jdGlvbiAoZiwgaSkge1xuICAgIGYoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgY3VyW2ldID0gdmFsXG4gICAgICBpZihpbml0KSByZXR1cm5cbiAgICAgIHYoY29tcHV0ZS5hcHBseShudWxsLCBjdXIpKVxuICAgIH0pXG4gIH0pXG4gIHYoY29tcHV0ZS5hcHBseShudWxsLCBjdXIpKVxuICBpbml0ID0gZmFsc2VcbiAgdihmdW5jdGlvbiAoKSB7XG4gICAgY29tcHV0ZS5hcHBseShudWxsLCBjdXIpXG4gIH0pXG5cbiAgcmV0dXJuIHZcbn1cblxuZnVuY3Rpb24gYm9vbGVhbiAob2JzZXJ2YWJsZSwgdHJ1dGh5LCBmYWxzZXkpIHtcbiAgcmV0dXJuIChcbiAgICB0cmFuc2Zvcm0ob2JzZXJ2YWJsZSwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA/IHRydXRoeSA6IGZhbHNleVxuICAgIH0sIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPT0gdHJ1dGh5ID8gdHJ1ZSA6IGZhbHNlXG4gICAgfSlcbiAgKVxufVxuXG5mdW5jdGlvbiBzaWduYWwgKCkge1xuICB2YXIgX3ZhbCwgbGlzdGVuZXJzID0gW11cbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNHZXQodmFsKSA/IF92YWxcbiAgICAgICAgOiBpc1NldCh2YWwpID8gKCEoX3ZhbD09PXZhbCkgPyBhbGwobGlzdGVuZXJzLCBfdmFsID0gdmFsKTpcIlwiKVxuICAgICAgICA6IChsaXN0ZW5lcnMucHVzaCh2YWwpLCB2YWwoX3ZhbCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgcmVtb3ZlKGxpc3RlbmVycywgdmFsKVxuICAgICAgICB9KVxuICAgICl9fVxuXG52YXIgZXhwb3J0cyA9IHZhbHVlXG5leHBvcnRzLmJpbmQxICAgICA9IGJpbmQxXG5leHBvcnRzLmJpbmQyICAgICA9IGJpbmQyXG5leHBvcnRzLnZhbHVlICAgICA9IHZhbHVlXG5leHBvcnRzLm5vdCAgICAgICA9IG5vdFxuZXhwb3J0cy5wcm9wZXJ0eSAgPSBwcm9wZXJ0eVxuZXhwb3J0cy5pbnB1dCAgICAgPVxuZXhwb3J0cy5hdHRyaWJ1dGUgPSBhdHRyaWJ1dGVcbmV4cG9ydHMuc2VsZWN0ICAgID0gc2VsZWN0XG5leHBvcnRzLmNvbXB1dGUgICA9IGNvbXB1dGVcbmV4cG9ydHMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5leHBvcnRzLmJvb2xlYW4gICA9IGJvb2xlYW5cbmV4cG9ydHMudG9nZ2xlICAgID0gdG9nZ2xlXG5leHBvcnRzLmhvdmVyICAgICA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiB0b2dnbGUoZSwgJ21vdXNlb3ZlcicsICdtb3VzZW91dCcpfVxuZXhwb3J0cy5mb2N1cyAgICAgPSBmdW5jdGlvbiAoZSkgeyByZXR1cm4gdG9nZ2xlKGUsICdmb2N1cycsICdibHVyJyl9XG5leHBvcnRzLnNpZ25hbCAgICA9IHNpZ25hbFxuXG5pZignb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzXG5lbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYnNlcnZhYmxlID0gZXhwb3J0c1xufSkoKVxuIiwiZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vbGliL3BhcnNlJyk7XG5leHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ2lmeScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShvYmplY3ROYW1lLCBvY3NzKSB7XG5cbiAgdmFyIHJlZ2V4ID0ge1xuICAgIGVtcHR5OiAvXlxccyokLyxcbiAgICBjb21tZW50OiAvID9cXC9cXC8uKiQvLFxuICAgIGluZGVudGF0aW9uOiAvXlxccyovLFxuICAgIG9iamVjdDogL15cXHcrJC8sXG4gICAgZGVjbGFyYXRpb246IC9eKC4rKTooLispJC8sXG4gICAgZWxlbWVudDogL15cXHcrJC8sXG4gICAgcHNldWRvZWxlbWVudDogL146LiskLyxcbiAgICBtb2RpZmllcjogL149XFx3KyQvXG4gIH07XG5cbiAgdmFsaWRhdGUob2JqZWN0TmFtZSwgb2Nzcyk7XG5cbiAgcmV0dXJuIG9jc3NcbiAgICAuc3BsaXQoJ1xcbicpXG4gICAgLm1hcChyZW1vdmVDb21tZW50cylcbiAgICAubWFwKHRvT2JqZWN0cylcbiAgICAuZmlsdGVyKGlzTm90RW1wdHkpXG4gICAgLm1hcChhZGRJbmRlbnRhdGlvbilcbiAgICAubWFwKGFkZFR5cGUpXG4gICAgLnJlZHVjZSh0b0FTVCwgb2JqZWN0KG9iamVjdE5hbWUpKTtcblxuICBmdW5jdGlvbiB2YWxpZGF0ZShvYmplY3ROYW1lLCBvY3NzKSB7XG4gICAgaWYgKCAhIG9iamVjdE5hbWUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3Npbmcgb2JqZWN0IG5hbWUgcGFyYW0nKTtcblxuICAgIGlmICggISByZWdleC5vYmplY3QudGVzdChvYmplY3ROYW1lKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignb2JqZWN0IG5hbWUgbWF5IG9ubHkgY29udGFpbiBsZXR0ZXJzIGFuZCB1bmRlcnNjb3JlJyk7XG5cbiAgICBpZiAodHlwZW9mIG9jc3MgIT09ICdzdHJpbmcnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIG9jc3MgcGFyYW0nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUNvbW1lbnRzKHJhd0xpbmUpIHtcbiAgICByZXR1cm4gcmF3TGluZS5yZXBsYWNlKHJlZ2V4LmNvbW1lbnQsICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvT2JqZWN0cyhyYXdMaW5lLCBsaW5lbnVtKSB7XG4gICAgdmFyIGxpbmUgPSB7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICBsaW5lOiBsaW5lbnVtKzFcbiAgICAgIH1cbiAgICB9O1xuICAgIGFkZE5vbkVudW1lcmFibGUobGluZSwgJ3JhdycsIHJhd0xpbmUpO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb3RFbXB0eShsaW5lKSB7XG4gICAgcmV0dXJuICEgcmVnZXguZW1wdHkudGVzdChsaW5lLnJhdyk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJbmRlbnRhdGlvbihsaW5lKSB7XG4gICAgYWRkTm9uRW51bWVyYWJsZShsaW5lLCAnaW5kZW50YXRpb24nLCBsaW5lLnJhdy5tYXRjaChyZWdleC5pbmRlbnRhdGlvbilbMF0ubGVuZ3RoKTtcbiAgICByZXR1cm4gbGluZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFR5cGUobGluZSkge1xuICAgIHZhciB0cmltbWVkTGluZSA9IGxpbmUucmF3LnRyaW0oKTtcbiAgICBpZiAocmVnZXguZGVjbGFyYXRpb24udGVzdCh0cmltbWVkTGluZSkpICAgICByZXR1cm4gZGVjbGFyYXRpb24obGluZSk7XG4gICAgaWYgKHJlZ2V4LmVsZW1lbnQudGVzdCh0cmltbWVkTGluZSkpICAgICAgICAgcmV0dXJuIGVsZW1lbnQobGluZSk7XG4gICAgaWYgKHJlZ2V4LnBzZXVkb2VsZW1lbnQudGVzdCh0cmltbWVkTGluZSkpICAgcmV0dXJuIHBzZXVkb2VsZW1lbnQobGluZSk7XG4gICAgaWYgKHJlZ2V4Lm1vZGlmaWVyLnRlc3QodHJpbW1lZExpbmUpKSAgICAgICAgcmV0dXJuIG1vZGlmaWVyKGxpbmUpO1xuXG4gICAgZXJyb3IobGluZSwgJ3Vua25vd24gdHlwZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0KG5hbWUpIHtcbiAgICB2YXIgX29iamVjdCA9IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH07XG4gICAgYWRkTm9uRW51bWVyYWJsZShfb2JqZWN0LCAnaW5kZW50YXRpb24nLCAtMSk7XG4gICAgcmV0dXJuIF9vYmplY3Q7XG4gIH1cblxuICBmdW5jdGlvbiBkZWNsYXJhdGlvbihsaW5lKSB7XG4gICAgbGluZS50eXBlID0gJ2RlY2xhcmF0aW9uJztcblxuICAgIHZhciB2YWx1ZXMgPSBsaW5lLnJhdy5tYXRjaChyZWdleC5kZWNsYXJhdGlvbik7XG4gICAgbGluZS5wcm9wZXJ0eSA9IHZhbHVlc1sxXS50cmltKCk7XG4gICAgbGluZS52YWx1ZSA9IHZhbHVlc1syXS50cmltKCk7XG5cbiAgICByZXR1cm4gbGluZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVsZW1lbnQobGluZSkge1xuICAgIGxpbmUudHlwZSA9ICdlbGVtZW50JztcbiAgICBsaW5lLm5hbWUgPSBsaW5lLnJhdy50cmltKCk7XG4gICAgcmV0dXJuIGxpbmU7XG4gIH1cblxuICBmdW5jdGlvbiBwc2V1ZG9lbGVtZW50KGxpbmUpIHtcbiAgICBsaW5lLnR5cGUgPSAncHNldWRvZWxlbWVudCc7XG4gICAgbGluZS5uYW1lID0gbGluZS5yYXcucmVwbGFjZSgnOicsICcnKS50cmltKCk7XG4gICAgcmV0dXJuIGxpbmU7XG4gIH1cblxuICBmdW5jdGlvbiBtb2RpZmllcihsaW5lKSB7XG4gICAgaWYgKGxpbmUuaW5kZW50YXRpb24gPiAwKSBlcnJvcihsaW5lLCAnbmVzdGVkIG1vZGlmaWVyJyk7XG4gICAgbGluZS50eXBlID0gJ21vZGlmaWVyJztcbiAgICBsaW5lLm5hbWUgPSBsaW5lLnJhdy5yZXBsYWNlKCc9JywgJycpO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9BU1QocHJldmlvdXNMaW5lLCBjdXJyZW50TGluZSwgaW5kZXgsIGxpbmVzKSB7XG4gICAgaWYgKGN1cnJlbnRMaW5lLmluZGVudGF0aW9uID4gcHJldmlvdXNMaW5lLmluZGVudGF0aW9uICsgMSkge1xuICAgICAgZXJyb3IoY3VycmVudExpbmUsICd3cm9uZyBpbmRlbnRhdGlvbiAobmVzdGVkIGF0IGxlYXN0IG9uZSBsZXZlbCB0b28gZGVlcCknKTtcbiAgICB9XG4gICAgaWYgKHByZXZpb3VzTGluZS50eXBlID09PSAnZGVjbGFyYXRpb24nICYmXG4gICAgICBjdXJyZW50TGluZS5pbmRlbnRhdGlvbiA+IHByZXZpb3VzTGluZS5pbmRlbnRhdGlvbikge1xuICAgICAgZXJyb3IoY3VycmVudExpbmUsICd3cm9uZyBpbmRlbnRhdGlvbiAobmVzdGluZyB1bmRlciBhIGRlY2xhcmF0aW9uKScpO1xuICAgIH1cblxuICAgIHZhciBuZXN0aW5nID0gKHByZXZpb3VzTGluZS5pbmRlbnRhdGlvbi1jdXJyZW50TGluZS5pbmRlbnRhdGlvbikrMTtcbiAgICBhZGROb25FbnVtZXJhYmxlKGN1cnJlbnRMaW5lLCAncGFyZW50JywgZ2V0TmVzdGVkUGFyZW50KG5lc3RpbmcsIHByZXZpb3VzTGluZSkpO1xuICAgIHZhciBwYXJlbnQgPSBjdXJyZW50TGluZS5wYXJlbnQ7XG5cbiAgICBpZiAoIXBhcmVudFtjdXJyZW50TGluZS50eXBlKydzJ10pIHtcbiAgICAgIHBhcmVudFtjdXJyZW50TGluZS50eXBlKydzJ10gPSBbXTtcbiAgICB9XG4gICAgcGFyZW50W2N1cnJlbnRMaW5lLnR5cGUrJ3MnXS5wdXNoKGN1cnJlbnRMaW5lKTtcblxuICAgIGlmIChpbmRleCA9PT0gbGluZXMubGVuZ3RoLTEpIHtcbiAgICAgIHJldHVybiBsaW5lc1swXS5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50TGluZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE5vbkVudW1lcmFibGUobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3BlcnR5LCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXN0ZWRQYXJlbnQobmVzdGluZywgbm9kZSkge1xuICAgIHdoaWxlKG5lc3RpbmctLSkge1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVycm9yKGxpbmUsIG1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2xpbmUgJytsaW5lLnBvc2l0aW9uLmxpbmUrJzogJyttZXNzYWdlKycgYCcrbGluZS5yYXcrJ2AnKTtcbiAgfVxuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHJpbmdpZnkobm9kZSwgcGFyZW50KSB7XG4gIG5vZGUucGFyZW50ID0gcGFyZW50O1xuXG4gIHZhciBjc3MgPSAnJztcblxuICBpZiAoJ2RlY2xhcmF0aW9ucycgaW4gbm9kZSkge1xuICAgIGNzcyArPSBzZWxlY3Rvcihub2RlLCBwYXJlbnQpO1xuICAgIGNzcyArPSBvcGVuQnJhY2tldHMoKTtcbiAgICBjc3MgKz0gZGVjbGFyYXRpb25zKG5vZGUpO1xuICAgIGNzcyArPSBjbG9zZUJyYWNrZXRzKCk7XG4gIH1cblxuICBpZiAoJ2VsZW1lbnRzJyBpbiBub2RlKSB7XG4gICAgY3NzICs9IG5vZGUuZWxlbWVudHMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBzdHJpbmdpZnkoZWxlbWVudCwgbm9kZSk7XG4gICAgfSkuam9pbignJyk7XG4gIH1cblxuICBpZiAoJ3BzZXVkb2VsZW1lbnRzJyBpbiBub2RlKSB7XG4gICAgY3NzICs9IG5vZGUucHNldWRvZWxlbWVudHMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBzdHJpbmdpZnkoZWxlbWVudCwgbm9kZSk7XG4gICAgfSkuam9pbignJyk7XG4gIH1cblxuICBpZiAoJ21vZGlmaWVycycgaW4gbm9kZSkge1xuICAgIGNzcyArPSBub2RlLm1vZGlmaWVycy5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeShlbGVtZW50LCBub2RlKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuXG4gIHJldHVybiBjc3M7XG59O1xuXG5mdW5jdGlvbiBzZWxlY3Rvcihub2RlLCBwYXJlbnQpIHtcbiAgaWYgKCFwYXJlbnQpXG4gICAgcmV0dXJuICcuJytub2RlLm5hbWU7XG5cbiAgaWYgKG5vZGUudHlwZSA9PT0gJ21vZGlmaWVyJylcbiAgICByZXR1cm4gc2VsZWN0b3IocGFyZW50LCBwYXJlbnQucGFyZW50KStzZWxlY3RvcihwYXJlbnQsIHBhcmVudC5wYXJlbnQpICsgJy0tJyArIG5vZGUubmFtZSArICcsXFxuJ1xuICAgICAgK3NlbGVjdG9yKHBhcmVudCwgcGFyZW50LnBhcmVudCkgKyAnLS0nICsgbm9kZS5uYW1lICsgJyAnICsgc2VsZWN0b3IocGFyZW50LCBwYXJlbnQucGFyZW50KTtcblxuICBpZiAobm9kZS50eXBlID09PSAncHNldWRvZWxlbWVudCcpXG4gICAgcmV0dXJuIHNlbGVjdG9yKHBhcmVudCwgcGFyZW50LnBhcmVudCkgKyAnOicgKyBub2RlLm5hbWU7XG5cbiAgaWYgKHBhcmVudC50eXBlID09PSAncHNldWRvZWxlbWVudCcpXG4gICAgcmV0dXJuIHNlbGVjdG9yKHBhcmVudCwgcGFyZW50LnBhcmVudCkgKyAnIC4nICsgcm9vdChub2RlKS5uYW1lICsgJy0nICsgbm9kZS5uYW1lO1xuXG4gIGlmIChwYXJlbnQudHlwZSA9PT0gJ21vZGlmaWVyJylcbiAgICByZXR1cm4gJy4nK3Jvb3Qobm9kZSkubmFtZSsnLS0nK3BhcmVudC5uYW1lICsgJyAuJyArIHJvb3Qobm9kZSkubmFtZSArICctJyArIG5vZGUubmFtZTtcblxuICByZXR1cm4gc2VsZWN0b3IocGFyZW50LCBwYXJlbnQucGFyZW50KSArICctJyArIG5vZGUubmFtZTtcbn1cblxuZnVuY3Rpb24gcm9vdChub2RlKSB7XG4gIGlmICghbm9kZS5wYXJlbnQpXG4gICAgcmV0dXJuIG5vZGU7XG4gIHJldHVybiByb290KG5vZGUucGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZGVjbGFyYXRpb25zKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuZGVjbGFyYXRpb25zLm1hcChmdW5jdGlvbihkZWNsYXJhdGlvbikge1xuICAgIHJldHVybiAnXFx0JytkZWNsYXJhdGlvbi5wcm9wZXJ0eSsnOiAnK2RlY2xhcmF0aW9uLnZhbHVlKyc7XFxuJztcbiAgfSkuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIG9wZW5CcmFja2V0cygpIHtcbiAgcmV0dXJuICcge1xcbic7XG59XG5cbmZ1bmN0aW9uIGNsb3NlQnJhY2tldHMoKSB7XG4gIHJldHVybiAnfVxcbic7XG59XG4iLG51bGxdfQ==
