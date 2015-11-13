'use strict';

/**
 * Created by zyg on 15/11/13.
 */
require('babel-polyfill');
var fn = function fn() {
  return new Promise(function (resolve, rej) {
    rej('await');
  });
};

var a = function _callee() {
  var b;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return regeneratorRuntime.awrap(fn());

      case 2:
        b = _context.sent;

        console.log('b:', b);

      case 4:
      case 'end':
        return _context.stop();
    }
  }, null, this);
};

a();
