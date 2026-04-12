//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/stack.ts
var Stack = class {
	observers = [];
	constructor(store = []) {
		this.store = store;
	}
	push(value) {
		const r = this.store.push(value ?? true);
		this.notice();
		return r;
	}
	pop() {
		const r = this.store.pop();
		this.notice();
		return r;
	}
	clear() {
		this.store = [];
		this.notice();
		return this;
	}
	isEmpty() {
		return this.store.length === 0;
	}
	get length() {
		return this.store.length;
	}
	peek() {
		return this.store;
	}
	observe(handler) {
		this.observers.push({
			handler,
			once: false
		});
		return () => {
			this.off(handler);
		};
	}
	once(handler) {
		this.observers.push({
			handler,
			once: true
		});
		return () => {
			this.off(handler);
		};
	}
	notice() {
		this.observers.forEach((observer) => {
			observer.handler(this, this.length);
		});
		this.observers = this.observers.filter((observer) => observer.once !== true);
		return this;
	}
	off(callback) {
		this.observers = this.observers.filter((observer) => observer.handler !== callback);
		return this;
	}
};
function stack(store = []) {
	return new Stack(store);
}
//#endregion
//#region src/composable/useStack.ts
var stacks = {};
function useStack(name = "default", store = []) {
	return stacks[name] ??= createStack(store);
}
function createStack(store = []) {
	return stack(store);
}
//#endregion
export { useStack as n, createStack as t };

//# sourceMappingURL=useStack.js.map