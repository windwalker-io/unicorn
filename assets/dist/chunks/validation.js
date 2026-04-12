import { t as mergeDeep } from "./arr.js";
import { d as selectOne, o as html, r as getBoundedInstance, u as selectAll } from "./dom.js";
import { x as useUITheme } from "./ui.js";
import { n as trans } from "./lang.js";
import { useUniDirective } from "../unicorn.js";
//#region ../../../../node_modules/punycode/punycode.es6.js
/** Highest positive signed 32-bit float value */
var maxInt = 2147483647;
/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128;
var delimiter = "-";
var regexNonASCII = /[^\0-\x7F]/;
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
/** Error messages */
var errors = {
	"overflow": "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
};
/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;
/**
* A generic error utility function.
* @private
* @param {String} type The error type.
* @returns {Error} Throws a `RangeError` with the applicable error message.
*/
function error(type) {
	throw new RangeError(errors[type]);
}
/**
* A generic `Array#map` utility function.
* @private
* @param {Array} array The array to iterate over.
* @param {Function} callback The function that gets called for every array
* item.
* @returns {Array} A new array of values returned by the callback function.
*/
function map(array, callback) {
	const result = [];
	let length = array.length;
	while (length--) result[length] = callback(array[length]);
	return result;
}
/**
* A simple `Array#map`-like wrapper to work with domain name strings or email
* addresses.
* @private
* @param {String} domain The domain name or email address.
* @param {Function} callback The function that gets called for every
* character.
* @returns {String} A new string of characters returned by the callback
* function.
*/
function mapDomain(domain, callback) {
	const parts = domain.split("@");
	let result = "";
	if (parts.length > 1) {
		result = parts[0] + "@";
		domain = parts[1];
	}
	domain = domain.replace(regexSeparators, ".");
	const encoded = map(domain.split("."), callback).join(".");
	return result + encoded;
}
/**
* Creates an array containing the numeric code points of each Unicode
* character in the string. While JavaScript uses UCS-2 internally,
* this function will convert a pair of surrogate halves (each of which
* UCS-2 exposes as separate characters) into a single code point,
* matching UTF-16.
* @see `punycode.ucs2.encode`
* @see <https://mathiasbynens.be/notes/javascript-encoding>
* @memberOf punycode.ucs2
* @name decode
* @param {String} string The Unicode input string (UCS-2).
* @returns {Array} The new array of code points.
*/
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 55296 && value <= 56319 && counter < length) {
			const extra = string.charCodeAt(counter++);
			if ((extra & 64512) == 56320) output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
			else {
				output.push(value);
				counter--;
			}
		} else output.push(value);
	}
	return output;
}
/**
* Converts a digit/integer into a basic code point.
* @see `basicToDigit()`
* @private
* @param {Number} digit The numeric value of a basic code point.
* @returns {Number} The basic code point whose value (when used for
* representing integers) is `digit`, which needs to be in the range
* `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
* used; else, the lowercase form is used. The behavior is undefined
* if `flag` is non-zero and `digit` has no uppercase form.
*/
var digitToBasic = function(digit, flag) {
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
/**
* Bias adaptation function as per section 3.4 of RFC 3492.
* https://tools.ietf.org/html/rfc3492#section-3.4
* @private
*/
var adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (; delta > baseMinusTMin * tMax >> 1; k += base) delta = floor(delta / baseMinusTMin);
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
/**
* Converts a string of Unicode symbols (e.g. a domain name label) to a
* Punycode string of ASCII-only symbols.
* @memberOf punycode
* @param {String} input The string of Unicode symbols.
* @returns {String} The resulting Punycode string of ASCII-only symbols.
*/
var encode = function(input) {
	const output = [];
	input = ucs2decode(input);
	const inputLength = input.length;
	let n = initialN;
	let delta = 0;
	let bias = initialBias;
	for (const currentValue of input) if (currentValue < 128) output.push(stringFromCharCode(currentValue));
	const basicLength = output.length;
	let handledCPCount = basicLength;
	if (basicLength) output.push(delimiter);
	while (handledCPCount < inputLength) {
		let m = maxInt;
		for (const currentValue of input) if (currentValue >= n && currentValue < m) m = currentValue;
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error("overflow");
		delta += (m - n) * handledCPCountPlusOne;
		n = m;
		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) error("overflow");
			if (currentValue === n) {
				let q = delta;
				for (let k = base;; k += base) {
					const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
					if (q < t) break;
					const qMinusT = q - t;
					const baseMinusT = base - t;
					output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
					q = floor(qMinusT / baseMinusT);
				}
				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
				delta = 0;
				++handledCPCount;
			}
		}
		++delta;
		++n;
	}
	return output.join("");
};
/**
* Converts a Unicode string representing a domain name or an email address to
* Punycode. Only the non-ASCII parts of the domain name will be converted,
* i.e. it doesn't matter if you call it with a domain that's already in
* ASCII.
* @memberOf punycode
* @param {String} input The domain name or email address to convert, as a
* Unicode string.
* @returns {String} The Punycode representation of the given domain name or
* email address.
*/
var toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
	});
};
//#endregion
//#region src/module/validation.ts
var validatorHandlers = {};
var defaultOptions = {
	scroll: false,
	scrollOffset: -100,
	enabled: true,
	fieldSelector: null,
	validatedClass: null
};
var defaultFieldOptions = {
	formSelector: "[uni-form-validate]",
	errorSelector: "[data-field-error]",
	selector: "input[data-field-input], select[data-field-input], textarea[data-field-input]",
	validClass: "is-valid",
	invalidClass: "is-invalid",
	events: ["change"],
	errorMessageClass: "invalid-tooltip",
	inputOptions: false,
	inputOptionsWrapperSelector: "div[data-field-input]",
	inputOptionsSelector: "[data-input-option]"
};
var UnicornFormValidation = class {
	presetFields = [];
	static globalValidators = {};
	validators = {};
	options;
	$form;
	static is = "uni-form-validate";
	constructor(el, options = {}) {
		this.$form = selectOne(el);
		this.options = this.mergeOptions(options);
		this.registerDefaultValidators();
		this.init();
	}
	mergeOptions(options) {
		if (Array.isArray(options)) options = {};
		return this.options = mergeDeep({}, defaultOptions, this.options || {}, options);
	}
	get scrollEnabled() {
		return this.options.scroll;
	}
	get scrollOffset() {
		return Number(this.options.scrollOffset || -100);
	}
	get fieldSelector() {
		return this.options.fieldSelector || "input, select, textarea";
	}
	get validatedClass() {
		return this.options.validatedClass || "was-validated";
	}
	init() {
		if (this.$form.tagName === "FORM") {
			this.$form.setAttribute("novalidate", "true");
			this.$form.addEventListener("submit", (event) => {
				if (this.options.enabled && !this.validateAll()) {
					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();
					this.$form.dispatchEvent(new CustomEvent("invalid"));
					return false;
				}
				return true;
			}, false);
		}
		this.prepareFields(this.findDOMFields());
		this.prepareFields(this.presetFields);
	}
	findDOMFields() {
		return selectAll(this.$form.querySelectorAll(this.fieldSelector));
	}
	prepareFields(inputs) {
		inputs.forEach((input) => {
			this.prepareFieldWrapper(input);
		});
		return Promise.resolve();
	}
	prepareFieldWrapper(input) {
		if ([
			"INPUT",
			"SELECT",
			"TEXTAREA"
		].indexOf(input.tagName) !== -1) {
			let wrapper = input.closest("[uni-field-validate]");
			if (!wrapper) {
				wrapper = input.closest("[data-input-container]") || input.parentElement;
				wrapper?.setAttribute("uni-field-validate", "{}");
			}
			return wrapper;
		}
		return input;
	}
	findFields(containsPresets = true) {
		let inputs = this.findDOMFields();
		if (containsPresets) inputs.push(...this.presetFields);
		return inputs.map((input) => this.prepareFieldWrapper(input)).filter((input) => input != null);
	}
	getFieldComponents(containsPresets = true) {
		const components = [];
		for (const field of this.findFields(containsPresets)) {
			const v = this.getFieldComponent(field);
			if (v) components.push(v);
		}
		return components;
	}
	getFieldComponent(input) {
		let v = getBoundedInstance(input, "field.validation");
		if (!v) {
			const wrapper = input.closest("[uni-field-validate]");
			if (wrapper) v = getBoundedInstance(wrapper, "field.validation");
		}
		return v;
	}
	validateAll(fields) {
		this.markFormAsUnvalidated();
		fields = fields || this.findFields();
		let firstFail = null;
		for (const field of fields) {
			const fv = this.getFieldComponent(field);
			if (!fv) continue;
			if (!fv.checkValidity() && !firstFail) firstFail = field;
		}
		this.markFormAsValidated();
		if (firstFail && this.scrollEnabled) this.scrollTo(firstFail);
		return firstFail === null;
	}
	async validateAllAsync(fields) {
		this.markFormAsUnvalidated();
		fields = fields || this.findFields();
		let firstFail = null;
		const promises = [];
		for (const field of fields) {
			const fv = this.getFieldComponent(field);
			if (!fv) continue;
			promises.push(fv.checkValidityAsync().then((result) => {
				if (!result && !firstFail) firstFail = field;
				return result;
			}));
		}
		await Promise.all(promises);
		this.markFormAsValidated();
		if (firstFail && this.scrollEnabled) this.scrollTo(firstFail);
		return firstFail === null;
	}
	scrollTo(element) {
		const offset = this.scrollOffset;
		const offsetPosition = element.getBoundingClientRect().top + window.scrollY + offset;
		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth"
		});
	}
	markFormAsValidated() {
		if (!this.$form) return;
		this.$form.classList.add(this.validatedClass);
	}
	markFormAsUnvalidated() {
		if (!this.$form) return;
		this.$form.classList.remove(this.validatedClass);
	}
	addField(field) {
		this.presetFields.push(field);
		this.prepareFieldWrapper(field);
		return this;
	}
	registerDefaultValidators() {
		for (let name in validatorHandlers) this.addValidator(name, validatorHandlers[name]);
	}
	/**
	* Add validator handler.
	*/
	addValidator(name, handler, options = {}) {
		options = options || {};
		this.validators[name] = {
			handler,
			options
		};
		return this;
	}
	/**
	* Add validator handler.
	*/
	static addGlobalValidator(name, handler, options = {}) {
		options = options || {};
		this.globalValidators[name] = {
			handler,
			options
		};
		return this;
	}
};
var UnicornFieldValidation = class {
	$input;
	options = {};
	static is = "uni-field-validate";
	constructor(el, options = {}) {
		this.el = el;
		this.setOptions(options);
		this.$input = this.selectInput();
		this.init();
	}
	setOptions(options) {
		if (Array.isArray(options)) options = {};
		this.options = options;
		return this;
	}
	get mergedOptions() {
		return mergeDeep({}, defaultFieldOptions, this.globalOptions, this.options);
	}
	get $form() {
		return this.getForm();
	}
	get errorSelector() {
		return this.mergedOptions.errorSelector;
	}
	get selector() {
		return this.mergedOptions.selector;
	}
	get validClass() {
		return this.mergedOptions.validClass;
	}
	get invalidClass() {
		return this.mergedOptions.invalidClass;
	}
	get isVisible() {
		return !!(this.el.offsetWidth || this.el.offsetHeight || this.el.getClientRects().length);
	}
	get isInputOptions() {
		return Boolean(this.mergedOptions.inputOptions);
	}
	get validationMessage() {
		return this.$input?.validationMessage || "";
	}
	get validity() {
		return this.$input?.validity;
	}
	selectInput() {
		let selector = this.selector;
		if (this.mergedOptions.inputOptions) selector += ", " + this.mergedOptions.inputOptionsWrapperSelector;
		let input = this.el.querySelector(selector);
		if (!input) input = this.el.querySelector("input, select, textarea");
		if (!input) return;
		return this.$input = input;
	}
	init() {
		this.selectInput();
		this.bindEvents();
		this.prepareWrapper();
		if (this.isInputOptions) {
			const $input = this.$input;
			if (!($input instanceof HTMLInputElement) && !($input instanceof HTMLSelectElement) && !($input instanceof HTMLTextAreaElement)) {
				$input.validationMessage = "";
				$input.setCustomValidity = (msg) => {
					$input.validationMessage = String(msg);
				};
				$input.checkValidity = () => {
					return this.checkInputOptionsValidity();
				};
			}
		}
	}
	bindEvents() {
		if (!this.$input) return;
		this.$input.addEventListener("invalid", (e) => {
			this.showInvalidResponse();
		});
		this.mergedOptions.events.forEach((eventName) => {
			this.$input?.addEventListener(eventName, () => {
				this.checkValidity();
			});
		});
	}
	prepareWrapper() {
		if (this.el.querySelector(this.errorSelector)?.classList?.contains("invalid-tooltip")) {
			if (window.getComputedStyle(this.el).position === "static") this.el.style.position = "relative";
		}
	}
	checkValidity() {
		if (!this.$input) return true;
		if (this.$input.hasAttribute("readonly")) return true;
		if (this.$input.hasAttribute("[data-novalidate]")) return true;
		if (this.$input.closest("[data-novalidate]")) return true;
		if (this.hasChildDirectives()) return true;
		this.$input.setCustomValidity("");
		let valid = this.$input.checkValidity();
		if (valid && this.$form) valid = this.runCustomValidity();
		this.updateValidClass(valid);
		return valid;
	}
	runCustomValidity() {
		if (!this.$input) return true;
		const validates = (this.$input.getAttribute("data-validate") || "").split("|");
		let result = true;
		if (this.$input.value !== "" && validates.length) {
			if (!this.checkCustomDataAttributeValidity()) return false;
			for (const validatorName of validates) {
				const [validator, options] = this.getValidator(validatorName) || [null, {}];
				if (!validator) continue;
				Object.assign(options, validator.options);
				let r = validator.handler(this.$input.value, this.$input, options, this);
				if (r instanceof Promise || typeof r === "object" && r.then) {
					r.then((result) => {
						this.handleAsyncCustomResult(result, validator);
					});
					continue;
				}
				if (!this.handleCustomResult(r, validator)) {
					result = false;
					break;
				}
			}
		}
		return result;
	}
	async checkValidityAsync() {
		if (!this.$input) return true;
		if (this.$input.hasAttribute("readonly")) return true;
		if (this.$input.hasAttribute("[data-novalidate]")) return true;
		if (this.hasChildDirectives()) return true;
		this.$input.setCustomValidity("");
		let valid = this.$input.checkValidity();
		if (valid && this.$form) valid = await this.runCustomValidityAsync();
		this.updateValidClass(valid);
		return valid;
	}
	async runCustomValidityAsync() {
		if (!this.$input) return true;
		const validates = (this.$input.getAttribute("data-validate") || "").split("|");
		const results = [];
		const promises = [];
		if (this.$input.value !== "" && validates.length) {
			if (!this.checkCustomDataAttributeValidity()) return false;
			for (const validatorName of validates) {
				let [validator, options] = this.getValidator(validatorName) || [null, {}];
				if (!validator) continue;
				options = Object.assign({}, options, validator.options || {});
				promises.push(Promise.resolve(validator.handler(this.$input.value, this.$input, options, this)).then((r) => {
					results.push(this.handleAsyncCustomResult(r, validator));
					return r;
				}));
			}
		}
		await Promise.all(promises);
		for (const result of results) if (result === false) return false;
		return true;
	}
	checkCustomDataAttributeValidity() {
		const error = this.$input?.dataset.validationFail;
		return this.handleCustomResult(error);
	}
	checkInputOptionsValidity() {
		if (!this.$input) return true;
		const isRequired = this.$input.getAttribute("required") != null;
		const optionWrappers = this.$input.querySelectorAll(this.mergedOptions.inputOptionsSelector);
		let result = true;
		if (isRequired) for (const optionWrapper of optionWrappers) {
			const input = optionWrapper.querySelector("input");
			result = false;
			if (input?.checked) {
				result = true;
				break;
			}
		}
		const n = document.createElement("input");
		n.required = isRequired;
		if (result) n.value = "placeholder";
		n.checkValidity();
		this.$input.validationMessage = n.validationMessage;
		this.$input.validity = n.validity;
		for (const optionWrapper of optionWrappers) optionWrapper.querySelector("input")?.setCustomValidity(n.validationMessage);
		if (!result) this.$input.dispatchEvent(new CustomEvent("invalid"));
		return result;
	}
	/**
	* @param valid {boolean}
	*/
	updateValidClass(valid) {
		const $invalidTarget = this.getErrorElement()?.previousElementSibling;
		this.$input?.classList.remove(this.invalidClass);
		this.$input?.classList.remove(this.validClass);
		this.el.classList.remove(this.invalidClass);
		this.el.classList.remove(this.validClass);
		$invalidTarget?.classList.remove(this.invalidClass);
		$invalidTarget?.classList.remove(this.validClass);
		if (valid) {
			this.$input?.classList.add(this.validClass);
			this.el.classList.add(this.validClass);
			$invalidTarget?.classList.add(this.validClass);
		} else {
			this.$input?.classList.add(this.invalidClass);
			this.el.classList.add(this.invalidClass);
			$invalidTarget?.classList.add(this.invalidClass);
		}
	}
	getFormValidation(element) {
		return getBoundedInstance(element || this.getForm(), "form.validation");
	}
	get globalOptions() {
		return this.getFormValidation()?.options?.fieldDefaults ?? {};
	}
	getValidator(name) {
		const matches = name.match(/(?<type>[\w\-_]+)(\((?<params>.*)\))*/);
		if (!matches) return null;
		const validatorName = matches.groups?.type || "";
		const params = matches.groups?.params || "";
		const validator = this.getFormValidation(this.$form)?.validators[validatorName] || UnicornFormValidation.globalValidators[validatorName];
		if (!validator) return null;
		const paramMatches = params.matchAll(/(?<key>\w+)(\s?[=:]\s?(?<value>\w+))?/g);
		const options = {};
		for (const paramMatch of paramMatches) {
			const match = paramMatch?.groups;
			if (!match) continue;
			options[match.key] = handleParamValue(match.value);
		}
		return [validator, options];
	}
	handleCustomResult(result, validator) {
		if (typeof result === "string") {
			this.$input?.setCustomValidity(result);
			result = result === "";
		} else if (result === void 0) result = true;
		if (result) this.$input?.setCustomValidity("");
		else if (validator) this.raiseCustomErrorState(validator);
		return result;
	}
	handleAsyncCustomResult(result, validator) {
		result = this.handleCustomResult(result, validator);
		this.$input?.checkValidity();
		this.updateValidClass(result);
		return result;
	}
	raiseCustomErrorState(validator) {
		let help;
		if (this.$input?.validationMessage === "") {
			help = validator.options?.notice;
			if (typeof help === "function") help = help(this.$input, this);
			if (help != null) this.$input?.setCustomValidity(help);
		}
		if (this.$input?.validationMessage === "") this.$input?.setCustomValidity(trans("unicorn.message.validation.custom.error"));
		this.$input?.dispatchEvent(new CustomEvent("invalid"));
	}
	setAsInvalidAndReport(error) {
		this.setCustomValidity(error);
		this.showInvalidResponse();
	}
	setCustomValidity(error) {
		this.$input?.setCustomValidity(error);
	}
	reportValidity() {
		if (this.validationMessage !== "") this.showInvalidResponse();
	}
	showInvalidResponse() {
		if (this.hasChildDirectives()) return;
		/** @type ValidityState */
		const state = this.$input?.validity;
		let message = this.$input?.validationMessage || "";
		for (let key in state) if (state[key] && this.$input?.dataset[key + "Message"]) {
			message = this.$input?.dataset[key + "Message"] || "";
			break;
		}
		if (!this.isVisible) {
			let title = this.findLabel()?.textContent;
			if (!title) title = this.$input?.name || "";
			useUITheme().renderMessage(`Field: ${title} - ${message}`, "warning");
		}
		let $help = this.getErrorElement();
		if (!$help) {
			$help = this.createHelpElement();
			this.el.appendChild($help);
			this.prepareWrapper();
		}
		$help.textContent = message;
		this.updateValidClass(false);
	}
	getErrorElement() {
		return this.el.querySelector(this.errorSelector);
	}
	createHelpElement() {
		const className = this.mergedOptions.errorMessageClass;
		const parsed = this.parseSelector(this.errorSelector || "");
		const $help = html(`<div class="${className}"></div>`);
		$help.classList.add(...parsed.classes);
		parsed.attrs.forEach((attr) => {
			$help.setAttribute(attr[0], attr[1] || "");
		});
		parsed.ids.forEach((id) => {
			$help.id = id;
		});
		return $help;
	}
	/**
	* @see https://stackoverflow.com/a/17888178
	*/
	parseSelector(subselector) {
		const obj = {
			tags: [],
			classes: [],
			ids: [],
			attrs: []
		};
		for (const token of subselector.split(/(?=\.)|(?=#)|(?=\[)/)) switch (token[0]) {
			case "#":
				obj.ids.push(token.slice(1));
				break;
			case ".":
				obj.classes.push(token.slice(1));
				break;
			case "[":
				obj.attrs.push(token.slice(1, -1).split("="));
				break;
			default:
				obj.tags.push(token);
				break;
		}
		return obj;
	}
	setAsValidAndClearResponse() {
		this.setCustomValidity("");
		this.updateValidClass(true);
		this.clearInvalidResponse();
	}
	clearInvalidResponse() {
		const $help = this.el.querySelector(this.errorSelector);
		$help.textContent = "";
	}
	getForm() {
		return this.el.closest(this.options.formSelector || "[uni-form-validate]");
	}
	findLabel() {
		const id = this.$input?.id || "";
		const wrapper = this.$input?.closest("[data-field-wrapper]");
		let label = null;
		if (wrapper) label = wrapper.querySelector("[data-field-label]");
		if (!label) label = document.querySelector(`label[for="${id}"]`);
		return label;
	}
	hasChildDirectives() {
		return this.el.querySelector("[uni-field-validate]") != null;
	}
};
validatorHandlers.username = function(value, element) {
	return !(/* @__PURE__ */ new RegExp("[<|>|\"|'|%|;|(|)|&]", "i")).test(value);
};
validatorHandlers.numeric = function(value, element) {
	return /^(\d|-)?(\d|,)*\.?\d*$/.test(value);
};
validatorHandlers.email = function(value, element) {
	value = toASCII(value);
	return /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
};
validatorHandlers.url = function(value, element) {
	return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(value);
};
validatorHandlers.alnum = function(value, element) {
	return /^[a-zA-Z0-9]*$/.test(value);
};
validatorHandlers.color = function(value, element) {
	return /^#(?:[0-9a-f]{3}){1,2}$/.test(value);
};
/**
* @see  http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions
*/
validatorHandlers.creditcard = function(value, element) {
	return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/.test(value);
};
validatorHandlers.ip = function(value, element) {
	return /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/.test(value);
};
validatorHandlers["password-confirm"] = function(value, element) {
	const selector = element.dataset.confirmTarget;
	if (!selector) throw new Error("Validator: \"password-confirm\" must add \"data-confirm-target\" attribute.");
	return document.querySelector(selector)?.value === value;
};
var ready = /* @__PURE__ */ Promise.all([/* @__PURE__ */ useUniDirective("form-validate", {
	mounted(el, binding) {
		getBoundedInstance(el, "form.validation", (ele) => {
			return new UnicornFormValidation(ele, JSON.parse(binding.value || "{}"));
		});
	},
	updated(el, binding) {
		getBoundedInstance(el, "form.validation").mergeOptions(JSON.parse(binding.value || "{}"));
	}
}), /* @__PURE__ */ useUniDirective("field-validate", {
	mounted(el, binding) {
		getBoundedInstance(el, "field.validation", (ele) => {
			return new UnicornFieldValidation(ele, JSON.parse(binding.value || "{}"));
		});
	},
	updated(el, binding) {
		getBoundedInstance(el, "field.validation").setOptions(JSON.parse(binding.value || "{}") || {});
	}
})]);
function handleParamValue(value) {
	if (!isNaN(Number(value))) return Number(value);
	if (value === "null") return null;
	if (value === "true") return true;
	if (value === "false") return true;
	return value;
}
//#endregion
export { UnicornFieldValidation, UnicornFormValidation, ready, validatorHandlers as validators };

//# sourceMappingURL=validation.js.map