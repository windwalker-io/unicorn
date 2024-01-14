System.register([], function (_export, _context) {
  "use strict";

  var LoadTab;
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  _export("LoadTab", void 0);
  return {
    setters: [],
    execute: function () {
      _export("LoadTab", LoadTab = class LoadTab {
        /**
         * Class init.
         *
         * @param {HTMLElement|string} selector
         * @param {Object}      options
         *
         * @constructor
         */
        constructor(selector) {
          let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          let uid = selector;
          if (typeof selector === 'object') {
            uid = options.uid || selector.id;
          }
          const $element = this.$element = u.selectOne(selector);
          if (!$element) {
            console.warn(`[KeepTab] Element ${selector} not found.`);
            return;
          }
          this.$element = $element;
          this.tabButtons = $element.querySelectorAll(this.constructor.TAB_ITEM_SELECTOR);
          this.storageKey = 'tab-href-' + this.hashCode(location.href + ':' + uid);
          this.options = options;
          this.bindEvents();
          setTimeout(() => {
            this.switchTab();
          }, this.options.delay || 0);
        }
        bindEvents() {
          [].forEach.call(this.tabButtons, button => {
            button.addEventListener('click', () => {
              // Store the selected tab href in localstorage
              window.localStorage.setItem(this.storageKey, this.getButtonHref(button));
            });
          });
        }
        getButtonHref(button) {
          return button.dataset.bsTarget || button.dataset.target || button.href;
        }
        findTabButtonByHref(href) {
          return u.selectAll(this.$element.querySelectorAll(this.constructor.TAB_ITEM_SELECTOR)).filter(button => {
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
        activateTab(href) {
          const tabTrigger = this.findTabButtonByHref(href);
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
        hasTab(href) {
          return this.findTabButtonByHref(href) != null;
        }

        /**
         * Switch tab.
         *
         * @returns {boolean}
         */
        switchTab() {
          if (localStorage.getItem(this.storageKey)) {
            // When moving from tab area to a different view
            if (!this.hasTab(localStorage.getItem(this.storageKey))) {
              localStorage.removeItem(this.storageKey);
              return true;
            }

            // Clean default tabs
            // u.selectOne(this.$element, '[data-toggle="tab"], [data-bs-toggle=tab]')
            // this.$element.querySelector('a[data-toggle="tab"]').parent().removeClass('active');

            const tabhref = localStorage.getItem(this.storageKey);

            // Add active attribute for selected tab indicated by url
            this.activateTab(tabhref);

            // Check whether internal tab is selected (in format <tabname>-<id>)
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
        hashCode(text) {
          return u.md5(text);
        }
      });
      _defineProperty(LoadTab, "TAB_ITEM_SELECTOR", '[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]');
    }
  };
});
//# sourceMappingURL=keep-tab.js.map
