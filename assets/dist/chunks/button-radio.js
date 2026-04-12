import { t as mergeDeep } from "./arr.js";
import { t as data } from "./data.js";
import { a as h, d as selectOne, r as getBoundedInstance, u as selectAll } from "./dom.js";
import { useUniDirective } from "../unicorn.js";
//#region src/bootstrap/button-radio.ts
var defaultOptions = {
	selector: ".btn-group .radio",
	buttonClass: "btn",
	activeClass: "active",
	color: {
		"default": "btn-default btn-outline-secondary",
		green: "btn-success",
		red: "btn-danger",
		blue: "btn-primary"
	}
};
var ButtonRadio = class {
	wrapper;
	element;
	radios = [];
	inputs = [];
	buttons = [];
	colors = [];
	options;
	static handle(el, options = {}) {
		return getBoundedInstance(el, "button-radio", (el) => {
			return new this(el, options);
		});
	}
	constructor(selector, options = {}) {
		this.element = selectOne(selector);
		this.options = mergeDeep({}, defaultOptions, options);
		let wrapper;
		if (this.element.dataset.fieldInput != null) wrapper = this.element;
		else wrapper = this.element.querySelector("[data-field-input]");
		this.wrapper = wrapper;
		let inputGroup = wrapper.querySelector(".btn-group");
		const exists = inputGroup != null;
		if (!inputGroup) inputGroup = h("div", { class: "btn-group" });
		this.radios = selectAll(wrapper.querySelectorAll(".radio"));
		this.radios.forEach((radio) => {
			const button = this.prepareButton(radio, exists);
			if (!exists) inputGroup.appendChild(button);
		});
		this.syncState();
		wrapper.insertBefore(inputGroup, wrapper.firstChild);
		wrapper.dispatchEvent(new Event("button-radio.loaded"));
		this.colors = [...new Set(this.colors)];
	}
	prepareButton(radio, exists = false) {
		const options = this.options;
		const input = radio.querySelector("input");
		const label = radio.querySelector("label");
		let button;
		if (exists) {
			button = this.wrapper.querySelector(`[data-for="${input.id}"]`);
			button.classList.add(...this.parseClasses(`${options.buttonClass} ${options.color["default"]}`));
		} else button = h("button", {
			type: "button",
			class: `${options.buttonClass} ${options.color["default"]}`,
			"data-value": input.value
		}, `<span>${label.innerHTML}</span>`);
		data(button, "input", input);
		this.inputs.push(input);
		this.buttons.push(button);
		radio.style.display = "none";
		let color = input.dataset.colorClass || "";
		if (!color) {
			switch (input.value) {
				case "":
					color = options.color.blue || "";
					break;
				case "0":
					color = options.color.red || "";
					break;
				default:
					color = options.color.green || "";
					break;
			}
			input.dataset.colorClass = color;
		}
		this.colors.push(color);
		if (input.disabled || input.getAttribute("readonly") != null) {
			button.classList.add("disabled");
			button.disabled = true;
		}
		if (input.getAttribute("readonly") != null) button.classList.add("readonly");
		button.addEventListener("click", () => {
			if (input.getAttribute("disabled") || input.getAttribute("readonly")) return;
			if (!input.checked) {
				this.inputs.forEach((ele) => {
					ele.checked = false;
				});
				input.checked = true;
				input.dispatchEvent(new Event("change"));
				input.dispatchEvent(new Event("input"));
			}
		});
		input.addEventListener("change", () => {
			this.syncState();
		});
		return button;
	}
	syncState() {
		const options = this.options;
		this.buttons.forEach((button) => {
			const input = data(button, "input");
			button.classList.add(...this.parseClasses(options.color.default || ""));
			button.classList.remove(...this.parseClasses(options.activeClass));
			button.classList.remove(...this.parseClasses(...this.colors));
			if (input.checked) {
				button.classList.add(...this.parseClasses(options.activeClass));
				button.classList.add(...this.parseClasses(input.dataset.colorClass || ""));
				button.classList.remove(...this.parseClasses(options.color.default || ""));
			}
		});
	}
	parseClasses(...className) {
		return className.join(" ").split(" ").filter((t) => t !== "");
	}
};
var ready = /* @__PURE__ */ useUniDirective("button-radio", { mounted(el, { value }) {
	JSON.parse(value || "{}");
	ButtonRadio.handle(el, value || {});
} });
//#endregion
export { ButtonRadio, ready };

//# sourceMappingURL=button-radio.js.map