declare class UnicornApp extends UnicornApp_base {
	plugins: {};
	waits: Promise<any>[];
	options: Record<string, any>;
	constructor(options?: {});
	use(plugin: UnicornPlugin, options?: Record<string, any>): this;
	inject<T>(plugin: string): T;
	detach(plugin: any): this;
	tap<T>(value: T, callback: Function): T;
	data(name: string, data: any): any;
	data(name: string): any;
	data(ele: Element, name: string): any;
	data(ele: Element, name: string, data?: any): any;
	removeData(name: string): any;
	removeData(ele: Element, name: string): any;
	uri(type: string): any;
	asset(type: string): any;
	wait(callback: Function): Promise<any>;
	completed(): Promise<any[]>;
}
declare const EventBus_base: {
	new (): {};
};
declare const UnicornApp_base: any;
export declare class EventBus extends EventBus_base {
}
export declare class MixinBuilder<T extends object> {
	superclass: T | {} | undefined;
	constructor(superclass: T | {} | undefined);
	/**
	 * Applies `mixins` in order to the superclass given to `mix()`.
	 *
	 * @param {Array.<Mixin>} mixins
	 * @return {Function} a subclass of `superclass` with `mixins` applied
	 */
	with(...mixins: any[]): any;
}
export declare class UnicornAlpine2 {
	protected app: UnicornApp;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	import(...args: any[]): Promise<any>;
	ie11(): Promise<any>;
	loadAlpine(): Promise<any>;
	loadSpruce(): Promise<Awaited<any>[]>;
	initAlpine(selector: string | Element): Promise<void>;
	startAlpine(): Promise<void>;
	startAlpineSpruce(): Promise<void>;
	initAlpineSpruce(selector: string | Element): Promise<void>;
}
export declare class UnicornAnimate {
	protected app: UnicornApp;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	to(element: HTMLElement, styles: Partial<Record<keyof CSSStyleDeclaration, any>>, options?: number | KeyframeAnimationOptions): Animation;
	getCurrentStyle(element: Element, name: keyof CSSStyleDeclaration): any;
}
export declare class UnicornCrypto {
	protected app: UnicornApp;
	static is: string;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	/**
	 * Base64 URL encode
	 */
	base64Encode(string: string): string;
	/**
	 * Base64 URL decode
	 */
	base64Decode(string: string): string;
	/**
	 * XOR Cipher encrypt.
	 */
	encrypt(key: string, data: string): string;
	/**
	 * XOR Cipher decrypt.
	 */
	decrypt(key: string, data: string): string;
	/**
	 * Key char at.
	 */
	keyCharAt(key: string, i: number): number;
	/**
	 * UUID v4
	 *
	 * @see  https://gist.github.com/jed/982883
	 */
	uuid4(): string;
	/**
	 * Get uid, similar Windwalker Uililities uid().
	 */
	uid(prefix?: string, timebase?: boolean): string;
	tid(prefix?: string): string;
	randomString(n?: number): string;
	md5(str: string): string;
	serial(): number;
}
export declare class UnicornDirective {
	directives: Record<string, UnicornDirectiveHandler>;
	instances: Record<string, any[]>;
	listenTarget: HTMLElement;
	disconnectCallback: (() => void) | undefined;
	hooks: {
		mounted: {
			before?: DirectiveBaseHook;
			after?: DirectiveBaseHook;
		};
		unmounted: {
			before?: DirectiveBaseHook;
			after?: DirectiveBaseHook;
		};
		updated?: {
			before?: DirectiveBaseHook;
			after?: DirectiveBaseHook;
		};
	};
	static get is(): string;
	static install(app: UnicornApp, options?: {}): void;
	register(name: string, handler: UnicornDirectiveHandler): void;
	remove(name: string): void;
	getDirectiveAttrName(name: string): string;
	observeRoot(element: Element): () => void;
	observeChildren(element: Element): () => void;
	listenTo(target: HTMLElement): void;
	/**
	 * @returns {function(): void}
	 */
	listen(): () => void;
	disconnect(): void;
	getDirective(directive: string): UnicornDirectiveHandler;
	runDirectiveIfExists(directive: string, node: Element, task: "mounted" | "unmounted" | "updated", mutation?: MutationRecord | undefined): void;
	findDirectivesFromNode(node: Element): string[];
}
export declare class UnicornForm {
	protected app: UnicornApp;
	static get is(): string;
	static install(app: UnicornApp, options?: {}): void;
	constructor(app: UnicornApp);
	get(ele: Nullable<string | Element>, options?: Record<string, any>): any;
}
export declare const EventMixin: <T extends new (...args: any[]) => any>(superclass: T) => T;
/**
 * Decorates a mixin function to add deduplication, application caching and
 * instanceof support.
 *
 * @function
 * @param {MixinFunction} mixin The mixin to wrap
 * @return {MixinFunction} a new mixin function
 */
export declare function Mixin(mixin: MixinFunction): MixinFunction;
export declare function createApp(options?: {}): UnicornApp;
/**
 * A fluent interface to apply a list of mixins to a superclass.
 *
 * ```javascript
 * class X extends mix(Object).with(A, B, C) {}
 * ```
 *
 * The mixins are applied in order to the superclass, so the prototype chain
 * will be: X->C'->B'->A'->Object.
 *
 * This is purely a convenience function. The above example is equivalent to:
 *
 * ```javascript
 * class X extends C(B(A(Object))) {}
 * ```
 *
 * @function
 * @param {Function} [superclass=Object]
 * @return {MixinBuilder}
 */
export declare function mix<T extends object>(superclass: T): MixinBuilder<T>;
export declare function noConflict(): UnicornApp | undefined;
export declare type DirectiveBaseHook = (directive: string, node: Element) => void;
/**
 * A function that returns a subclass of its argument.
 *
 * @example
 * const M = (superclass) => class extends superclass {
 *   getMessage() {
 *     return "Hello";
 *   }
 * }
 */
export declare type MixinFunction = <T extends new (...args: any[]) => any>(superclass: T) => T;
export interface EventAwareInterface {
	on(event: string | string[], handler: Function): this;
	once(event: string | string[], handler: Function): this;
	off(event: string, handler?: Function): this;
	trigger(event: string | string[], ...args: any[]): this;
	listeners(event: string): Function[];
}
export interface UnicornApp extends EventAwareInterface {
}
export interface UnicornDirectiveBinding {
	directive: string;
	node: Element;
	value: any;
	oldValue: any;
	mutation?: MutationRecord;
	dir: UnicornDirectiveHandler;
}
export interface UnicornDirectiveHandler {
	mounted?: UnicornDirectiveHandlerHook;
	unmounted?: UnicornDirectiveHandlerHook;
	updated?: UnicornDirectiveHandlerHook;
}
export interface UnicornPlugin {
	install?(app: UnicornApp, options?: any): void;
	uninstall?(app: UnicornApp, options?: any): void;
}
export type Nullable<T> = T | null | undefined;
export type UnicornDirectiveHandlerHook = (node: Element, bindings: UnicornDirectiveBinding) => void;

