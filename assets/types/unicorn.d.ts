import { AxiosInstance, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';
import { Editor, EditorManager, EditorOptions } from 'tinymce';

declare class S3Uploader extends S3Uploader_base {
	static [x: string]: any;
	protected name: string;
	options: S3UploaderGlobalOptions;
	constructor(name: string, options?: Partial<S3UploaderGlobalOptions>);
	/**
	 * Do upload.
	 */
	upload(file: string | File | Blob, path: string, options?: Partial<S3UploaderRequestOptions>): Promise<S3UploaderResponse>;
}
declare class SimpleQueue {
	protected maxRunning: number;
	items: (() => Promise<any>)[];
	currentRunning: number;
	running: boolean;
	observers: {
		handler: Function;
		once: boolean;
	}[];
	constructor(maxRunning?: number);
	push(callback: Function): Promise<any>;
	run(): void;
	pop(): Promise<any>;
	endPop(): void;
	clear(): this;
	isEmpty(): boolean;
	get length(): number;
	peek(): (() => Promise<any>)[];
	observe(handler: ObserverFunction, options?: {
		once?: boolean;
	}): () => void;
	once(handler: ObserverFunction, options?: {
		once?: boolean;
	}): () => void;
	onEnd(callback: ObserverFunction, options?: {
		once?: boolean;
	}): () => void;
	notice(): this;
	off(callback?: Function): this;
}
declare class Stack {
	protected name: string;
	protected store: any[];
	observers: {
		handler: StackHandler;
		once: boolean;
	}[];
	constructor(name: string, store?: any[]);
	push(value?: any): number;
	pop(): any;
	clear(): this;
	isEmpty(): boolean;
	get length(): number;
	peek(): any[];
	observe(handler: (stack: Stack, length: number) => void): () => void;
	once(handler: StackHandler): () => void;
	notice(): this;
	off(callback?: StackHandler): this;
}
declare class TinymceEditor {
	protected app: UnicornApp;
	protected element: HTMLElement;
	editor?: Editor;
	options: Record<string, any>;
	constructor(app: UnicornApp, element: HTMLElement, options: Record<string, any>);
	get $http(): UnicornHttp;
	getEditor(): Editor;
	prepareOptions(options: Record<string, any>, version?: string): Record<string, any>;
	insert(text: string): void;
	getValue(): string;
	setValue(text: string): string;
	imageUploadHandler(blobInfo: UploadHandlerParams[0], progress: UploadHandlerParams[1]): Promise<any>;
}
declare class UnicornFieldValidation$1 {
	protected app: UnicornApp;
	protected el: HTMLElement;
	$input: InputElements | undefined;
	options: FieldValidationOptions;
	static is: string;
	constructor(app: UnicornApp, el: HTMLElement, options?: Partial<FieldValidationOptions>);
	get $helper(): UnicornHelper;
	get $lang(): UnicornLang;
	get $ui(): UnicornUI;
	setOptions(options: Partial<FormValidationOptions>): void;
	get $form(): HTMLFormElement;
	get errorSelector(): string;
	get selector(): string;
	get validClass(): string;
	get invalidClass(): string;
	get isVisible(): boolean;
	get isInputOptions(): boolean;
	get validationMessage(): string;
	get validity(): ValidityState | undefined;
	selectInput(): InputElements | undefined;
	init(): void;
	bindEvents(): void;
	prepareWrapper(): void;
	checkValidity(): boolean;
	runCustomValidity(): boolean;
	checkValidityAsync(): Promise<boolean>;
	runCustomValidityAsync(): Promise<boolean>;
	checkCustomDataAttributeValidity(): boolean;
	checkInputOptionsValidity(): boolean;
	/**
	 * @param valid {boolean}
	 */
	updateValidClass(valid: Boolean): void;
	getFormValidation(element?: Nullable<HTMLFormElement>): UnicornFormValidation$1 | null;
	getValidator(name: string): [
		Validator,
		Record<string, any>
	] | null;
	handleCustomResult(result: boolean | string | undefined, validator?: Nullable<Validator>): boolean;
	handleAsyncCustomResult(result: boolean, validator?: Nullable<Validator>): boolean;
	raiseCustomErrorState(validator: Validator): void;
	setAsInvalidAndReport(error: string): void;
	setCustomValidity(error: string): void;
	reportValidity(): void;
	showInvalidResponse(): void;
	getErrorElement(): Element | null;
	createHelpElement(): HTMLElement;
	/**
	 * @see https://stackoverflow.com/a/17888178
	 */
	parseSelector(subselector: string): {
		tags: string[];
		classes: string[];
		ids: string[];
		attrs: string[][];
	};
	setAsValidAndClearResponse(): void;
	clearInvalidResponse(): void;
	getForm(): HTMLFormElement;
	findLabel(): Element | null;
}
declare class UnicornFormValidation$1 {
	protected app: UnicornApp;
	presetFields: HTMLElement[];
	static globalValidators: Record<string, Validator>;
	validators: Record<string, Validator>;
	options: FormValidationOptions;
	$form: HTMLElement;
	static is: string;
	constructor(app: UnicornApp, el: HTMLElement, options?: Partial<FormValidationOptions>);
	get $helper(): UnicornHelper;
	get $ui(): UnicornUI;
	get $lang(): UnicornLang;
	setOptions(options: Partial<FormValidationOptions>): void;
	get scrollEnabled(): boolean;
	get scrollOffset(): number;
	get fieldSelector(): string;
	get validatedClass(): string;
	init(): void;
	findDOMFields(): HTMLElement[];
	prepareFields(inputs: HTMLElement[]): Promise<void>;
	prepareFieldWrapper(input: HTMLElement): HTMLElement | null;
	findFields(containsPresets?: boolean): HTMLElement[];
	getFieldComponent(input: HTMLElement): UnicornFieldValidation$1 | null;
	validateAll(fields?: Nullable<HTMLElement[]>): boolean;
	validateAllAsync(fields?: Nullable<HTMLElement[]>): Promise<boolean>;
	scrollTo(element: HTMLElement): void;
	markFormAsValidated(): void;
	markFormAsUnvalidated(): void;
	addField(field: HTMLElement): this;
	registerDefaultValidators(): void;
	/**
	 * Add validator handler.
	 */
	addValidator(name: string, handler: ValidationHandler, options?: Record<string, any>): this;
	/**
	 * Add validator handler.
	 */
	static addGlobalValidator(name: string, handler: ValidationHandler, options?: Record<string, any>): typeof UnicornFormValidation$1;
}
declare const EventBus_base: {
	new (): {};
};
declare const S3Uploader_base: any;
declare const UnicornApp_base: any;
declare const u: UnicornApp;
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
export declare class UnicornApp extends UnicornApp_base {
	static [x: string]: any;
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
	runDirectiveIfExists(directive: string, node: HTMLElement, task: "mounted" | "unmounted" | "updated", mutation?: MutationRecord | undefined): void;
	findDirectivesFromNode(node: Element): string[];
}
export declare class UnicornForm {
	protected app: UnicornApp;
	static get is(): string;
	static install(app: UnicornApp, options?: {}): void;
	constructor(app: UnicornApp);
	get(ele: Nullable<string | Element>, options?: Record<string, any>): any;
}
export declare class UnicornFormElement {
	protected app: UnicornApp;
	element: HTMLFormElement | undefined;
	options: Record<string, any>;
	constructor(app: UnicornApp, selector?: Nullable<string | Element>, $form?: Nullable<HTMLFormElement>, options?: Record<string, any>);
	bindEvents(): void;
	initComponent(store?: string, custom?: {}): any;
	useState(custom?: {}): Record<string, any>;
	getElement(): HTMLFormElement | undefined;
	submit(url?: Nullable<string>, data?: Nullable<Record<string, any>>, method?: Nullable<string>, customMethod?: Nullable<string>): boolean;
	injectInput(name: string, value: any): HTMLInputElement;
	/**
	 * Make a GET request.
	 */
	get(url?: Nullable<string>, data?: Nullable<Record<string, any>>, customMethod?: Nullable<string>): boolean;
	/**
	 * Post form.
	 */
	post(url?: Nullable<string>, data?: Nullable<Record<string, any>>, customMethod?: Nullable<string>): boolean;
	/**
	 * Make a PUT request.
	 */
	put(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Make a PATCH request.
	 */
	patch(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Make a DELETE request.
	 */
	delete(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * @see https://stackoverflow.com/a/53739792
	 *
	 * @param {Object} ob
	 * @returns {Object}
	 */
	static flattenObject(ob: Record<string, any>): Record<string, any>;
	static buildFieldName(field: string): string;
}
/**
 * UnicornGrid
 */
export declare class UnicornGrid {
	protected app: UnicornApp;
	static get is(): string;
	static install(app: UnicornApp, options?: {}): void;
	constructor(app: UnicornApp);
	get(ele: string | HTMLElement, options?: Record<string, any> | undefined): any;
}
export declare class UnicornGridElement {
	protected app: UnicornApp;
	element: HTMLElement;
	options: Record<string, any>;
	form: UnicornFormElement;
	ordering: string;
	state: {};
	static get defaultOptions(): {};
	constructor(app: UnicornApp, selector: string, element: HTMLElement, options?: Record<string, any>);
	get $helper(): UnicornHelper;
	get $lang(): UnicornLang;
	bindEvents(): void;
	initComponent(store?: string, custom?: {}): any;
	useState(this: any, custom?: Record<string, any>): Partial<Record<string, any>> & Record<string, any>;
	getElement(): HTMLElement;
	sendFilter($event?: Event | undefined, method?: null): void;
	clearFilters(element: HTMLElement, method?: Nullable<string>): void;
	toggleFilters(open: boolean, filterForm: HTMLElement): void;
	sort($el: HTMLElement): boolean;
	/**
	 * Sort two items.
	 */
	sortBy(ordering: Nullable<string>): boolean;
	isSortActive($el: HTMLElement): boolean;
	getDirection($el: HTMLElement): "ASC" | "DESC" | null;
	orderingEquals(a: Nullable<string>, b: Nullable<string>): boolean;
	/**
	 * Check a row's checkbox.
	 */
	checkRow(row: number, value?: boolean): void;
	getCheckboxByRow(row: number): Nullable<HTMLInputElement>;
	/**
	 * Update a row.
	 */
	updateRow(row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Update an item by id.
	 */
	updateItem(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Update a item with batch task.
	 */
	updateItemByTask(task: string, id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Update a row with batch task.
	 */
	updateRowByTask(task: string, row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * @deprecated  Use updateItemByTask() instead.
	 */
	doTask(task: string, id: number | string, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Batch update items.
	 */
	updateByTask(task: string, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	batch(task: string, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Copy a row.
	 */
	copyItem(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Copy a row.
	 */
	copyRow(row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Delete checked items.
	 */
	deleteList(message?: Nullable<string> | false, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Delete an item by row.
	 */
	deleteRow(row: number, msg?: Nullable<string>, url?: Nullable<string>, data?: Nullable<Record<string, any>>): Promise<boolean>;
	/**
	 * Delete an item.
	 */
	deleteItem(id: string, msg?: Nullable<string>, url?: Nullable<string>, data?: Nullable<Record<string, any>>): Promise<boolean>;
	/**
	 * Toggle all checkboxes.
	 */
	toggleAll(value: boolean): this;
	disableAllCheckboxes(): void;
	/**
	 * Count checked checkboxes.
	 */
	countChecked(): number;
	/**
	 * Get Checked boxes.
	 */
	getChecked(): HTMLInputElement[];
	getCheckedValues(): string[];
	/**
	 * Validate there has one or more checked boxes.
	 */
	validateChecked(event?: Event, callback?: Function, msg?: string): this;
	hasChecked(): boolean;
	/**
	 * Reorder all.
	 */
	reorderAll(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	/**
	 * Reorder items.
	 */
	moveItem(id: number | string, delta: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	moveUp(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	moveDown(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
	getId(suffix?: string): string;
}
export declare class UnicornHelper {
	protected app: UnicornApp;
	static get is(): string;
	static install(app: UnicornApp, options?: {}): void;
	constructor(app: UnicornApp);
	/**
	 * @see https://stackoverflow.com/a/9899701
	 */
	domready(callback?: ((value: any) => void) | undefined): Promise<void>;
	selectOne<K extends keyof HTMLElementTagNameMap>(ele: K): HTMLElementTagNameMap[K] | null;
	selectOne<E extends Element = Element>(ele: string): E | null;
	selectOne<E extends Element = Element>(ele: E): E;
	selectOne<E extends Element = Element>(ele: string | E): E | null;
	selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): E[];
	selectAll<E extends Element = Element>(ele: NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
	selectAll<E extends Element = Element>(ele: string | NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
	selectAll<E extends keyof HTMLElementTagNameMap>(ele: E, callback?: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
	each(collection: any, iteratee: (item: any, i: number | string) => void): any;
	getBoundedInstance<T = any, E = Element>(selector: E, name: string, callback?: ((el: E) => any)): T;
	getBoundedInstance<T = any, E extends Element = Element>(selector: string | E, name: string, callback?: ((el: E) => any)): T | null;
	getBoundedInstanceList<T = any, E extends Element = Element>(selector: string | NodeListOf<E>, name: string, callback?: ((el: E) => any)): (T | null)[];
	module<T = any, E extends Element = Element>(ele: string, name: string, callback?: ((el: E) => any)): (T | null)[];
	module<T = any, E extends Element = Element>(ele: NodeListOf<Element>, name: string, callback?: ((el: E) => any)): (T | null)[];
	module<T = any, E extends Element = Element>(ele: Element, name: string, callback?: ((el: E) => any)): T | null;
	module<T = any, E extends Element = Element>(ele: string | Element | NodeListOf<Element>, name: string, callback?: ((el: E) => any)): (T | null)[] | T | null;
	h<T extends keyof HTMLElementTagNameMap>(element: T, attrs?: Record<string, any>, content?: any): HTMLElementTagNameMap[T];
	html<T extends Element = HTMLElement>(html: string): T;
	get(obj: Record<string, any>, path: string): any;
	set<SetValue = any>(obj: Record<string, any>, path: string, value: SetValue): SetValue;
	/**
	 * Pure JS version of jQuery delegate()
	 *
	 * @see https://gist.github.com/iagobruno/4db2ed62dc40fa841bb9a5c7de92f5f8
	 *
	 * @param {Element|string} wrapper
	 * @param {string} selector
	 * @param {string} eventName
	 * @param { (e: Event) => void } callback
	 * @returns {(function(): void)}
	 */
	delegate(wrapper: Element | string, selector: string, eventName: string, callback: (e: Event) => void): () => void;
	debounce<T extends Function = Function>(handler: T, wait?: number): T;
	throttle<T extends Function = Function>(handler: T, wait?: number): T;
	isDebug(): boolean;
	confirm(message: string): Promise<boolean>;
	/**
	 * @param {string} title
	 * @param {string} text
	 * @param {string} type
	 * @returns {Promise<boolean>}
	 */
	alert(title: string, text?: string, type?: string): Promise<boolean>;
	nextTick(callback?: () => void): Promise<void>;
	addUriBase(uri: string, type?: string): string;
	/**
	 * Number format like php function.
	 *
	 * @param {string|number} number
	 * @param {number}        decimals
	 * @param {string}        decPoint
	 * @param {string}        thousandsSep
	 * @returns {string}
	 */
	numberFormat(number: string | number, decimals?: number, decPoint?: string, thousandsSep?: string): string;
	/**
	 * @see https://www.programiz.com/javascript/examples/generate-random-strings
	 * @param {number} length
	 * @returns {string}
	 */
	genRandomString(length: number): string;
	defaultsDeep(obj: any, ...args: any[]): any;
	sprintf(format: string, ...args: any[]): string;
	vsprintf(format: string, args: any[]): string;
}
export declare class UnicornHttp {
	protected app: UnicornApp;
	globalAxios?: Promise<AxiosInstance>;
	axios?: AxiosInstance;
	config: Record<string, any>;
	data: Record<string, any>;
	static get is(): string;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	get getSelf(): this;
	importAxios(): Promise<any>;
	getGlobalAxios(): Promise<AxiosInstance>;
	createHttp(): Promise<AxiosInstance>;
	getHttp(): Promise<AxiosInstance>;
	prepareAxios(axios: AxiosInstance): AxiosInstance;
	requestMiddleware(callback: Parameters<AxiosInstance["interceptors"]["request"]["use"]>[0]): Promise<number>;
	responseMiddleware(callback: Parameters<AxiosInstance["interceptors"]["response"]["use"]>[0]): Promise<number>;
	/**
	 * Send a GET request.
	 */
	get<T = any, D = any>(url: string, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	/**
	 * Send a POST request.
	 */
	post<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	/**
	 * Send a PUT request.
	 *
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} options
	 *
	 * @returns {Promise<AxiosResponse>}
	 */
	put<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	/**
	 * Send a PATCH request.
	 *
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} options
	 *
	 * @returns {Promise<AxiosResponse>}
	 */
	patch<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	/**
	 * Send a DELETE request.
	 *
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} options
	 *
	 * @returns {Promise<AxiosResponse>}
	 */
	delete<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	/**
	 * Send a HEAD request.
	 *
	 * @param {string} url
	 * @param {AxiosRequestConfig} options
	 *
	 * @returns {Promise<AxiosResponse>}
	 */
	head<T = any, D = any>(url: string, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	/**
	 * Send a OPTIONS request.
	 *
	 * @param {string} url
	 * @param {AxiosRequestConfig} options
	 *
	 * @returns {Promise<AxiosResponse>}
	 */
	options<T = any, D = any>(url: string, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
	isCancel(cancel: any): cancel is import("axios").Cancel;
	/**
	 * Send request.
	 */
	request<T = any, D = any>(options: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
	/**
	 * Set custom method with _method parameter.
	 *
	 * This method will return a clone of this object to help us send request once.
	 *
	 * @param {boolean} useHeader
	 *
	 * @returns {Promise<this>}
	 */
	customMethod(useHeader?: boolean): Promise<this>;
}
export declare class UnicornLang {
	protected app: UnicornApp;
	static get is(): string;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	__(text: string, ...args: any[]): string;
	/**
	 * Translate a string.
	 */
	trans(text: string, ...args: any[]): string;
	/**
	 * Sptintf language string.
	 */
	sprintf(text: string, ...args: any[]): string;
	/**
	 * Find text.
	 */
	find(key: string): string | null;
	/**
	 * Has language key.
	 */
	has(key: string): boolean;
	/**
	 * Add language key.
	 */
	add(key: string, value: string): this;
	/**
	 * Replace all symbols to dot(.).
	 */
	normalize(text: string): string;
	wrapDebug(text: string, success: boolean): string;
	getStrings(): Record<string, string>;
}
export declare class UnicornLoader {
	protected app: UnicornApp;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	doImport(src: string): Promise<any>;
	/**
	 * Import modules or scripts.
	 */
	import(...src: any[]): Promise<any | any[]>;
	/**
	 * Import sync.
	 */
	importSync(...src: any): Promise<any | any[]>;
	/**
	 * Import CSS files.
	 */
	importCSS(...src: any): Promise<any | any[]>;
	minFileName(fileName: string): string;
	asImported(name: string): void;
	/**
	 * Add after import hook for some url or id.
	 */
	afterImported(name: string, callback: (resolve: Function, reject?: Function) => void): Promise<any>;
}
export declare class UnicornQueue {
	protected app: UnicornApp;
	queues: Record<string, SimpleQueue>;
	static is: string;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	create(maxRunning?: number): SimpleQueue;
	get(name?: string, maxRunning?: number): SimpleQueue;
	set(name: string, queue: SimpleQueue): this;
	remove(name: string): this;
	all(): Record<string, SimpleQueue>;
}
export declare class UnicornRouter {
	protected app: UnicornApp;
	keys: {};
	static get is(): string;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	/**
	 * Add a route.
	 */
	add(route: string, url: string): this;
	/**
	 * Get route.
	 */
	route(route: string, query?: Record<string, any>): string;
	extractRoute(route: string, sep?: string): {
		path: string;
		route: string;
	};
	has(route: string): boolean;
	addQuery(url: string, query?: Record<string, any>): string;
	parseQuery(queryString: string): Record<string, any>;
	buildQuery(query: Record<string, any>): string;
	push(data: string | Record<string, any>): this;
	replace(data: string | Record<string, any>): this;
	state(): any;
	back(): void;
	forward(): void;
	/**
	 * @param {number} num
	 */
	go(num: number): void;
}
export declare class UnicornStack {
	protected app: UnicornApp;
	stacks: Record<string, Stack>;
	static is: string;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	create(name: string, store?: any[]): Stack;
	get(name: string, store?: any[]): Stack;
	set(name: string, stack: Stack): this;
	remove(name: string): this;
	all(): Record<string, Stack>;
}
export declare class UnicornTinymce {
	protected app: UnicornApp;
	protected ui: UnicornUI;
	instances: Record<string, TinymceEditor>;
	hooks: Function[];
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp, ui: UnicornUI);
	loadTinymce(): Promise<EditorManager>;
	configure(callback: (tinymce: Editor) => void): this;
	init(selector: string, options?: Record<string, any>): Promise<TinymceEditor>;
	get(selector: string): TinymceEditor;
	create(ele: HTMLElement, options?: Record<string, any>): TinymceEditor;
}
export declare class UnicornUI {
	protected app: UnicornApp;
	theme?: any;
	aliveHandle?: any;
	static get is(): string;
	static install(app: UnicornApp): void;
	static get defaultOptions(): {
		messageSelector: string;
	};
	installTheme(theme: any): void;
	protected get $loader(): UnicornLoader;
	protected get $helper(): UnicornHelper;
	protected get $animate(): UnicornAnimate;
	constructor(app: UnicornApp);
	loadAlpine(callback?: Nullable<() => void>): Promise<any>;
	initAlpine(directive: string): Promise<void>;
	/**
	 * Before Alpine init
	 */
	prepareAlpine(callback: () => void): void;
	/**
	 * Render Messages.
	 */
	renderMessage(messages: string | string[], type?: string): void;
	/**
	 * Clear messages.
	 */
	clearMessages(): void;
	/**
	 * Show notify.
	 */
	notify(messages: string | string[], type?: string): void;
	/**
	 * Clear notifies.
	 */
	clearNotifies(): void;
	/**
	 * webComponentPolyfill
	 */
	webComponentPolyfill(): Promise<unknown>;
	defineCustomElement(is: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): Promise<any>;
	/**
	 * Highlight mark some keywords.
	 *
	 * @param selector
	 * @param keyword
	 * @param options
	 * @returns Promise<any>
	 */
	mark(selector?: string | HTMLElement, keyword?: string, options?: Record<string, any>): Promise<any>;
	/**
	 * @see https://tom-select.js.org/
	 */
	tomSelect(selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>, options?: Record<string, any>, theme?: string): Promise<any>;
	/**
	 * Choices.js
	 *
	 * @deprecated Use TomSelect() instead.
	 */
	choices(selector: Nullable<string | HTMLElement>, options?: Record<string, any>): Promise<any>;
	/**
	 * Flatpickr
	 */
	flatpickr(): Promise<any>;
	listDependent(element?: Nullable<string | HTMLElement>, dependent?: Nullable<string | HTMLElement>, options?: Record<string, any>): Promise<any>;
	/**
	 * Cascade Select
	 */
	cascadeSelect(): Promise<any>;
	/**
	 * Single Drag Image
	 */
	sid(): Promise<any>;
	/**
	 * File Drag
	 */
	fileDrag(): Promise<any>;
	/**
	 * Iframe Modal
	 */
	iframeModal(): Promise<any>;
	/**
	 * Modal Field
	 */
	modalField(): Promise<any>;
	/**
	 * Multiple Uploader
	 */
	multiUploader(): Promise<any>;
	/**
	 * Repeatable
	 */
	repeatable(): Promise<any>;
	modalTree(): Promise<any>;
	/**
	 * S3 Uploader.
	 */
	s3Uploader(name: string): Promise<S3Uploader>;
	s3Uploader(name?: null): Promise<null>;
	slideUp(target: string | HTMLElement, duration?: number): Promise<Animation | void>;
	slideDown(target: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;
	/**
	 * slideToggle
	 */
	slideToggle(target: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;
	fadeOut(selector: string | HTMLElement, duration?: number): Promise<Animation | void>;
	fadeIn(selector: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;
	highlight(selector: string | HTMLElement, color?: string, duration?: number): Promise<Animation | void>;
	/**
	 * Color Picker.
	 */
	colorPicker(selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>, options?: Partial<SpectrumOptions>): Promise<any>;
	disableOnSubmit(formSelector?: string | HTMLFormElement, buttonSelector?: string, options?: Record<string, any>): void;
	disableIfStackNotEmpty(buttonSelector?: string, stackName?: string): void;
	checkboxesMultiSelect(selector?: Nullable<string | HTMLElement>, options?: Record<string, any>): Promise<any>;
	/**
	 * Keep alive.
	 */
	keepAlive(url: string, time?: number): () => void;
	/**
	 * Init Form Show On
	 */
	initShowOn(): Promise<any>;
	/**
	 * Vue component field.
	 */
	vueComponentField(selector?: Nullable<string | HTMLElement>, value?: any, options?: Record<string, any>): Promise<any>;
}
export declare class UnicornUri {
	protected app: UnicornApp;
	static is: string;
	asset: {
		path: (path?: string) => string;
		root: (path?: string) => string;
	};
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	path(path?: string): string;
	root(path?: string): string;
	current(): string;
	full(): string;
	route(): string;
	script(): string;
}
export declare class UnicornValidation {
	protected app: UnicornApp;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	/**
	 * Import
	 * @returns Promise<any>
	 */
	import(): Promise<any>;
	get $loader(): UnicornLoader;
	get $helper(): UnicornHelper;
	get(selector: string | Element): UnicornFormValidation$1 | null;
	getField(selector: string | Element): UnicornFieldValidation$1 | null;
	addGlobalValidator(name: string, validator: any, options?: Record<string, any>): Promise<any>;
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
export declare type DirectiveBaseHook = (directive: string, node: HTMLElement) => void;
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
export declare type ObserverFunction = (queue: SimpleQueue, length: number, running: number) => void;
export declare type StackHandler = (stack: Stack, length: number) => void;
export declare type UploadHandlerParams = Parameters<NonNullable<EditorOptions["images_upload_handler"]>>;
export declare type ValidationHandler = (value: any, input: HTMLElement, options?: Record<string, any>, fv?: UnicornFieldValidation$1) => any;
export declare type Validator = {
	handler: ValidationHandler;
	options?: Record<string, any>;
};
export interface EventAwareInterface {
	on(event: string | string[], handler: Function): this;
	once(event: string | string[], handler: Function): this;
	off(event: string, handler?: Function): this;
	trigger(event: string | string[], ...args: any[]): this;
	listeners(event: string): Function[];
}
export interface FieldValidationOptions {
	validClass: string;
	errorSelector: string;
	inputOptions: boolean;
	inputOptionsSelector: string;
	formSelector: string;
	selector: string;
	inputOptionsWrapperSelector: string;
	events: string[];
	invalidClass: string;
	errorMessageClass: string;
}
export interface FormValidationOptions {
	scroll: boolean;
	validatedClass: null;
	fieldSelector: null;
	scrollOffset: number;
	enabled: boolean;
}
export interface S3Uploader extends EventAwareInterface$1 {
}
export interface S3UploaderGlobalOptions {
	endpoint?: string;
	subfolder?: string;
	viewerHost?: string;
	starts_with: any[];
	formInputs?: {
		acl: string;
		bucket: string;
		key: string;
		Policy: string;
		"X-Amz-Algorithm": string;
		"X-Amz-Credential": string;
		"X-Amz-Date": string;
		"X-Amz-Signature": string;
		[name: string]: any;
	};
}
export interface S3UploaderRequestOptions {
	formInputs?: {
		[name: string]: any;
	};
	onUploadProgress?: (e: AxiosProgressEvent) => void;
	"Content-Type"?: string;
	"Content-Disposition"?: string;
	key?: string;
	[name: string]: any;
}
export interface S3UploaderResponse extends AxiosResponse {
	url: string;
}
export interface UnicornApp extends EventAwareInterface {
}
export interface UnicornDirectiveBinding<T extends Element = HTMLElement> {
	directive: string;
	node: T;
	value: any;
	oldValue: any;
	mutation?: MutationRecord;
	dir: UnicornDirectiveHandler<T>;
}
export interface UnicornDirectiveHandler<T extends Element = HTMLElement> {
	mounted?: UnicornDirectiveHandlerHook<T>;
	unmounted?: UnicornDirectiveHandlerHook<T>;
	updated?: UnicornDirectiveHandlerHook<T>;
}
export interface UnicornPlugin {
	install?(app: UnicornApp, options?: any): void;
	uninstall?(app: UnicornApp, options?: any): void;
}
export type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type Nullable<T> = T | null | undefined;
export type UnicornDirectiveHandlerHook<T extends Element = HTMLElement> = (node: T, bindings: UnicornDirectiveBinding) => void;
interface EventAwareInterface$1 {
	on(event: string | string[], handler: Function): this;
	once(event: string | string[], handler: Function): this;
	off(event: string, handler?: Function): this;
	trigger(event: string | string[], ...args: any[]): this;
	listeners(event: string): Function[];
}

export {
	u as default,
};

export {};
