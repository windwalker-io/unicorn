import { g as getDefaultExportFromCjs } from "./_commonjsHelpers.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var monthSelect$1 = { exports: {} };
var monthSelect = /* @__PURE__ */ (() => monthSelect$1.exports)();
var hasRequiredMonthSelect;
function requireMonthSelect() {
  if (hasRequiredMonthSelect) return monthSelect$1.exports;
  hasRequiredMonthSelect = 1;
  (function(module, exports$1) {
    (function(global, factory) {
      module.exports = factory();
    })(monthSelect, (function() {
      var __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      var monthToStr = function(monthNumber, shorthand, locale) {
        return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
      };
      function clearNode(node) {
        while (node.firstChild)
          node.removeChild(node.firstChild);
      }
      function getEventTarget(event) {
        try {
          if (typeof event.composedPath === "function") {
            var path = event.composedPath();
            return path[0];
          }
          return event.target;
        } catch (error) {
          return event.target;
        }
      }
      var defaultConfig = {
        shorthand: false,
        dateFormat: "F Y",
        altFormat: "F Y",
        theme: "light"
      };
      function monthSelectPlugin(pluginConfig) {
        var config = __assign(__assign({}, defaultConfig), pluginConfig);
        return function(fp) {
          fp.config.dateFormat = config.dateFormat;
          fp.config.altFormat = config.altFormat;
          var self = { monthsContainer: null };
          function clearUnnecessaryDOMElements() {
            if (!fp.rContainer)
              return;
            clearNode(fp.rContainer);
            for (var index2 = 0; index2 < fp.monthElements.length; index2++) {
              var element = fp.monthElements[index2];
              if (!element.parentNode)
                continue;
              element.parentNode.removeChild(element);
            }
          }
          function build() {
            if (!fp.rContainer)
              return;
            self.monthsContainer = fp._createElement("div", "flatpickr-monthSelect-months");
            self.monthsContainer.tabIndex = -1;
            buildMonths();
            fp.rContainer.appendChild(self.monthsContainer);
            fp.calendarContainer.classList.add("flatpickr-monthSelect-theme-" + config.theme);
          }
          function buildMonths() {
            if (!self.monthsContainer)
              return;
            clearNode(self.monthsContainer);
            var frag = document.createDocumentFragment();
            for (var i = 0; i < 12; i++) {
              var month = fp.createDay("flatpickr-monthSelect-month", new Date(fp.currentYear, i), 0, i);
              if (month.dateObj.getMonth() === (/* @__PURE__ */ new Date()).getMonth() && month.dateObj.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear())
                month.classList.add("today");
              month.textContent = monthToStr(i, config.shorthand, fp.l10n);
              month.addEventListener("click", selectMonth);
              frag.appendChild(month);
            }
            self.monthsContainer.appendChild(frag);
            if (fp.config.minDate && fp.currentYear === fp.config.minDate.getFullYear())
              fp.prevMonthNav.classList.add("flatpickr-disabled");
            else
              fp.prevMonthNav.classList.remove("flatpickr-disabled");
            if (fp.config.maxDate && fp.currentYear === fp.config.maxDate.getFullYear())
              fp.nextMonthNav.classList.add("flatpickr-disabled");
            else
              fp.nextMonthNav.classList.remove("flatpickr-disabled");
          }
          function bindEvents() {
            fp._bind(fp.prevMonthNav, "click", function(e) {
              e.preventDefault();
              e.stopPropagation();
              fp.changeYear(fp.currentYear - 1);
              selectYear();
              buildMonths();
            });
            fp._bind(fp.nextMonthNav, "click", function(e) {
              e.preventDefault();
              e.stopPropagation();
              fp.changeYear(fp.currentYear + 1);
              selectYear();
              buildMonths();
            });
            fp._bind(self.monthsContainer, "mouseover", function(e) {
              if (fp.config.mode === "range")
                fp.onMouseOver(getEventTarget(e), "flatpickr-monthSelect-month");
            });
          }
          function setCurrentlySelected() {
            if (!fp.rContainer)
              return;
            if (!fp.selectedDates.length)
              return;
            var currentlySelected = fp.rContainer.querySelectorAll(".flatpickr-monthSelect-month.selected");
            for (var index2 = 0; index2 < currentlySelected.length; index2++) {
              currentlySelected[index2].classList.remove("selected");
            }
            var targetMonth = fp.selectedDates[0].getMonth();
            var month = fp.rContainer.querySelector(".flatpickr-monthSelect-month:nth-child(" + (targetMonth + 1) + ")");
            if (month) {
              month.classList.add("selected");
            }
          }
          function selectYear() {
            var selectedDate = fp.selectedDates[0];
            if (selectedDate) {
              selectedDate = new Date(selectedDate);
              selectedDate.setFullYear(fp.currentYear);
              if (fp.config.minDate && selectedDate < fp.config.minDate) {
                selectedDate = fp.config.minDate;
              }
              if (fp.config.maxDate && selectedDate > fp.config.maxDate) {
                selectedDate = fp.config.maxDate;
              }
              fp.currentYear = selectedDate.getFullYear();
            }
            fp.currentYearElement.value = String(fp.currentYear);
            if (fp.rContainer) {
              var months = fp.rContainer.querySelectorAll(".flatpickr-monthSelect-month");
              months.forEach(function(month) {
                month.dateObj.setFullYear(fp.currentYear);
                if (fp.config.minDate && month.dateObj < fp.config.minDate || fp.config.maxDate && month.dateObj > fp.config.maxDate) {
                  month.classList.add("flatpickr-disabled");
                } else {
                  month.classList.remove("flatpickr-disabled");
                }
              });
            }
            setCurrentlySelected();
          }
          function selectMonth(e) {
            e.preventDefault();
            e.stopPropagation();
            var eventTarget = getEventTarget(e);
            if (!(eventTarget instanceof Element))
              return;
            if (eventTarget.classList.contains("flatpickr-disabled"))
              return;
            if (eventTarget.classList.contains("notAllowed"))
              return;
            setMonth(eventTarget.dateObj);
            if (fp.config.closeOnSelect) {
              var single = fp.config.mode === "single";
              var range = fp.config.mode === "range" && fp.selectedDates.length === 2;
              if (single || range)
                fp.close();
            }
          }
          function setMonth(date) {
            var selectedDate = new Date(fp.currentYear, date.getMonth(), date.getDate());
            var selectedDates = [];
            switch (fp.config.mode) {
              case "single":
                selectedDates = [selectedDate];
                break;
              case "multiple":
                selectedDates.push(selectedDate);
                break;
              case "range":
                if (fp.selectedDates.length === 2) {
                  selectedDates = [selectedDate];
                } else {
                  selectedDates = fp.selectedDates.concat([selectedDate]);
                  selectedDates.sort(function(a, b) {
                    return a.getTime() - b.getTime();
                  });
                }
                break;
            }
            fp.setDate(selectedDates, true);
            setCurrentlySelected();
          }
          var shifts = {
            37: -1,
            39: 1,
            40: 3,
            38: -3
          };
          function onKeyDown(_, __, ___, e) {
            var shouldMove = shifts[e.keyCode] !== void 0;
            if (!shouldMove && e.keyCode !== 13) {
              return;
            }
            if (!fp.rContainer || !self.monthsContainer)
              return;
            var currentlySelected = fp.rContainer.querySelector(".flatpickr-monthSelect-month.selected");
            var index2 = Array.prototype.indexOf.call(self.monthsContainer.children, document.activeElement);
            if (index2 === -1) {
              var target = currentlySelected || self.monthsContainer.firstElementChild;
              target.focus();
              index2 = target.$i;
            }
            if (shouldMove) {
              self.monthsContainer.children[(12 + index2 + shifts[e.keyCode]) % 12].focus();
            } else if (e.keyCode === 13 && self.monthsContainer.contains(document.activeElement)) {
              setMonth(document.activeElement.dateObj);
            }
          }
          function closeHook() {
            var _a;
            if (((_a = fp.config) === null || _a === void 0 ? void 0 : _a.mode) === "range" && fp.selectedDates.length === 1)
              fp.clear(false);
            if (!fp.selectedDates.length)
              buildMonths();
          }
          function stubCurrentMonth() {
            config._stubbedCurrentMonth = fp._initialDate.getMonth();
            fp._initialDate.setMonth(config._stubbedCurrentMonth);
            fp.currentMonth = config._stubbedCurrentMonth;
          }
          function unstubCurrentMonth() {
            if (!config._stubbedCurrentMonth)
              return;
            fp._initialDate.setMonth(config._stubbedCurrentMonth);
            fp.currentMonth = config._stubbedCurrentMonth;
            delete config._stubbedCurrentMonth;
          }
          function destroyPluginInstance() {
            if (self.monthsContainer !== null) {
              var months = self.monthsContainer.querySelectorAll(".flatpickr-monthSelect-month");
              for (var index2 = 0; index2 < months.length; index2++) {
                months[index2].removeEventListener("click", selectMonth);
              }
            }
          }
          return {
            onParseConfig: function() {
              fp.config.enableTime = false;
            },
            onValueUpdate: setCurrentlySelected,
            onKeyDown,
            onReady: [
              stubCurrentMonth,
              clearUnnecessaryDOMElements,
              build,
              bindEvents,
              setCurrentlySelected,
              function() {
                fp.config.onClose.push(closeHook);
                fp.loadedPlugins.push("monthSelect");
              }
            ],
            onDestroy: [
              unstubCurrentMonth,
              destroyPluginInstance,
              function() {
                fp.config.onClose = fp.config.onClose.filter(function(hook) {
                  return hook !== closeHook;
                });
              }
            ]
          };
        };
      }
      return monthSelectPlugin;
    }));
  })(monthSelect$1);
  return monthSelect$1.exports;
}
var monthSelectExports = /* @__PURE__ */ requireMonthSelect();
const index = /* @__PURE__ */ getDefaultExportFromCjs(monthSelectExports);
const index$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: index
}, [monthSelectExports]);
export {
  index$1 as i
};
//# sourceMappingURL=index.js.map
