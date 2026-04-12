//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/queue.ts
var TaskQueue = class {
	items = [];
	currentRunning = 0;
	running = false;
	observers = [];
	constructor(maxRunning = 1) {
		this.maxRunning = maxRunning;
	}
	push(callback) {
		const p = new Promise((resolve, reject) => {
			this.items.push(() => {
				return Promise.resolve(callback()).then(resolve).catch(reject);
			});
		});
		this.run();
		return p;
	}
	run() {
		if (!this.running) this.running = true;
		this.pop();
	}
	async pop() {
		const callback = this.items.shift();
		if (!callback) {
			this.running = false;
			return Promise.resolve();
		}
		if (this.currentRunning >= this.maxRunning) {
			this.items.unshift(callback);
			return Promise.resolve();
		}
		this.currentRunning++;
		this.notice();
		try {
			return await callback();
		} catch (e) {
			throw e;
		} finally {
			this.endPop();
		}
	}
	endPop() {
		this.currentRunning--;
		this.notice();
		this.pop();
	}
	clear() {
		this.items = [];
		this.notice();
		return this;
	}
	isEmpty() {
		return this.items.length === 0;
	}
	get length() {
		return this.items.length;
	}
	peek() {
		return this.items;
	}
	observe(handler, options = {}) {
		this.observers.push({
			handler,
			once: options.once || false
		});
		return () => {
			this.off(handler);
		};
	}
	once(handler, options = {}) {
		options.once = true;
		return this.observe(handler, options);
	}
	onEnd(callback, options = {}) {
		return this.observe((queue, length, running) => {
			if (length === 0 && running === 0) callback(queue, length, running);
		}, options);
	}
	notice() {
		this.observers.forEach((observer) => {
			observer.handler(this, this.length, this.currentRunning);
		});
		this.observers = this.observers.filter((observer) => !observer.once);
		return this;
	}
	off(callback) {
		if (callback == null) {
			this.observers = [];
			return this;
		}
		this.observers = this.observers.filter((observer) => observer.handler !== callback);
		return this;
	}
};
function queue(maxRunning = 1) {
	return new TaskQueue(maxRunning);
}
//#endregion
//#region src/composable/useQueue.ts
var queues = {};
function useQueue(name = "default", maxRunning = 1) {
	return queues[name] ??= createQueue(maxRunning);
}
function createQueue(maxRunning = 1) {
	return queue(maxRunning);
}
//#endregion
export { useQueue as n, createQueue as t };

//# sourceMappingURL=useQueue.js.map