//#region ../../../../node_modules/ts-mixer/dist/esm/index.js
/**
* Utility function that works like `Object.apply`, but copies getters and setters properly as well.  Additionally gives
* the option to exclude properties by name.
*/
var copyProps = (dest, src, exclude = []) => {
	const props = Object.getOwnPropertyDescriptors(src);
	for (let prop of exclude) delete props[prop];
	Object.defineProperties(dest, props);
};
/**
* Returns the full chain of prototypes up until Object.prototype given a starting object.  The order of prototypes will
* be closest to farthest in the chain.
*/
var protoChain = (obj, currentChain = [obj]) => {
	const proto = Object.getPrototypeOf(obj);
	if (proto === null) return currentChain;
	return protoChain(proto, [...currentChain, proto]);
};
/**
* Identifies the nearest ancestor common to all the given objects in their prototype chains.  For most unrelated
* objects, this function should return Object.prototype.
*/
var nearestCommonProto = (...objs) => {
	if (objs.length === 0) return void 0;
	let commonProto = void 0;
	const protoChains = objs.map((obj) => protoChain(obj));
	while (protoChains.every((protoChain) => protoChain.length > 0)) {
		const protos = protoChains.map((protoChain) => protoChain.pop());
		const potentialCommonProto = protos[0];
		if (protos.every((proto) => proto === potentialCommonProto)) commonProto = potentialCommonProto;
		else break;
	}
	return commonProto;
};
/**
* Creates a new prototype object that is a mixture of the given prototypes.  The mixing is achieved by first
* identifying the nearest common ancestor and using it as the prototype for a new object.  Then all properties/methods
* downstream of this prototype (ONLY downstream) are copied into the new object.
*
* The resulting prototype is more performant than softMixProtos(...), as well as ES5 compatible.  However, it's not as
* flexible as updates to the source prototypes aren't captured by the mixed result.  See softMixProtos for why you may
* want to use that instead.
*/
var hardMixProtos = (ingredients, constructor, exclude = []) => {
	var _a;
	const base = (_a = nearestCommonProto(...ingredients)) !== null && _a !== void 0 ? _a : Object.prototype;
	const mixedProto = Object.create(base);
	const visitedProtos = protoChain(base);
	for (let prototype of ingredients) {
		let protos = protoChain(prototype);
		for (let i = protos.length - 1; i >= 0; i--) {
			let newProto = protos[i];
			if (visitedProtos.indexOf(newProto) === -1) {
				copyProps(mixedProto, newProto, ["constructor", ...exclude]);
				visitedProtos.push(newProto);
			}
		}
	}
	mixedProto.constructor = constructor;
	return mixedProto;
};
var unique = (arr) => arr.filter((e, i) => arr.indexOf(e) == i);
/**
* Finds the ingredient with the given prop, searching in reverse order and breadth-first if searching ingredient
* prototypes is required.
*/
var getIngredientWithProp = (prop, ingredients) => {
	const protoChains = ingredients.map((ingredient) => protoChain(ingredient));
	let protoDepth = 0;
	let protosAreLeftToSearch = true;
	while (protosAreLeftToSearch) {
		protosAreLeftToSearch = false;
		for (let i = ingredients.length - 1; i >= 0; i--) {
			const searchTarget = protoChains[i][protoDepth];
			if (searchTarget !== void 0 && searchTarget !== null) {
				protosAreLeftToSearch = true;
				if (Object.getOwnPropertyDescriptor(searchTarget, prop) != void 0) return protoChains[i][0];
			}
		}
		protoDepth++;
	}
};
/**
* "Mixes" ingredients by wrapping them in a Proxy.  The optional prototype argument allows the mixed object to sit
* downstream of an existing prototype chain.  Note that "properties" cannot be added, deleted, or modified.
*/
var proxyMix = (ingredients, prototype = Object.prototype) => new Proxy({}, {
	getPrototypeOf() {
		return prototype;
	},
	setPrototypeOf() {
		throw Error("Cannot set prototype of Proxies created by ts-mixer");
	},
	getOwnPropertyDescriptor(_, prop) {
		return Object.getOwnPropertyDescriptor(getIngredientWithProp(prop, ingredients) || {}, prop);
	},
	defineProperty() {
		throw new Error("Cannot define new properties on Proxies created by ts-mixer");
	},
	has(_, prop) {
		return getIngredientWithProp(prop, ingredients) !== void 0 || prototype[prop] !== void 0;
	},
	get(_, prop) {
		return (getIngredientWithProp(prop, ingredients) || prototype)[prop];
	},
	set(_, prop, val) {
		const ingredientWithProp = getIngredientWithProp(prop, ingredients);
		if (ingredientWithProp === void 0) throw new Error("Cannot set new properties on Proxies created by ts-mixer");
		ingredientWithProp[prop] = val;
		return true;
	},
	deleteProperty() {
		throw new Error("Cannot delete properties on Proxies created by ts-mixer");
	},
	ownKeys() {
		return ingredients.map(Object.getOwnPropertyNames).reduce((prev, curr) => curr.concat(prev.filter((key) => curr.indexOf(key) < 0)));
	}
});
/**
* Creates a new proxy-prototype object that is a "soft" mixture of the given prototypes.  The mixing is achieved by
* proxying all property access to the ingredients.  This is not ES5 compatible and less performant.  However, any
* changes made to the source prototypes will be reflected in the proxy-prototype, which may be desirable.
*/
var softMixProtos = (ingredients, constructor) => proxyMix([...ingredients, { constructor }]);
var settings = {
	initFunction: null,
	staticsStrategy: "copy",
	prototypeStrategy: "copy",
	decoratorInheritance: "deep"
};
var mixins = /* @__PURE__ */ new WeakMap();
var getMixinsForClass = (clazz) => mixins.get(clazz);
var registerMixins = (mixedClass, constituents) => mixins.set(mixedClass, constituents);
var mergeObjectsOfDecorators = (o1, o2) => {
	var _a, _b;
	const allKeys = unique([...Object.getOwnPropertyNames(o1), ...Object.getOwnPropertyNames(o2)]);
	const mergedObject = {};
	for (let key of allKeys) mergedObject[key] = unique([...(_a = o1 === null || o1 === void 0 ? void 0 : o1[key]) !== null && _a !== void 0 ? _a : [], ...(_b = o2 === null || o2 === void 0 ? void 0 : o2[key]) !== null && _b !== void 0 ? _b : []]);
	return mergedObject;
};
var mergePropertyAndMethodDecorators = (d1, d2) => {
	var _a, _b, _c, _d;
	return {
		property: mergeObjectsOfDecorators((_a = d1 === null || d1 === void 0 ? void 0 : d1.property) !== null && _a !== void 0 ? _a : {}, (_b = d2 === null || d2 === void 0 ? void 0 : d2.property) !== null && _b !== void 0 ? _b : {}),
		method: mergeObjectsOfDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.method) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.method) !== null && _d !== void 0 ? _d : {})
	};
};
var mergeDecorators = (d1, d2) => {
	var _a, _b, _c, _d, _e, _f;
	return {
		class: unique([...(_a = d1 === null || d1 === void 0 ? void 0 : d1.class) !== null && _a !== void 0 ? _a : [], ...(_b = d2 === null || d2 === void 0 ? void 0 : d2.class) !== null && _b !== void 0 ? _b : []]),
		static: mergePropertyAndMethodDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.static) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.static) !== null && _d !== void 0 ? _d : {}),
		instance: mergePropertyAndMethodDecorators((_e = d1 === null || d1 === void 0 ? void 0 : d1.instance) !== null && _e !== void 0 ? _e : {}, (_f = d2 === null || d2 === void 0 ? void 0 : d2.instance) !== null && _f !== void 0 ? _f : {})
	};
};
var decorators = /* @__PURE__ */ new Map();
var findAllConstituentClasses = (...classes) => {
	var _a;
	const allClasses = /* @__PURE__ */ new Set();
	const frontier = new Set([...classes]);
	while (frontier.size > 0) for (let clazz of frontier) {
		const protoChainClasses = protoChain(clazz.prototype).map((proto) => proto.constructor);
		const mixinClasses = (_a = getMixinsForClass(clazz)) !== null && _a !== void 0 ? _a : [];
		const newClasses = [...protoChainClasses, ...mixinClasses].filter((c) => !allClasses.has(c));
		for (let newClass of newClasses) frontier.add(newClass);
		allClasses.add(clazz);
		frontier.delete(clazz);
	}
	return [...allClasses];
};
var deepDecoratorSearch = (...classes) => {
	const decoratorsForClassChain = findAllConstituentClasses(...classes).map((clazz) => decorators.get(clazz)).filter((decorators) => !!decorators);
	if (decoratorsForClassChain.length == 0) return {};
	if (decoratorsForClassChain.length == 1) return decoratorsForClassChain[0];
	return decoratorsForClassChain.reduce((d1, d2) => mergeDecorators(d1, d2));
};
var directDecoratorSearch = (...classes) => {
	const classDecorators = classes.map((clazz) => getDecoratorsForClass(clazz));
	if (classDecorators.length === 0) return {};
	if (classDecorators.length === 1) return classDecorators[0];
	return classDecorators.reduce((d1, d2) => mergeDecorators(d1, d2));
};
var getDecoratorsForClass = (clazz) => {
	let decoratorsForClass = decorators.get(clazz);
	if (!decoratorsForClass) {
		decoratorsForClass = {};
		decorators.set(clazz, decoratorsForClass);
	}
	return decoratorsForClass;
};
function Mixin(...constructors) {
	var _a, _b, _c;
	const prototypes = constructors.map((constructor) => constructor.prototype);
	const initFunctionName = settings.initFunction;
	if (initFunctionName !== null) {
		const initFunctions = prototypes.map((proto) => proto[initFunctionName]).filter((func) => typeof func === "function");
		const combinedInitFunction = function(...args) {
			for (let initFunction of initFunctions) initFunction.apply(this, args);
		};
		const extraProto = { [initFunctionName]: combinedInitFunction };
		prototypes.push(extraProto);
	}
	function MixedClass(...args) {
		for (const constructor of constructors) copyProps(this, new constructor(...args));
		if (initFunctionName !== null && typeof this[initFunctionName] === "function") this[initFunctionName].apply(this, args);
	}
	MixedClass.prototype = settings.prototypeStrategy === "copy" ? hardMixProtos(prototypes, MixedClass) : softMixProtos(prototypes, MixedClass);
	Object.setPrototypeOf(MixedClass, settings.staticsStrategy === "copy" ? hardMixProtos(constructors, null, ["prototype"]) : proxyMix(constructors, Function.prototype));
	let DecoratedMixedClass = MixedClass;
	if (settings.decoratorInheritance !== "none") {
		const classDecorators = settings.decoratorInheritance === "deep" ? deepDecoratorSearch(...constructors) : directDecoratorSearch(...constructors);
		for (let decorator of (_a = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.class) !== null && _a !== void 0 ? _a : []) {
			const result = decorator(DecoratedMixedClass);
			if (result) DecoratedMixedClass = result;
		}
		applyPropAndMethodDecorators((_b = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.static) !== null && _b !== void 0 ? _b : {}, DecoratedMixedClass);
		applyPropAndMethodDecorators((_c = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.instance) !== null && _c !== void 0 ? _c : {}, DecoratedMixedClass.prototype);
	}
	registerMixins(DecoratedMixedClass, constructors);
	return DecoratedMixedClass;
}
var applyPropAndMethodDecorators = (propAndMethodDecorators, target) => {
	const propDecorators = propAndMethodDecorators.property;
	const methodDecorators = propAndMethodDecorators.method;
	if (propDecorators) for (let key in propDecorators) for (let decorator of propDecorators[key]) decorator(target, key);
	if (methodDecorators) for (let key in methodDecorators) for (let decorator of methodDecorators[key]) decorator(target, key, Object.getOwnPropertyDescriptor(target, key));
};
//#endregion
//#region src/events.ts
var EventMixin = class {
	_listeners = {};
	on(event, handler) {
		if (Array.isArray(event)) {
			for (const e of event) this.on(e, handler);
			return this;
		}
		this._listeners[event] ??= [];
		this._listeners[event].push(handler);
		return this;
	}
	once(event, handler) {
		handler.once = true;
		return this.on(event, handler);
	}
	off(event, handler) {
		if (handler) {
			this._listeners[event] = this.listeners(event).filter((listener) => listener !== handler);
			return this;
		}
		delete this._listeners[event];
		return this;
	}
	trigger(event, ...args) {
		if (Array.isArray(event)) {
			for (const e of event) this.trigger(e);
			return this;
		}
		for (const listener of this.listeners(event)) listener(...args);
		this._listeners[event] = this.listeners(event).filter((listener) => listener?.once !== true);
		return this;
	}
	listeners(event) {
		return this._listeners[event] === void 0 ? [] : this._listeners[event];
	}
};
//#endregion
export { Mixin as n, EventMixin as t };

//# sourceMappingURL=events.js.map