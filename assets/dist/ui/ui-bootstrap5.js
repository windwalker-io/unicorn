System.register([], function (_export, _context) {
  "use strict";

  var UIBootstrap5;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      /**
       * Part of starter project.
       *
       * @copyright  Copyright (C) 2021 __ORGANIZATION__.
       * @license    __LICENSE__
       */
      _export("UIBootstrap5", UIBootstrap5 = /*#__PURE__*/function () {
        function UIBootstrap5(ui) {
          _classCallCheck(this, UIBootstrap5);

          this.ui = ui;
          this.app = ui.app;
        }
        /**
         * @see https://getbootstrap.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere
         *
         * @param selector
         * @param config
         */


        _createClass(UIBootstrap5, [{
          key: "tooltip",
          value: function tooltip() {
            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle="tooltip"]';
            var config = arguments.length > 1 ? arguments[1] : undefined;
            var tooltipTriggerList = [].slice.call(document.querySelectorAll(selector));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
              return new bootstrap.Tooltip(tooltipTriggerEl, config);
            });
          }
        }], [{
          key: "install",
          value: function install(unicorn) {
            unicorn.ui.bootstrap = new this(unicorn.ui);
          }
        }]);

        return UIBootstrap5;
      }());
    }
  };
});
//# sourceMappingURL=ui-bootstrap5.js.map
