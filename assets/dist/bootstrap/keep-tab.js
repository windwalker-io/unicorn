function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */
(function () {
  var LoadTab = /*#__PURE__*/function () {
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
      this.$element = $element;
      this.tabButtons = $element.querySelectorAll('[data-toggle=tab],[data-bs-toggle=tab]');
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
        return u.selectAll(this.$element.querySelectorAll("[data-toggle=\"tab\"],[data-bs-toggle=\"tab\"]")).filter(function (button) {
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
        u.$ui.bootstrap.tab(tabTrigger).show();
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

          var seperatorIndex = tabhref.indexOf('-');

          if (seperatorIndex !== -1) {
            var singular = tabhref.substring(0, seperatorIndex);
            var plural = singular + 's';
            this.activateTab(plural);
          }
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
        console.log(text);
        return u.md5(text);
      }
    }]);

    return LoadTab;
  }();

  window.LoadTab = LoadTab;
})();
//# sourceMappingURL=keep-tab.js.map
