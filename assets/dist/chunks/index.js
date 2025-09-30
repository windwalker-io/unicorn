import { g as getDefaultExportFromCjs } from "./legacy/legacy.js";
var monthSelect$1 = { exports: {} };
var monthSelect = /* @__PURE__ */ (() => monthSelect$1.exports)();
var hasRequiredMonthSelect;
function requireMonthSelect() {
  if (hasRequiredMonthSelect) return monthSelect$1.exports;
  hasRequiredMonthSelect = 1;
  (function(module, exports) {
    (function(global, factory) {
      module.exports = factory();
    })(monthSelect, (function() {
      /*! *****************************************************************************
      		    Copyright (c) Microsoft Corporation.
      
      		    Permission to use, copy, modify, and/or distribute this software for any
      		    purpose with or without fee is hereby granted.
      
      		    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      		    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      		    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      		    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      		    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      		    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      		    PERFORMANCE OF THIS SOFTWARE.
      		    ***************************************************************************** */
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
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index
}, /* @__PURE__ */ (() => Symbol.toStringTag)(), { value: "Module" }));
export {
  index$1 as i
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9mbGF0cGlja3IvZGlzdC9wbHVnaW5zL21vbnRoU2VsZWN0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLm1vbnRoU2VsZWN0UGx1Z2luID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcbiAgICBQZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxuICAgIHB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcbiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcbiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuICAgIEFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuICAgIElORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG4gICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuICAgIE9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuICAgIFBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuICAgIHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH07XG5cbiAgICB2YXIgbW9udGhUb1N0ciA9IGZ1bmN0aW9uIChtb250aE51bWJlciwgc2hvcnRoYW5kLCBsb2NhbGUpIHsgcmV0dXJuIGxvY2FsZS5tb250aHNbc2hvcnRoYW5kID8gXCJzaG9ydGhhbmRcIiA6IFwibG9uZ2hhbmRcIl1bbW9udGhOdW1iZXJdOyB9O1xuXG4gICAgZnVuY3Rpb24gY2xlYXJOb2RlKG5vZGUpIHtcbiAgICAgICAgd2hpbGUgKG5vZGUuZmlyc3RDaGlsZClcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXQoZXZlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQuY29tcG9zZWRQYXRoID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGV2ZW50LmNvbXBvc2VkUGF0aCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LnRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBldmVudC50YXJnZXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgc2hvcnRoYW5kOiBmYWxzZSxcbiAgICAgICAgZGF0ZUZvcm1hdDogXCJGIFlcIixcbiAgICAgICAgYWx0Rm9ybWF0OiBcIkYgWVwiLFxuICAgICAgICB0aGVtZTogXCJsaWdodFwiLFxuICAgIH07XG4gICAgZnVuY3Rpb24gbW9udGhTZWxlY3RQbHVnaW4ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgIHZhciBjb25maWcgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVmYXVsdENvbmZpZyksIHBsdWdpbkNvbmZpZyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZnApIHtcbiAgICAgICAgICAgIGZwLmNvbmZpZy5kYXRlRm9ybWF0ID0gY29uZmlnLmRhdGVGb3JtYXQ7XG4gICAgICAgICAgICBmcC5jb25maWcuYWx0Rm9ybWF0ID0gY29uZmlnLmFsdEZvcm1hdDtcbiAgICAgICAgICAgIHZhciBzZWxmID0geyBtb250aHNDb250YWluZXI6IG51bGwgfTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyVW5uZWNlc3NhcnlET01FbGVtZW50cygpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZwLnJDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjbGVhck5vZGUoZnAuckNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGZwLm1vbnRoRWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZnAubW9udGhFbGVtZW50c1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBidWlsZCgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZwLnJDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBzZWxmLm1vbnRoc0NvbnRhaW5lciA9IGZwLl9jcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLW1vbnRoU2VsZWN0LW1vbnRoc1wiKTtcbiAgICAgICAgICAgICAgICBzZWxmLm1vbnRoc0NvbnRhaW5lci50YWJJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgIGJ1aWxkTW9udGhzKCk7XG4gICAgICAgICAgICAgICAgZnAuckNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLm1vbnRoc0NvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgZnAuY2FsZW5kYXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImZsYXRwaWNrci1tb250aFNlbGVjdC10aGVtZS1cIiArIGNvbmZpZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBidWlsZE1vbnRocygpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYubW9udGhzQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2xlYXJOb2RlKHNlbGYubW9udGhzQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRoID0gZnAuY3JlYXRlRGF5KFwiZmxhdHBpY2tyLW1vbnRoU2VsZWN0LW1vbnRoXCIsIG5ldyBEYXRlKGZwLmN1cnJlbnRZZWFyLCBpKSwgMCwgaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb250aC5kYXRlT2JqLmdldE1vbnRoKCkgPT09IG5ldyBEYXRlKCkuZ2V0TW9udGgoKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGguZGF0ZU9iai5nZXRGdWxsWWVhcigpID09PSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aC5jbGFzc0xpc3QuYWRkKFwidG9kYXlcIik7XG4gICAgICAgICAgICAgICAgICAgIG1vbnRoLnRleHRDb250ZW50ID0gbW9udGhUb1N0cihpLCBjb25maWcuc2hvcnRoYW5kLCBmcC5sMTBuKTtcbiAgICAgICAgICAgICAgICAgICAgbW9udGguYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlbGVjdE1vbnRoKTtcbiAgICAgICAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChtb250aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYubW9udGhzQ29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xuICAgICAgICAgICAgICAgIGlmIChmcC5jb25maWcubWluRGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICBmcC5jdXJyZW50WWVhciA9PT0gZnAuY29uZmlnLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSlcbiAgICAgICAgICAgICAgICAgICAgZnAucHJldk1vbnRoTmF2LmNsYXNzTGlzdC5hZGQoXCJmbGF0cGlja3ItZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmcC5wcmV2TW9udGhOYXYuY2xhc3NMaXN0LnJlbW92ZShcImZsYXRwaWNrci1kaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZnAuY29uZmlnLm1heERhdGUgJiZcbiAgICAgICAgICAgICAgICAgICAgZnAuY3VycmVudFllYXIgPT09IGZwLmNvbmZpZy5tYXhEYXRlLmdldEZ1bGxZZWFyKCkpXG4gICAgICAgICAgICAgICAgICAgIGZwLm5leHRNb250aE5hdi5jbGFzc0xpc3QuYWRkKFwiZmxhdHBpY2tyLWRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZnAubmV4dE1vbnRoTmF2LmNsYXNzTGlzdC5yZW1vdmUoXCJmbGF0cGlja3ItZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBiaW5kRXZlbnRzKCkge1xuICAgICAgICAgICAgICAgIGZwLl9iaW5kKGZwLnByZXZNb250aE5hdiwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGZwLmNoYW5nZVllYXIoZnAuY3VycmVudFllYXIgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0WWVhcigpO1xuICAgICAgICAgICAgICAgICAgICBidWlsZE1vbnRocygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZwLl9iaW5kKGZwLm5leHRNb250aE5hdiwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGZwLmNoYW5nZVllYXIoZnAuY3VycmVudFllYXIgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0WWVhcigpO1xuICAgICAgICAgICAgICAgICAgICBidWlsZE1vbnRocygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZwLl9iaW5kKHNlbGYubW9udGhzQ29udGFpbmVyLCBcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnAuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGZwLm9uTW91c2VPdmVyKGdldEV2ZW50VGFyZ2V0KGUpLCBcImZsYXRwaWNrci1tb250aFNlbGVjdC1tb250aFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRseVNlbGVjdGVkKCkge1xuICAgICAgICAgICAgICAgIGlmICghZnAuckNvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICghZnAuc2VsZWN0ZWREYXRlcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudGx5U2VsZWN0ZWQgPSBmcC5yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmxhdHBpY2tyLW1vbnRoU2VsZWN0LW1vbnRoLnNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBjdXJyZW50bHlTZWxlY3RlZC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5U2VsZWN0ZWRbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldE1vbnRoID0gZnAuc2VsZWN0ZWREYXRlc1swXS5nZXRNb250aCgpO1xuICAgICAgICAgICAgICAgIHZhciBtb250aCA9IGZwLnJDb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5mbGF0cGlja3ItbW9udGhTZWxlY3QtbW9udGg6bnRoLWNoaWxkKFwiICsgKHRhcmdldE1vbnRoICsgMSkgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBzZWxlY3RZZWFyKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZERhdGUgPSBmcC5zZWxlY3RlZERhdGVzWzBdO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREYXRlID0gbmV3IERhdGUoc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREYXRlLnNldEZ1bGxZZWFyKGZwLmN1cnJlbnRZZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZwLmNvbmZpZy5taW5EYXRlICYmIHNlbGVjdGVkRGF0ZSA8IGZwLmNvbmZpZy5taW5EYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZERhdGUgPSBmcC5jb25maWcubWluRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZnAuY29uZmlnLm1heERhdGUgJiYgc2VsZWN0ZWREYXRlID4gZnAuY29uZmlnLm1heERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGF0ZSA9IGZwLmNvbmZpZy5tYXhEYXRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZwLmN1cnJlbnRZZWFyID0gc2VsZWN0ZWREYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZwLmN1cnJlbnRZZWFyRWxlbWVudC52YWx1ZSA9IFN0cmluZyhmcC5jdXJyZW50WWVhcik7XG4gICAgICAgICAgICAgICAgaWYgKGZwLnJDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRocyA9IGZwLnJDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi5mbGF0cGlja3ItbW9udGhTZWxlY3QtbW9udGhcIik7XG4gICAgICAgICAgICAgICAgICAgIG1vbnRocy5mb3JFYWNoKGZ1bmN0aW9uIChtb250aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGguZGF0ZU9iai5zZXRGdWxsWWVhcihmcC5jdXJyZW50WWVhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZwLmNvbmZpZy5taW5EYXRlICYmIG1vbnRoLmRhdGVPYmogPCBmcC5jb25maWcubWluRGF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnAuY29uZmlnLm1heERhdGUgJiYgbW9udGguZGF0ZU9iaiA+IGZwLmNvbmZpZy5tYXhEYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoLmNsYXNzTGlzdC5hZGQoXCJmbGF0cGlja3ItZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aC5jbGFzc0xpc3QucmVtb3ZlKFwiZmxhdHBpY2tyLWRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudGx5U2VsZWN0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNlbGVjdE1vbnRoKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRUYXJnZXQgPSBnZXRFdmVudFRhcmdldChlKTtcbiAgICAgICAgICAgICAgICBpZiAoIShldmVudFRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImZsYXRwaWNrci1kaXNhYmxlZFwiKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChldmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJub3RBbGxvd2VkXCIpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIG5lY2Vzc2FyeT8/XG4gICAgICAgICAgICAgICAgc2V0TW9udGgoZXZlbnRUYXJnZXQuZGF0ZU9iaik7XG4gICAgICAgICAgICAgICAgaWYgKGZwLmNvbmZpZy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzaW5nbGUgPSBmcC5jb25maWcubW9kZSA9PT0gXCJzaW5nbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gZnAuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIiAmJiBmcC5zZWxlY3RlZERhdGVzLmxlbmd0aCA9PT0gMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZSB8fCByYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZwLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0TW9udGgoZGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZERhdGUgPSBuZXcgRGF0ZShmcC5jdXJyZW50WWVhciwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkRGF0ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGZwLmNvbmZpZy5tb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzaW5nbGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGF0ZXMgPSBbc2VsZWN0ZWREYXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibXVsdGlwbGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGF0ZXMucHVzaChzZWxlY3RlZERhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyYW5nZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZwLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREYXRlcyA9IFtzZWxlY3RlZERhdGVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREYXRlcyA9IGZwLnNlbGVjdGVkRGF0ZXMuY29uY2F0KFtzZWxlY3RlZERhdGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZERhdGVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuZ2V0VGltZSgpIC0gYi5nZXRUaW1lKCk7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZwLnNldERhdGUoc2VsZWN0ZWREYXRlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudGx5U2VsZWN0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzaGlmdHMgPSB7XG4gICAgICAgICAgICAgICAgMzc6IC0xLFxuICAgICAgICAgICAgICAgIDM5OiAxLFxuICAgICAgICAgICAgICAgIDQwOiAzLFxuICAgICAgICAgICAgICAgIDM4OiAtMyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmdW5jdGlvbiBvbktleURvd24oXywgX18sIF9fXywgZSkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRNb3ZlID0gc2hpZnRzW2Uua2V5Q29kZV0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoIXNob3VsZE1vdmUgJiYgZS5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZnAuckNvbnRhaW5lciB8fCAhc2VsZi5tb250aHNDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudGx5U2VsZWN0ZWQgPSBmcC5yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuZmxhdHBpY2tyLW1vbnRoU2VsZWN0LW1vbnRoLnNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2VsZi5tb250aHNDb250YWluZXIuY2hpbGRyZW4sIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGN1cnJlbnRseVNlbGVjdGVkIHx8IHNlbGYubW9udGhzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB0YXJnZXQuJGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzaG91bGRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubW9udGhzQ29udGFpbmVyLmNoaWxkcmVuWygxMiArIGluZGV4ICsgc2hpZnRzW2Uua2V5Q29kZV0pICUgMTJdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMTMgJiZcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tb250aHNDb250YWluZXIuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0TW9udGgoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5kYXRlT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZUhvb2soKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGlmICgoKF9hID0gZnAuY29uZmlnKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubW9kZSkgPT09IFwicmFuZ2VcIiAmJiBmcC5zZWxlY3RlZERhdGVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgZnAuY2xlYXIoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmICghZnAuc2VsZWN0ZWREYXRlcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkTW9udGhzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBIZWxwIHRoZSBwcmV2L25leHQgeWVhciBuYXYgaG9ub3IgY29uZmlnLm1pbkRhdGUgKHNlZSAzZmE1YTY5KVxuICAgICAgICAgICAgZnVuY3Rpb24gc3R1YkN1cnJlbnRNb250aCgpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3N0dWJiZWRDdXJyZW50TW9udGggPSBmcC5faW5pdGlhbERhdGUuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgICAgICBmcC5faW5pdGlhbERhdGUuc2V0TW9udGgoY29uZmlnLl9zdHViYmVkQ3VycmVudE1vbnRoKTtcbiAgICAgICAgICAgICAgICBmcC5jdXJyZW50TW9udGggPSBjb25maWcuX3N0dWJiZWRDdXJyZW50TW9udGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiB1bnN0dWJDdXJyZW50TW9udGgoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb25maWcuX3N0dWJiZWRDdXJyZW50TW9udGgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBmcC5faW5pdGlhbERhdGUuc2V0TW9udGgoY29uZmlnLl9zdHViYmVkQ3VycmVudE1vbnRoKTtcbiAgICAgICAgICAgICAgICBmcC5jdXJyZW50TW9udGggPSBjb25maWcuX3N0dWJiZWRDdXJyZW50TW9udGg7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5fc3R1YmJlZEN1cnJlbnRNb250aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lQbHVnaW5JbnN0YW5jZSgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tb250aHNDb250YWluZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRocyA9IHNlbGYubW9udGhzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmxhdHBpY2tyLW1vbnRoU2VsZWN0LW1vbnRoXCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbW9udGhzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhzW2luZGV4XS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0TW9udGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvblBhcnNlQ29uZmlnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZwLmNvbmZpZy5lbmFibGVUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvblZhbHVlVXBkYXRlOiBzZXRDdXJyZW50bHlTZWxlY3RlZCxcbiAgICAgICAgICAgICAgICBvbktleURvd246IG9uS2V5RG93bixcbiAgICAgICAgICAgICAgICBvblJlYWR5OiBbXG4gICAgICAgICAgICAgICAgICAgIHN0dWJDdXJyZW50TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVW5uZWNlc3NhcnlET01FbGVtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQsXG4gICAgICAgICAgICAgICAgICAgIGJpbmRFdmVudHMsXG4gICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRseVNlbGVjdGVkLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcC5jb25maWcub25DbG9zZS5wdXNoKGNsb3NlSG9vayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcC5sb2FkZWRQbHVnaW5zLnB1c2goXCJtb250aFNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIG9uRGVzdHJveTogW1xuICAgICAgICAgICAgICAgICAgICB1bnN0dWJDdXJyZW50TW9udGgsXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lQbHVnaW5JbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnAuY29uZmlnLm9uQ2xvc2UgPSBmcC5jb25maWcub25DbG9zZS5maWx0ZXIoZnVuY3Rpb24gKGhvb2spIHsgcmV0dXJuIGhvb2sgIT09IGNsb3NlSG9vazsgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vbnRoU2VsZWN0UGx1Z2luO1xuXG59KSkpO1xuIl0sIm5hbWVzIjpbInRoaXMiLCJfX2Fzc2lnbiIsImluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLEtBQUMsU0FBVSxRQUFRLFNBQVM7QUFDdUMsYUFBQSxVQUFpQjtJQUdwRixHQUFFQSxjQUFPLFdBQVk7QUFBQSxNQUVyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FB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
