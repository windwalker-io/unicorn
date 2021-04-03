(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.foo = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Foo = void 0;

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */
  var Foo = 123;
  _exports.Foo = Foo;
});
//# sourceMappingURL=foo.js.map
