System.register([], function (_export, _context) {
  "use strict";

  var LoadTab;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  return {
    setters: [],
    execute: function () {
      /**
       * Part of unicorn project.
       *
       * @copyright  Copyright (C) 2021 __ORGANIZATION__.
       * @license    __LICENSE__
       */
      _export("LoadTab", LoadTab = /*#__PURE__*/function () {
        /**
         * Class init.
         *
         * @param {HTMLElement|string} selector
         * @param {Object}      options
         *
         * @constructor
         */
        function LoadTab(selector) {
          var _this = this;

          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          _classCallCheck(this, LoadTab);

          var uid = selector;

          if (_typeof(selector) === 'object') {
            uid = options.uid || selector.id;
          }

          var $element = this.$element = u.selectOne(selector);

          if (!$element) {
            console.warn("[KeepTab] Element ".concat(selector, " not found."));
            return;
          }

          this.$element = $element;
          this.tabButtons = $element.querySelectorAll(this.constructor.TAB_ITEM_SELECTOR);
          this.storageKey = 'tab-href-' + this.hashCode(location.href + ':' + uid);
          this.options = options;
          this.bindEvents();
          setTimeout(function () {
            _this.switchTab();
          }, this.options.delay || 0);
        }

        _createClass(LoadTab, [{
          key: "bindEvents",
          value: function bindEvents() {
            var _this2 = this;

            [].forEach.call(this.tabButtons, function (button) {
              button.addEventListener('click', function () {
                // Store the selected tab href in localstorage
                window.localStorage.setItem(_this2.storageKey, _this2.getButtonHref(button));
              });
            });
          }
        }, {
          key: "getButtonHref",
          value: function getButtonHref(button) {
            return button.dataset.bsTarget || button.dataset.target || button.href;
          }
        }, {
          key: "findTabButtonByHref",
          value: function findTabButtonByHref(href) {
            return u.selectAll(this.$element.querySelectorAll(this.constructor.TAB_ITEM_SELECTOR)).filter(function (button) {
              if (button.href === href) {
                return true;
              }

              if (button.dataset.bsTarget === href) {
                return true;
              }

              return button.dataset.target === href;
            }).shift();
          }
          /**
           * Active tab.
           *
           * @param {string} href
           */

        }, {
          key: "activateTab",
          value: function activateTab(href) {
            var tabTrigger = this.findTabButtonByHref(href);

            if (tabTrigger) {
              new bootstrap.Tab(tabTrigger).show();
            }
          }
          /**
           * Has tab.
           *
           * @param {string} href
           *
           * @returns {*}
           */

        }, {
          key: "hasTab",
          value: function hasTab(href) {
            return this.findTabButtonByHref(href) != null;
          }
          /**
           * Switch tab.
           *
           * @returns {boolean}
           */

        }, {
          key: "switchTab",
          value: function switchTab() {
            if (localStorage.getItem(this.storageKey)) {
              // When moving from tab area to a different view
              if (!this.hasTab(localStorage.getItem(this.storageKey))) {
                localStorage.removeItem(this.storageKey);
                return true;
              } // Clean default tabs
              // u.selectOne(this.$element, '[data-toggle="tab"], [data-bs-toggle=tab]')
              // this.$element.querySelector('a[data-toggle="tab"]').parent().removeClass('active');


              var tabhref = localStorage.getItem(this.storageKey); // Add active attribute for selected tab indicated by url

              this.activateTab(tabhref); // Check whether internal tab is selected (in format <tabname>-<id>)
              // const seperatorIndex = tabhref.indexOf('-');
              //
              // if (seperatorIndex !== -1) {
              //   const singular = tabhref.substring(0, seperatorIndex);
              //   const plural = singular + 's';
              //
              //   this.activateTab(plural);
              // }
            }
          }
          /**
           * Hash code.
           *
           * @param {String} text
           *
           * @returns {number}
           */

        }, {
          key: "hashCode",
          value: function hashCode(text) {
            return u.md5(text);
          }
        }]);

        return LoadTab;
      }());

      _defineProperty(LoadTab, "TAB_ITEM_SELECTOR", '[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]');
    }
  };
});
//# sourceMappingURL=keep-tab.js.map
