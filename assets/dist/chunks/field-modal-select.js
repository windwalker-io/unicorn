import { v as selectOne, U as highlight, _ as __, ac as data, B as html, P as slideUp } from "./unicorn.js";
import { b as baseAssignValue, a as assignValue, i as isIndex, c as isPrototype, d as arrayLikeKeys, g as getPrototype, k as keys } from "./_getPrototype.js";
import { b as baseRest, a as apply } from "./_baseRest.js";
import { i as isObjectLike, b as baseGetTag, a as isArray, S as Symbol$1, c as isObject, d as isArrayLike, e as eq } from "./isArguments.js";
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var symbolProto = Symbol$1 ? /* @__PURE__ */ (() => Symbol$1.prototype)() : void 0, symbolToString = symbolProto ? /* @__PURE__ */ (() => symbolProto.toString)() : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
    return eq(object[index], value);
  }
  return false;
}
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$3 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$3 = /* @__PURE__ */ (() => objectProto$3.hasOwnProperty)();
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$3.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var assignInWith = /* @__PURE__ */ createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});
function toString(value) {
  return value == null ? "" : baseToString(value);
}
var objectTag = "[object Object]";
var funcProto = /* @__PURE__ */ (() => Function.prototype)(), objectProto$2 = /* @__PURE__ */ (() => Object.prototype)();
var funcToString = /* @__PURE__ */ (() => funcProto.toString)();
var hasOwnProperty$2 = /* @__PURE__ */ (() => objectProto$2.hasOwnProperty)();
var objectCtorString = /* @__PURE__ */ funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var domExcTag = "[object DOMException]", errorTag = "[object Error]";
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
}
var attempt = /* @__PURE__ */ baseRest(function(func, args) {
  try {
    return apply(func, void 0, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});
function basePropertyOf(object) {
  return function(key) {
    return object == null ? void 0 : object[key];
  };
}
var htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var escapeHtmlChar = /* @__PURE__ */ basePropertyOf(htmlEscapes);
var reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = /* @__PURE__ */ RegExp(/* @__PURE__ */ (() => reUnescapedHtml.source)());
function escape(string) {
  string = toString(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}
var objectProto$1 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$1 = /* @__PURE__ */ (() => objectProto$1.hasOwnProperty)();
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === void 0 || eq(objValue, objectProto$1[key]) && !hasOwnProperty$1.call(object, key)) {
    return srcValue;
  }
  return objValue;
}
var stringEscapes = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function escapeStringChar(chr) {
  return "\\" + stringEscapes[chr];
}
var reInterpolate = /<%=([\s\S]+?)%>/g;
var reEscape = /<%-([\s\S]+?)%>/g;
var reEvaluate = /<%([\s\S]+?)%>/g;
var templateSettings = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  "escape": reEscape,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  "evaluate": reEvaluate,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  "interpolate": reInterpolate,
  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  "variable": "",
  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  "imports": {
    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    "_": { "escape": escape }
  }
};
var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
var reNoMatch = /($^)/;
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
var objectProto = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty = /* @__PURE__ */ (() => objectProto.hasOwnProperty)();
function template(string, options, guard) {
  var settings = templateSettings.imports._.templateSettings || templateSettings;
  string = toString(string);
  options = assignInWith({}, options, settings, customDefaultsAssignIn);
  var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
  var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
    "g"
  );
  var sourceURL = hasOwnProperty.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
  string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);
    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;
    return match;
  });
  source += "';\n";
  var variable = hasOwnProperty.call(options, "variable") && options.variable;
  if (!variable) {
    source = "with (obj) {\n" + source + "\n}\n";
  } else if (reForbiddenIdentifierChars.test(variable)) {
    throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
  }
  source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
  source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
  var result = attempt(function() {
    return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
  });
  result.source = source;
  if (isError(result)) {
    throw result;
  }
  return result;
}
function createCallback(type, selector, modalSelector) {
  switch (type) {
    // case 'tag':
    //   return () => {
    //
    //   };
    case "list":
      return (item) => {
        const modalList = document.querySelector(selector);
        if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
          modalList.appendItem(item, true);
          selectOne(modalSelector)?.close();
        } else {
          alert(__("unicorn.field.modal.already.selected"));
        }
      };
    case "single":
    default:
      return (item) => {
        const element = document.querySelector(selector);
        const image = element.querySelector("[data-role=image]");
        const title = element.querySelector("[data-role=title]");
        const store = element.querySelector("[data-role=value]");
        if (image && item.image) {
          image.style.backgroundImage = `url(${item.image});`;
        }
        title.value = item.title || "";
        store.value = item.value || "";
        store.dispatchEvent(new CustomEvent("change"));
        selectOne(modalSelector)?.close();
        highlight(title);
      };
  }
}
class ModalListSelectElement extends HTMLElement {
  static is = "uni-modal-list";
  itemTemplate;
  options;
  get listContainer() {
    return this.querySelector("[data-role=list-container]");
  }
  get modal() {
    return document.querySelector(this.options.modalSelector);
  }
  get items() {
    return Array.from(this.listContainer.children);
  }
  connectedCallback() {
    this.options = JSON.parse(this.getAttribute("options") || "{}");
    this.itemTemplate = template(document.querySelector(this.options.itemTemplate).innerHTML);
    const emptyInput = this.querySelector("[data-role=empty]");
    if (emptyInput) {
      emptyInput.name = emptyInput.dataset.name || "";
    }
    if (this.options.sortable) {
      import("sortablejs").then(({ default: Sortable }) => {
        new Sortable(this.listContainer, { handle: ".h-drag-handle", animation: 150 });
      });
    }
    const selectButton = this.querySelector("[data-role=select]");
    selectButton.addEventListener("click", (e) => {
      this.open(e);
    });
    this.querySelector("[data-role=clear]")?.addEventListener("click", () => {
      this.items.forEach((item) => {
        item.querySelector("[data-role=remove]")?.click();
      });
    });
    selectButton.style.pointerEvents = "";
    this.render();
  }
  render() {
    const items = data("unicorn.modal-field")[this.options.dataKey] || [];
    items.forEach((item) => {
      this.appendItem(item);
    });
  }
  appendItem(item, highlights = false) {
    const itemHtml = html(this.itemTemplate({ item }));
    itemHtml.dataset.value = item.value;
    itemHtml.querySelector("[data-role=remove]")?.addEventListener("click", () => {
      slideUp(itemHtml).then(() => {
        itemHtml.remove();
        this.toggleRequired();
      });
    });
    this.listContainer.appendChild(itemHtml);
    this.toggleRequired();
    if (highlights) {
      highlight(itemHtml);
    }
  }
  toggleRequired() {
    const placeholder = this.querySelector("[data-role=validation-placeholder]");
    if (placeholder) {
      placeholder.disabled = this.listContainer.children.length !== 0;
    }
  }
  open(event) {
    event.preventDefault();
    event.stopPropagation();
    const max = this.options.max;
    const target = event.target;
    if (!max) {
      this.modal?.open(target.href, { size: "modal-xl" });
      return;
    }
    if (this.listContainer.children.length >= max) {
      alert(
        __("unicorn.field.modal.max.selected", max)
      );
      return;
    }
    this.modal?.open(target.href, { size: "modal-xl" });
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => ModalListSelectElement.is)(), ModalListSelectElement);
export {
  createCallback
};
//# sourceMappingURL=field-modal-select.js.map
