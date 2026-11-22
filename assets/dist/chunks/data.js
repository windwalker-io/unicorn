//#region src/utilities/data.ts
function getData(element, name) {
	prepareData(element);
	if (name === void 0) return element.__unicorn;
	return element.__unicorn[name];
}
function setData(element, name, value) {
	prepareData(element);
	element.__unicorn[name] = value;
}
function defData(element, name, defCallback) {
	prepareData(element);
	element.__unicorn[name] = element.__unicorn[name] || defCallback(element);
	return element.__unicorn[name];
}
function removeData$1(element, name) {
	prepareData(element);
	const v = element.__unicorn[name];
	delete element.__unicorn[name];
	return v;
}
function prepareData(element) {
	if (!element) return element;
	element.__unicorn = element.__unicorn || {};
	return element;
}
//#endregion
//#region src/data.ts
function data(ele, name, value) {
	if (!(ele instanceof HTMLElement)) {
		value = name;
		name = ele;
		ele = document;
	}
	if (name === void 0) return getData(ele);
	if (value === void 0) return getData(ele, name);
	setData(ele, name, value);
}
function removeData(ele, name = void 0) {
	if (!(ele instanceof HTMLElement)) {
		name = ele;
		ele = document;
	}
	removeData$1(ele, name);
}
//#endregion
export { removeData as n, defData as r, data as t };

//# sourceMappingURL=data.js.map