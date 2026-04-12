import { t as data } from "./data.js";
import { d as selectOne, o as html } from "./dom.js";
import { a as highlight, m as slideUp } from "./ui.js";
import { r as simpleAlert } from "./alert.js";
import { a as eq, d as isObjectLike, f as baseGetTag, l as isObject, p as Symbol, r as isArrayLike, u as isArray } from "./_baseUnary.js";
import { n as apply, r as arrayMap, t as baseRest } from "./_baseRest.js";
import { l as isIndex, n as keys, s as copyObject, t as getPrototype, u as arrayEach } from "./_getPrototype.js";
import { t as __ } from "./lang.js";
//#region ../../../../node_modules/lodash-es/isSymbol.js
/** `Object#toString` result references. */
var symbolTag = "[object Symbol]";
/**
* Checks if `value` is classified as a `Symbol` primitive or object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
* @example
*
* _.isSymbol(Symbol.iterator);
* // => true
*
* _.isSymbol('abc');
* // => false
*/
function isSymbol(value) {
	return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseToString.js
/** Used as references for various `Number` constants. */
var INFINITY = Infinity;
/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
/**
* The base implementation of `_.toString` which doesn't convert nullish
* values to empty strings.
*
* @private
* @param {*} value The value to process.
* @returns {string} Returns the string.
*/
function baseToString(value) {
	if (typeof value == "string") return value;
	if (isArray(value)) return arrayMap(value, baseToString) + "";
	if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_isIterateeCall.js
/**
* Checks if the given arguments are from an iteratee call.
*
* @private
* @param {*} value The potential iteratee value argument.
* @param {*} index The potential iteratee index or key argument.
* @param {*} object The potential iteratee object argument.
* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
*  else `false`.
*/
function isIterateeCall(value, index, object) {
	if (!isObject(object)) return false;
	var type = typeof index;
	if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
	return false;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_createAssigner.js
/**
* Creates a function like `_.assign`.
*
* @private
* @param {Function} assigner The function to assign values.
* @returns {Function} Returns the new assigner function.
*/
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
			if (source) assigner(object, source, index, customizer);
		}
		return object;
	});
}
//#endregion
//#region ../../../../node_modules/lodash-es/assignWith.js
/**
* This method is like `_.assign` except that it accepts `customizer`
* which is invoked to produce the assigned values. If `customizer` returns
* `undefined`, assignment is handled by the method instead. The `customizer`
* is invoked with five arguments: (objValue, srcValue, key, object, source).
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The destination object.
* @param {...Object} sources The source objects.
* @param {Function} [customizer] The function to customize assigned values.
* @returns {Object} Returns `object`.
* @see _.assignInWith
* @example
*
* function customizer(objValue, srcValue) {
*   return _.isUndefined(objValue) ? srcValue : objValue;
* }
*
* var defaults = _.partialRight(_.assignWith, customizer);
*
* defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
* // => { 'a': 1, 'b': 2 }
*/
var assignWith = /* @__PURE__ */ createAssigner(function(object, source, srcIndex, customizer) {
	copyObject(source, keys(source), object, customizer);
});
//#endregion
//#region ../../../../node_modules/lodash-es/toString.js
/**
* Converts `value` to a string. An empty string is returned for `null`
* and `undefined` values. The sign of `-0` is preserved.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
* @example
*
* _.toString(null);
* // => ''
*
* _.toString(-0);
* // => '-0'
*
* _.toString([1, 2, 3]);
* // => '1,2,3'
*/
function toString(value) {
	return value == null ? "" : baseToString(value);
}
//#endregion
//#region ../../../../node_modules/lodash-es/isPlainObject.js
/** `Object#toString` result references. */
var objectTag = "[object Object]";
/** Used for built-in method references. */
var funcProto = Function.prototype, objectProto$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$1.hasOwnProperty;
/** Used to infer the `Object` constructor. */
var objectCtorString = /* @__PURE__ */ funcToString.call(Object);
/**
* Checks if `value` is a plain object, that is, an object created by the
* `Object` constructor or one with a `[[Prototype]]` of `null`.
*
* @static
* @memberOf _
* @since 0.8.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
* @example
*
* function Foo() {
*   this.a = 1;
* }
*
* _.isPlainObject(new Foo);
* // => false
*
* _.isPlainObject([1, 2, 3]);
* // => false
*
* _.isPlainObject({ 'x': 0, 'y': 0 });
* // => true
*
* _.isPlainObject(Object.create(null));
* // => true
*/
function isPlainObject(value) {
	if (!isObjectLike(value) || baseGetTag(value) != objectTag) return false;
	var proto = getPrototype(value);
	if (proto === null) return true;
	var Ctor = hasOwnProperty$2.call(proto, "constructor") && proto.constructor;
	return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
//#endregion
//#region ../../../../node_modules/lodash-es/isError.js
/** `Object#toString` result references. */
var domExcTag = "[object DOMException]", errorTag = "[object Error]";
/**
* Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
* `SyntaxError`, `TypeError`, or `URIError` object.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an error object, else `false`.
* @example
*
* _.isError(new Error);
* // => true
*
* _.isError(Error);
* // => false
*/
function isError(value) {
	if (!isObjectLike(value)) return false;
	var tag = baseGetTag(value);
	return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
}
//#endregion
//#region ../../../../node_modules/lodash-es/attempt.js
/**
* Attempts to invoke `func`, returning either the result or the caught error
* object. Any additional arguments are provided to `func` when it's invoked.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Util
* @param {Function} func The function to attempt.
* @param {...*} [args] The arguments to invoke `func` with.
* @returns {*} Returns the `func` result or error object.
* @example
*
* // Avoid throwing errors for invalid selectors.
* var elements = _.attempt(function(selector) {
*   return document.querySelectorAll(selector);
* }, '>_>');
*
* if (_.isError(elements)) {
*   elements = [];
* }
*/
var attempt = /* @__PURE__ */ baseRest(function(func, args) {
	try {
		return apply(func, void 0, args);
	} catch (e) {
		return isError(e) ? e : new Error(e);
	}
});
//#endregion
//#region ../../../../node_modules/lodash-es/_basePropertyOf.js
/**
* The base implementation of `_.propertyOf` without support for deep paths.
*
* @private
* @param {Object} object The object to query.
* @returns {Function} Returns the new accessor function.
*/
function basePropertyOf(object) {
	return function(key) {
		return object == null ? void 0 : object[key];
	};
}
//#endregion
//#region ../../../../node_modules/lodash-es/_escapeHtmlChar.js
/**
* Used by `_.escape` to convert characters to HTML entities.
*
* @private
* @param {string} chr The matched character to escape.
* @returns {string} Returns the escaped character.
*/
var escapeHtmlChar = /* @__PURE__ */ basePropertyOf({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
});
//#endregion
//#region ../../../../node_modules/lodash-es/escape.js
/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = /* @__PURE__ */ RegExp(reUnescapedHtml.source);
/**
* Converts the characters "&", "<", ">", '"', and "'" in `string` to their
* corresponding HTML entities.
*
* **Note:** No other characters are escaped. To escape additional
* characters use a third-party library like [_he_](https://mths.be/he).
*
* Though the ">" character is escaped for symmetry, characters like
* ">" and "/" don't need escaping in HTML and have no special meaning
* unless they're part of a tag or unquoted attribute value. See
* [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
* (under "semi-related fun fact") for more details.
*
* When working with HTML you should always
* [quote attribute values](http://wonko.com/post/html-escaping) to reduce
* XSS vectors.
*
* @static
* @since 0.1.0
* @memberOf _
* @category String
* @param {string} [string=''] The string to escape.
* @returns {string} Returns the escaped string.
* @example
*
* _.escape('fred, barney, & pebbles');
* // => 'fred, barney, &amp; pebbles'
*/
function escape(string) {
	string = toString(string);
	return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseValues.js
/**
* The base implementation of `_.values` and `_.valuesIn` which creates an
* array of `object` property values corresponding to the property names
* of `props`.
*
* @private
* @param {Object} object The object to query.
* @param {Array} props The property names to get values for.
* @returns {Object} Returns the array of property values.
*/
function baseValues(object, props) {
	return arrayMap(props, function(key) {
		return object[key];
	});
}
//#endregion
//#region ../../../../node_modules/lodash-es/_customDefaultsAssignIn.js
/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;
/**
* Used by `_.defaults` to customize its `_.assignIn` use to assign properties
* of source objects to the destination object for all destination properties
* that resolve to `undefined`.
*
* @private
* @param {*} objValue The destination value.
* @param {*} srcValue The source value.
* @param {string} key The key of the property to assign.
* @param {Object} object The parent object of `objValue`.
* @returns {*} Returns the value to assign.
*/
function customDefaultsAssignIn(objValue, srcValue, key, object) {
	if (objValue === void 0 || eq(objValue, objectProto[key]) && !hasOwnProperty$1.call(object, key)) return srcValue;
	return objValue;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_escapeStringChar.js
/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
	"\\": "\\",
	"'": "'",
	"\n": "n",
	"\r": "r",
	"\u2028": "u2028",
	"\u2029": "u2029"
};
/**
* Used by `_.template` to escape characters for inclusion in compiled string literals.
*
* @private
* @param {string} chr The matched character to escape.
* @returns {string} Returns the escaped character.
*/
function escapeStringChar(chr) {
	return "\\" + stringEscapes[chr];
}
//#endregion
//#region ../../../../node_modules/lodash-es/_reInterpolate.js
/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;
//#endregion
//#region ../../../../node_modules/lodash-es/templateSettings.js
/**
* By default, the template delimiters used by lodash are like those in
* embedded Ruby (ERB) as well as ES2015 template strings. Change the
* following template settings to use alternative delimiters.
*
* **Security:** See
* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md)
* — `_.template` is insecure and will be removed in v5.
*
* @static
* @memberOf _
* @type {Object}
*/
var templateSettings = {
	"escape": /<%-([\s\S]+?)%>/g,
	"evaluate": /<%([\s\S]+?)%>/g,
	"interpolate": reInterpolate,
	"variable": "",
	"imports": { "_": { "escape": escape } }
};
//#endregion
//#region ../../../../node_modules/lodash-es/template.js
/** Error message constants. */
var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`", INVALID_TEMPL_IMPORTS_ERROR_TEXT = "Invalid `imports` option passed into `_.template`";
/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
/**
* Used to validate the `validate` option in `_.template` variable.
*
* Forbids characters which could potentially change the meaning of the function argument definition:
* - "()," (modification of function parameters)
* - "=" (default value)
* - "[]{}" (destructuring of function parameters)
* - "/" (beginning of a comment)
* - whitespace
*/
var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
/**
* Used to match
* [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
*/
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
/** Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;
/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
/** Used to check objects for own properties. */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* Creates a compiled template function that can interpolate data properties
* in "interpolate" delimiters, HTML-escape interpolated data properties in
* "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
* properties may be accessed as free variables in the template. If a setting
* object is given, it takes precedence over `_.templateSettings` values.
*
* **Security:** `_.template` is insecure and should not be used. It will be
* removed in Lodash v5. Avoid untrusted input. See
* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md).
*
* **Note:** In the development build `_.template` utilizes
* [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
* for easier debugging.
*
* For more information on precompiling templates see
* [lodash's custom builds documentation](https://lodash.com/custom-builds).
*
* For more information on Chrome extension sandboxes see
* [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
*
* @static
* @since 0.1.0
* @memberOf _
* @category String
* @param {string} [string=''] The template string.
* @param {Object} [options={}] The options object.
* @param {RegExp} [options.escape=_.templateSettings.escape]
*  The HTML "escape" delimiter.
* @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
*  The "evaluate" delimiter.
* @param {Object} [options.imports=_.templateSettings.imports]
*  An object to import into the template as free variables.
* @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
*  The "interpolate" delimiter.
* @param {string} [options.sourceURL='templateSources[n]']
*  The sourceURL of the compiled template.
* @param {string} [options.variable='obj']
*  The data object variable name.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Function} Returns the compiled template function.
* @example
*
* // Use the "interpolate" delimiter to create a compiled template.
* var compiled = _.template('hello <%= user %>!');
* compiled({ 'user': 'fred' });
* // => 'hello fred!'
*
* // Use the HTML "escape" delimiter to escape data property values.
* var compiled = _.template('<b><%- value %></b>');
* compiled({ 'value': '<script>' });
* // => '<b>&lt;script&gt;</b>'
*
* // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
* var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
* compiled({ 'users': ['fred', 'barney'] });
* // => '<li>fred</li><li>barney</li>'
*
* // Use the internal `print` function in "evaluate" delimiters.
* var compiled = _.template('<% print("hello " + user); %>!');
* compiled({ 'user': 'barney' });
* // => 'hello barney!'
*
* // Use the ES template literal delimiter as an "interpolate" delimiter.
* // Disable support by replacing the "interpolate" delimiter.
* var compiled = _.template('hello ${ user }!');
* compiled({ 'user': 'pebbles' });
* // => 'hello pebbles!'
*
* // Use backslashes to treat delimiters as plain text.
* var compiled = _.template('<%= "\\<%- value %\\>" %>');
* compiled({ 'value': 'ignored' });
* // => '<%- value %>'
*
* // Use the `imports` option to import `jQuery` as `jq`.
* var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
* var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
* compiled({ 'users': ['fred', 'barney'] });
* // => '<li>fred</li><li>barney</li>'
*
* // Use the `sourceURL` option to specify a custom sourceURL for the template.
* var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
* compiled(data);
* // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
*
* // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
* var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
* compiled.source;
* // => function(data) {
* //   var __t, __p = '';
* //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
* //   return __p;
* // }
*
* // Use custom template delimiters.
* _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
* var compiled = _.template('hello {{ user }}!');
* compiled({ 'user': 'mustache' });
* // => 'hello mustache!'
*
* // Use the `source` property to inline compiled templates for meaningful
* // line numbers in error messages and stack traces.
* fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
*   var JST = {\
*     "main": ' + _.template(mainText).source + '\
*   };\
* ');
*/
function template(string, options, guard) {
	var settings = templateSettings.imports._.templateSettings || templateSettings;
	if (guard && isIterateeCall(string, options, guard)) options = void 0;
	string = toString(string);
	options = assignWith({}, options, settings, customDefaultsAssignIn);
	var imports = assignWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
	arrayEach(importsKeys, function(key) {
		if (reForbiddenIdentifierChars.test(key)) throw new Error(INVALID_TEMPL_IMPORTS_ERROR_TEXT);
	});
	var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
	var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
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
		if (interpolateValue) source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
		index = offset + match.length;
		return match;
	});
	source += "';\n";
	var variable = hasOwnProperty.call(options, "variable") && options.variable;
	if (!variable) source = "with (obj) {\n" + source + "\n}\n";
	else if (reForbiddenIdentifierChars.test(variable)) throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
	source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
	source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
	var result = attempt(function() {
		return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
	});
	result.source = source;
	if (isError(result)) throw result;
	return result;
}
//#endregion
//#region src/module/field-modal-select.ts
function createCallback(type, selector, modalSelector) {
	switch (type) {
		case "list": return (item) => {
			const modalList = document.querySelector(selector);
			const checked = item.checked;
			if (checked === void 0) if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
				modalList.appendItem(item, true);
				selectOne(modalSelector)?.close();
			} else simpleAlert(__("unicorn.field.modal.already.selected"));
			else if (checked) try {
				modalList.appendIfNotExists(item, true);
			} catch (e) {
				window.postMessage({
					task: "remove-row",
					value: item,
					id: item.instanceId
				});
				simpleAlert(e.message);
			} finally {
				modalList.updateSelected();
			}
			else if (!checked) modalList.removeItem(item).then(() => {
				console.log(modalList.items);
				modalList.updateSelected();
			});
		};
		default: return (item) => {
			const element = document.querySelector(selector);
			const image = element.querySelector("[data-role=image]");
			const title = element.querySelector("[data-role=title]");
			const store = element.querySelector("[data-role=value]");
			if (image && item.image) image.style.backgroundImage = `url(${item.image});`;
			title.value = item.title || "";
			store.value = item.value || "";
			store.dispatchEvent(new CustomEvent("change"));
			selectOne(modalSelector)?.close();
			highlight(title);
		};
	}
}
var ModalListSelectElement = class extends HTMLElement {
	static is = "uni-modal-list";
	itemTemplate;
	options;
	isMultiCheck = false;
	get listContainer() {
		return this.querySelector("[data-role=list-container]");
	}
	get selectButton() {
		return this.querySelector("[data-role=select]");
	}
	get modal() {
		return document.querySelector(this.options.modalSelector);
	}
	get items() {
		return Array.from(this.listContainer.querySelectorAll("[data-value]"));
	}
	get count() {
		return this.items.length;
	}
	connectedCallback() {
		this.options = JSON.parse(this.getAttribute("options") || "{}");
		this.itemTemplate = template(document.querySelector(this.options.itemTemplate).innerHTML);
		const emptyInput = this.querySelector("[data-role=empty]");
		if (emptyInput) emptyInput.name = emptyInput.dataset.name || "";
		if (this.options.sortable) import("sortablejs").then(({ default: Sortable }) => {
			new Sortable(this.listContainer, {
				handle: ".h-drag-handle",
				animation: 150
			});
		});
		this.selectButton.addEventListener("click", (e) => {
			try {
				this.open(e);
			} catch (e) {
				simpleAlert(e.message);
			}
		});
		this.querySelector("[data-role=clear]")?.addEventListener("click", () => {
			this.removeAll();
		});
		this.selectButton.style.pointerEvents = "";
		this.render();
		this.enableMultiCheck(this.options.multiCheck || false);
	}
	render() {
		(data("unicorn.modal-field")[this.options.dataKey] || []).forEach((item) => {
			this.appendItem(item);
		});
	}
	appendItem(item, highlights = false) {
		const max = this.options.max;
		if (max && this.count >= max) throw new Error(__("unicorn.field.modal.max.selected", max));
		const itemHtml = html(this.itemTemplate({ item }));
		itemHtml.dataset.value = String(item.value);
		itemHtml.querySelector("[data-role=remove]")?.addEventListener("click", () => {
			this.removeItem(item);
		});
		this.listContainer.appendChild(itemHtml);
		this.toggleRequired();
		if (highlights) highlight(itemHtml);
		if (this.isMultiCheck) this.updateSelected();
	}
	appendIfNotExists(item, highlights = false) {
		if (!this.isExists(item)) this.appendItem(item, highlights);
	}
	isExists(item) {
		if (typeof item === "object") item = item.value;
		return this.listContainer.querySelector(`[data-value="${item}"]`) !== null;
	}
	getItemElement(item) {
		if (typeof item === "object") item = item.value;
		return this.listContainer.querySelector(`[data-value="${item}"]`);
	}
	getValues() {
		return this.items.map((item) => item.dataset.value);
	}
	async removeItem(item) {
		if (typeof item === "object") item = item.value;
		const element = this.listContainer.querySelector(`[data-value="${item}"]`);
		if (element) return slideUp(element).then(() => {
			element.remove();
			this.toggleRequired();
			if (this.isMultiCheck) this.updateSelected();
		});
	}
	async removeAll() {
		const promises = [];
		for (const item of this.items) promises.push(slideUp(item).then(() => item.remove()));
		await Promise.all(promises);
		this.toggleRequired();
		if (this.isMultiCheck) this.updateSelected();
	}
	toggleRequired() {
		const placeholder = this.querySelector("[data-role=validation-placeholder]");
		if (placeholder) placeholder.disabled = this.listContainer.children.length !== 0;
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
		if (this.count >= max) throw new Error(__("unicorn.field.modal.max.selected", max));
		this.modal?.open(target.href, { size: "modal-xl" });
	}
	enableMultiCheck(enable = true) {
		this.isMultiCheck = enable;
		if (enable) this.updateSelected();
		else this.clearSelected();
	}
	updateSelected() {
		const url = new URL(this.selectButton.href);
		url.searchParams.set("selected", this.items.map((i) => i.dataset.value).join(","));
		this.selectButton.href = url.toString();
	}
	clearSelected() {
		const url = new URL(this.selectButton.href);
		url.searchParams.delete("selected");
		this.selectButton.href = url.toString();
	}
};
async function init() {
	customElements.define(ModalListSelectElement.is, ModalListSelectElement);
}
function listenMessages(options) {
	const callback = createCallback(options.type, options.selector, options.modalSelector);
	window.addEventListener("message", (e) => {
		if (e.origin === options.origin) {
			if (Array.isArray(e.data) && e.data[0] === options.instanceId) callback(e.data[1]);
			if (typeof e.data === "object" && e.data !== null && e.data.id === options.instanceId && e.data.task === "select-row") {
				const item = e.data.value;
				item.checked = e.data.checked;
				item.instanceId = e.data.id;
				callback(e.data.value);
			}
		}
	});
	window[options.instanceId] = callback;
}
var ready = /* @__PURE__ */ init();
//#endregion
export { createCallback, listenMessages, ready };

//# sourceMappingURL=field-modal-select.js.map