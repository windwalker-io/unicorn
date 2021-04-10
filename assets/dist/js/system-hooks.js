System.register([], function (_export, _context) {
  "use strict";

  var version;
  return {
    setters: [],
    execute: function () {
      /**
       * Part of starter project.
       *
       * @copyright  Copyright (C) 2021 __ORGANIZATION__.
       * @license    __LICENSE__
       */
      version = document.querySelector('meta[name=asset-version]').getAttribute('content');

      System.constructor.prototype.createScript = function (url) {
        if (url.indexOf('?') !== -1) {
          url += '&' + version;
        } else {
          url += '?' + version;
        }

        return Object.assign(document.createElement('script'), {
          src: url
        });
      };
    }
  };
});
//# sourceMappingURL=system-hooks.js.map
