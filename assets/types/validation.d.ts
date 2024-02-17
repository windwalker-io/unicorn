import { AxiosProgressEvent, AxiosResponse } from 'axios';
import { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';

declare class S3Uploader extends S3Uploader_base {
	protected name: string;
	options: S3UploaderGlobalOptions;
	constructor(name: string, options?: Partial<S3UploaderGlobalOptions>);
	/**
	 * Do upload.
	 */
	upload(file: string | File | Blob, path: string, options?: Partial<S3UploaderRequestOptions>): Promise<S3UploaderResponse>;
}
declare class UnicornAnimate {
	protected app: UnicornApp;
	static install(app: UnicornApp): void;
	constructor(app: UnicornApp);
	to(element: HTMLElement, styles: Partial<Record<keyof CSSStyleDeclaration, any>>, options?: number | KeyframeAnimationOptions): Animation;
	getCurrentStyle(element: Element, name: keyof CSSStyleDeclaration): any;
}
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
declare class UnicornFieldValidation$1 {
	protected app: UnicornApp;
	protected el: HTMLElement;
	$input: InputElements;
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
	selectInput(): InputElements;
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
	createHelpElement(): Element;
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
declare class UnicornHelper {
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
	selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): NodeListOf<E>;
	selectAll<E extends Element = Element>(ele: NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
	selectAll<E extends Element = Element>(ele: string | NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
	selectAll<E extends keyof HTMLElementTagNameMap>(ele: E, callback?: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
	selectAll(ele: string, callback?: ((ele: Element) => any)): Element[];
	each(collection: any, iteratee: (item: any, i: number | string) => void): any;
	getBoundedInstance<T = any, E = Element>(selector: E, name: string, callback?: ((el: E) => any)): T;
	getBoundedInstance<T = any, E extends Element = HTMLElement>(selector: string | E, name: string, callback?: ((el: E) => any)): T | null;
	getBoundedInstanceList<T = any, E extends Element = HTMLElement>(selector: string | NodeListOf<E>, name: string, callback?: ((el: E) => any)): (T | null)[];
	module<T = any, E extends Element = HTMLElement>(ele: string, name: string, callback?: ((el: E) => any)): (T | null)[];
	module<T = any, E extends Element = HTMLElement>(ele: NodeListOf<HTMLElement>, name: string, callback?: ((el: E) => any)): (T | null)[];
	module<T = any, E extends Element = HTMLElement>(ele: HTMLElement, name: string, callback?: ((el: E) => any)): T | null;
	module<T = any, E extends Element = HTMLElement>(ele: string | HTMLElement | NodeListOf<HTMLElement>, name: string, callback?: ((el: E) => any)): (T | null)[] | T | null;
	h<T extends keyof HTMLElementTagNameMap>(element: T, attrs?: Record<string, any>, content?: any): HTMLElementTagNameMap[T];
	html(html: string): Element;
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
}
declare class UnicornLang {
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
declare class UnicornLoader {
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
declare class UnicornUI {
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
declare const S3Uploader_base: any;
declare const UnicornApp_base: any;
declare const validatorHandlers: Record<string, ValidationHandler>;
export declare function initValidations(app: UnicornApp): void;
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
export interface S3Uploader extends EventAwareInterface {
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
export interface UnicornPlugin {
	install?(app: UnicornApp, options?: any): void;
	uninstall?(app: UnicornApp, options?: any): void;
}
export type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type Nullable<T> = T | null | undefined;

export {
	UnicornFieldValidation$1 as UnicornFieldValidation,
	UnicornFormValidation$1 as UnicornFormValidation,
	validatorHandlers as validators,
};

export {};
