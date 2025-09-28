import { AlertAdapter } from '@lyrasoft/ts-toolkit/generic';
import { Alpine as Alpine_2 } from 'alpinejs';
import { AxiosError } from 'axios';
import { AxiosInstance } from 'axios';
import { AxiosProgressEvent } from 'axios';
import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';
import { AxiosStatic } from 'axios';
import * as bootstrap_2 from 'bootstrap';
import { CanceledError } from 'axios';
import { Class } from 'ts-mixer/dist/types/types';
import { CreateAxiosDefaults } from 'axios';
import { default as default_2 } from 'cropperjs';
import { default as default_3 } from 'web-directive';
import { deleteConfirm } from '@lyrasoft/ts-toolkit/generic';
import { Editor } from 'tinymce';
import { EditorOptions } from 'tinymce';
import { randomBytes } from '@lyrasoft/ts-toolkit/generic';
import { randomBytesString } from '@lyrasoft/ts-toolkit/generic';
import { simpleAlert } from '@lyrasoft/ts-toolkit/generic';
import { simpleConfirm } from '@lyrasoft/ts-toolkit/generic';
import { sleep } from '@lyrasoft/ts-toolkit/generic';
import { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';
import { Stack } from '@lyrasoft/ts-toolkit/generic';
import { TaskQueue } from '@lyrasoft/ts-toolkit/generic';
import { tid } from '@lyrasoft/ts-toolkit/generic';
import { TinyMCE } from 'tinymce';
import { Tooltip } from 'bootstrap';
import { uid } from '@lyrasoft/ts-toolkit/generic';
import { WebDirectiveHandler } from 'web-directive/src/types';
import { WebDirectiveOptions } from 'web-directive/src/types';

export declare function __(id: string, ...args: any[]): string;

export declare function addGlobalValidator(name: string, validator: ValidationHandler, options?: Record<string, any>): Promise<void>;

declare function addHook(handler: ((tinymce: TinyMCE) => MaybePromise<any>)): void;

export declare function addQuery(url: string, query?: Record<string, any>): string;

/**
 * Add a route.
 */
export declare function addRoute(route: string, url: string): void;

export declare function addUriBase(uri: string, type?: string): string;

export { AlertAdapter }

declare type AlpinePrepareCallback = (Alpine: Alpine_2) => MaybePromise<any>;

export declare function animateTo(element: HTMLElement, styles: Partial<Record<keyof CSSStyleDeclaration, any>>, options?: number | KeyframeAnimationOptions): Animation;

declare type AssetTypes = 'root' | 'path';

/**
 * Base64 URL decode
 */
export declare function base64UrlDecode(string: string): string;

export declare function base64UrlEncode(string: string): string;

export declare function buildQuery(query: Record<string, any>): string;

declare class ButtonRadio {
    wrapper: HTMLElement;
    element: HTMLElement;
    radios: HTMLInputElement[];
    inputs: HTMLInputElement[];
    buttons: HTMLButtonElement[];
    colors: string[];
    options: ButtonRadioOptions;
    static handle(el: HTMLElement | string, options?: ButtonRadioOptions): any;
    constructor(selector: HTMLElement | string, options?: ButtonRadioOptions);
    prepareButton(radio: HTMLInputElement, exists?: boolean): HTMLButtonElement;
    syncState(): void;
    parseClasses(...className: string[]): string[];
}

declare interface ButtonRadioModule {
    ButtonRadio: typeof ButtonRadio;
    ready: typeof ready_7;
}

declare interface ButtonRadioOptions {
    selector?: string;
    buttonClass?: string;
    activeClass?: string;
    color?: {
        'default'?: string;
        green?: string;
        red?: string;
        blue?: string;
    };
}

declare interface CascadeSelectModule {
    ready: typeof ready;
}

declare class CheckboxesMultiSelect {
    defaultOptions: {
        duration: number;
        inputSelector: string;
    };
    $element: HTMLElement;
    options: any;
    boxes: HTMLInputElement[];
    last: HTMLInputElement | false;
    static handle(selector: any, options?: any): any[];
    constructor(selector: any, options?: {});
    select(box: HTMLInputElement, event: MouseEvent): void;
}

declare function clearHooks(): void;

/**
 * Clear messages.
 */
export declare function clearMessages(): void;

/**
 * Clear notifies.
 */
export declare function clearNotifies(): void;

declare type Conditions = Record<string, any>;

declare type Constructor<T> = new (...args: any[]) => T;

declare function createCallback(type: 'list' | 'single', selector: string, modalSelector: string): ModalSelectCallback;

export declare function createQueue(maxRunning?: number): TaskQueue;

export declare function createStack<T = any>(store?: any[]): Stack<T>;

export declare function createUnicorn(): UnicornApp;

export declare function createUnicornWithPlugins(): UnicornApp;

export declare function data(name: string, data: any): any;

export declare function data(name: string): any;

export declare function data(ele: Element, name: string): any;

export declare function data(ele: Element, name: string, data?: any): any;

export declare function debounce<T extends Function = Function>(handler: T, wait?: number): T;

/**
 * Pure JS version of jQuery delegate()
 *
 * @see https://gist.github.com/iagobruno/4db2ed62dc40fa841bb9a5c7de92f5f8
 */
export declare function delegate(wrapper: Element | string, selector: string, eventName: string, callback: (e: Event) => void): () => void;

export { deleteConfirm }

declare function destroy(selector: string): void;

declare interface Dictionary<T = any> {
    [key: string]: T;
}

export declare function doImport<T = any>(src: string): Promise<T>;

/**
 * @see https://stackoverflow.com/a/9899701
 */
export declare function domready(callback?: ((value: any) => any)): Promise<void>;

export declare interface EventAwareInterface {
    on(event: string | string[], handler: EventHandler): this;
    once(event: string | string[], handler: EventHandler): this;
    off(event: string, handler?: EventHandler): this;
    trigger(event: string | string[], ...args: any[]): this;
    listeners(event: string): EventHandler[];
}

export declare class EventBus extends EventBus_base {
}

declare const EventBus_base: Class<any[], EventMixin, typeof EventMixin>;

export declare type EventHandler = ((...event: any[]) => void) & {
    once?: boolean;
};

export declare abstract class EventMixin implements EventAwareInterface {
    _listeners: Record<string, EventHandler[]>;
    on(event: string | string[], handler: EventHandler): this;
    once(event: string | string[], handler: EventHandler): this;
    off(event: string, handler?: EventHandler): this;
    trigger(event: string | string[], ...args: any[]): this;
    listeners(event: string): EventHandler[];
}

export declare function fadeIn(selector: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;

export declare function fadeOut(selector: string | HTMLElement, duration?: number): Promise<Animation | void>;

declare interface FieldValidationOptions {
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

declare class FileDragElement extends HTMLElement {
    static is: string;
    element: HTMLInputElement;
    overlayLabel: HTMLLabelElement;
    button: HTMLButtonElement;
    options: FileDragOptions;
    get inputSelector(): string;
    get multiple(): boolean;
    connectedCallback(): void;
    bindEvent(): void;
    prepareElements(): void;
    createElementsLayout(): void;
    onChange(evt?: Event): void;
    checkFileType(accepted: string[], file: File): void;
    compareMimeType(accepted: string, mime: string): boolean;
    alert(title: string, text?: string, type?: string): Promise<void>;
}

declare interface FileDragModule {
    FileDragElement: typeof FileDragElement;
}

declare interface FileDragOptions {
    maxFiles: number | undefined;
    maxSize: number | undefined;
    placeholder: string;
    height: number;
}

export declare function forceArray<T>(item: T | T[]): T[];

declare interface FormValidationOptions {
    scroll: boolean;
    validatedClass: null;
    fieldSelector: null;
    scrollOffset: number;
    enabled: boolean;
}

declare function get(selector: string, options?: Record<string, any>): Promise<TinymceController>;

export declare function getBoundedInstance<T = any, E = Element>(selector: E, name: string, callback?: ((el: E) => any)): T;

export declare function getBoundedInstance<T = any, E extends Element = Element>(selector: string | E, name: string, callback?: ((el: E) => any)): T | null;

export declare function getBoundedInstanceList<T = any, E extends Element = Element>(selector: string | NodeListOf<E>, name: string, callback?: ((el: E) => any)): (T | null)[];

export declare function h<T extends keyof HTMLElementTagNameMap>(element: T, attrs?: Record<string, any>, content?: any): HTMLElementTagNameMap[T];

export declare function hasRoute(route: string): boolean;

export declare function highlight(selector: string | HTMLElement, color?: string, duration?: number): Promise<Animation | void>;

export declare function html<T extends Element = HTMLElement>(html: string): T;

declare class IFrameModalElement extends HTMLElement {
    static is: string;
    options: IFrameModalOptions;
    modalElement: HTMLDivElement;
    modal: any;
    iframe: HTMLIFrameElement;
    template(): string;
    get selector(): string;
    getBootstrapModal(): Promise<any>;
    connectedCallback(): void;
    bindEvents(): void;
    open(href: string, options?: IFrameModalOptions): Promise<void>;
    close(): Promise<void>;
    resize(iframe: HTMLIFrameElement): void;
    getModalId(): string;
}

declare interface IframeModalModule {
    IFrameModalElement: typeof IFrameModalElement;
    ready: typeof ready_3;
}

declare interface IFrameModalOptions {
    id?: string;
    size?: string;
    resize?: boolean;
    height?: string;
}

export declare function initAlpineComponent(directive: string): Promise<void>;

export declare function injectCssToDocument(doc: Document, ...css: (string | CSSStyleSheet)[]): CSSStyleSheet[];

export declare function injectCssToDocument(...css: (string | CSSStyleSheet)[]): CSSStyleSheet[];

declare type InjectionKey<T = any> = string | symbol | Constructor<T>;

declare type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export declare function isDebug(): boolean;

declare class KeepTab {
    $element: HTMLElement;
    tabButtons: NodeListOf<HTMLElement>;
    storageKey: string;
    options: any;
    constructor(selector: HTMLElement | string, options?: KeepTabOptions);
    protected init(uid: string): Promise<void>;
    bindEvents(): void;
    getButtonHref(button: HTMLAnchorElement): string;
    findTabButtonByHref(href: string): HTMLAnchorElement | undefined;
    activateTab(href: string): void;
    hasTab(href: string): boolean;
    /**
     * Switch tab.
     *
     * @returns {boolean}
     */
    switchTab(): true | undefined;
    /**
     * Hash code.
     */
    hashCode(text: string): Promise<string>;
}

declare interface KeepTabModule {
    KeepTab: typeof KeepTab;
    ready: typeof ready_6;
}

declare interface KeepTabOptions {
    uid?: string;
    delay?: number;
    tabItemSelector?: string;
}

declare class ListDependent {
    element: HTMLSelectElement;
    dependent: HTMLSelectElement;
    options: ListDependentOptions;
    cancelToken: null;
    static handle(el: string | Element, dependent?: null, options?: Partial<ListDependentOptions>): ListDependent;
    constructor(element: any, dependent: any, options?: Partial<ListDependentOptions>);
    /**
     * Bind events.
     */
    bindEvents(): void;
    /**
     * Update the list elements.
     *
     * @param {*}    value
     * @param {bool} initial
     */
    changeList(value: string, initial?: boolean): void;
    /**
     * Update list by source.
     *
     * @param {string} value
     * @param {bool}   initial
     */
    sourceUpdate(value: string, initial?: boolean): void;
    /**
     * Do ajax.
     *
     * @param {string} value
     */
    ajaxUpdate(value: string): Promise<void>;
    updateListElements(items: MaybeGroupedListItems): void;
    appendOptionTo(item: any, parent: any): void;
    isSelected(value: string): boolean;
    /**
     * Before hook.
     */
    beforeHook(value: string, element: HTMLSelectElement, dependent: HTMLSelectElement): any;
    /**
     * After hook.
     */
    afterHook(value: string, element: HTMLSelectElement, dependent: HTMLSelectElement): any;
    mergeOptions(options: Partial<ListDependentOptions>): ListDependentOptions;
}

declare type ListDependentModule = {
    ListDependent: typeof ListDependent;
    ready: typeof ready_4;
};

declare interface ListDependentOptions {
    ajax: {
        url: string | null | ((self: ListDependent) => string);
        value_field: string;
        data: Record<string, any> | ((data: Record<string, any>, self: ListDependent) => Record<string, any>);
    };
    source: Record<string, any> | null;
    text_field: string;
    value_field: string;
    first_option: Record<string, any> | null;
    default_value: any;
    initial_load: boolean;
    empty_mark: string;
    hooks: {
        before_request: (value: any, element: HTMLSelectElement, dependent: HTMLSelectElement) => any;
        after_request: (value: any, element: HTMLSelectElement, dependent: HTMLSelectElement) => any;
    };
}

declare type ListItems = Record<string, any>[];

export declare function loadAlpine(callback?: Nullable<AlpinePrepareCallback>): Promise<Alpine_2>;

export declare function mark(selector?: string | HTMLElement, keyword?: string, options?: Record<string, any>): Promise<any>;

declare type MaybeGroupedListItems = Record<string, ListItems> | ListItems;

declare type MaybePromise<T> = T | Promise<T>;

declare type ModalSelectCallback = (item: any) => void;

declare interface ModalSelectModule {
    createCallback: typeof createCallback;
}

export declare function modalTree(): Promise<any>;

declare function module_2<T = any, E extends Element = Element>(ele: string, name: string, callback?: ((el: E) => any)): (T | null)[];

declare function module_2<T = any, E extends Element = Element>(ele: NodeListOf<Element>, name: string, callback?: ((el: E) => any)): (T | null)[];

declare function module_2<T = any, E extends Element = Element>(ele: Element, name: string, callback?: ((el: E) => any)): T | null;

declare function module_2<T = any, E extends Element = Element>(ele: string | Element | NodeListOf<Element>, name: string, callback?: ((el: E) => any)): (T | null)[] | T | null;
export { module_2 as module }

/**
 * Multiple Uploader
 */
export declare function multiUploader(): Promise<any>;

export declare function nextTick(callback?: () => any): Promise<any>;

/**
 * Show notify.
 */
export declare function notify(messages: string | string[], type?: string): void;

declare type Nullable<T> = T | null | undefined;

export declare function parseQuery<T = Record<string, any>>(queryString: string): T;

/**
 * Before Alpine init
 */
export declare function prepareAlpine(callback: AlpinePrepareCallback): Promise<void>;

export declare function prepareAlpineDefer(callback: AlpinePrepareCallback): Promise<void>;

export declare function pushUnicornToGlobal(app?: UnicornApp): void;

export { randomBytes }

export { randomBytesString }

declare const ready: Promise<void>;

declare const ready_2: Promise<void>;

declare const ready_3: Promise<void>;

declare const ready_4: Promise<void>;

declare const ready_5: Promise<void>;

declare const ready_6: Promise<void>;

declare const ready_7: Promise<void>;

export declare function removeData(name: string): any;

export declare function removeData(ele: Element, name: string): any;

/**
 * Render Messages.
 */
export declare function renderMessage(messages: string | string[], type?: string): void;

declare interface RepeatableModule {
    ready: typeof ready_2;
}

/**
 * Get route.
 */
export declare function route(route: string, query?: Record<string, any>): string;

declare class S3Uploader extends S3Uploader_base implements EventAwareInterface {
    protected name: string;
    options: S3UploaderGlobalOptions;
    http?: UnicornHttpClient;
    constructor(name: string, options?: Partial<S3UploaderGlobalOptions>);
    getHttpClient(): Promise<UnicornHttpClient>;
    /**
     * Do upload.
     */
    upload(file: string | File | Blob, path: string, options?: Partial<S3UploaderRequestOptions>): Promise<S3UploaderResponse>;
}

declare const S3Uploader_base: Class<any[], EventMixin, typeof EventMixin>;

declare interface S3UploaderGlobalOptions {
    endpoint?: string;
    subfolder?: string;
    viewerHost?: string;
    starts_with: any[];
    formInputs?: {
        acl: string;
        bucket: string;
        key: string;
        Policy: string;
        'X-Amz-Algorithm': string;
        'X-Amz-Credential': string;
        'X-Amz-Date': string;
        'X-Amz-Signature': string;
        [name: string]: any;
    };
}

declare interface S3UploaderModule {
    get(name: string, options?: Partial<S3UploaderGlobalOptions>): S3Uploader;
    create(name: string, options?: Partial<S3UploaderGlobalOptions>): S3Uploader;
    destroy(name: string): void;
    S3Uploader: typeof S3Uploader;
}

declare interface S3UploaderRequestOptions {
    formInputs?: {
        [name: string]: any;
    };
    onUploadProgress?: (e: AxiosProgressEvent) => void;
    'Content-Type'?: string;
    'Content-Disposition'?: string;
    key?: string;
    [name: string]: any;
}

declare interface S3UploaderResponse extends AxiosResponse {
    url: string;
}

export declare function selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): E[];

export declare function selectAll<E extends Element = Element>(ele: NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];

export declare function selectAll<E extends Element = Element>(ele: string | NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];

export declare function selectAll<E extends keyof HTMLElementTagNameMap>(ele: E, callback?: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];

export declare function selectOne<K extends keyof HTMLElementTagNameMap>(ele: K): HTMLElementTagNameMap[K] | null;

export declare function selectOne<E extends Element = Element>(ele: string): E | null;

export declare function selectOne<E extends Element = Element>(ele: E): E;

export declare function selectOne<E extends Element = Element>(ele: string | E): E | null;

export declare function serial(): number;

declare class ShowOn {
    el: null;
    input: null;
    conditions: Conditions;
    targets: {};
    readonly: boolean;
    initialDisplay: null;
    constructor(el: HTMLElement, conditions: Conditions);
    init(): void;
    updateShowState(target: HTMLElement, value: any, duration?: number): void;
    isValueMatched(target: HTMLElement, value: any): boolean;
    /**
     * @see https://github.com/nickjackson/val/blob/master/index.js#L55
     * @param el
     * @returns {string}
     */
    nodeType(el: HTMLElement): "select" | "textarea" | "checkbox" | "input" | "radio";
}

declare interface ShowOnModule {
    ShowOn: typeof ShowOn;
    ready: typeof ready_5;
}

export { simpleAlert }

export { simpleConfirm }

declare class SingleImageDragElement extends HTMLElement {
    static is: string;
    currentImage: string;
    currentFile: any;
    lastZoom: number;
    valueBackup: string;
    private options;
    private valueInput;
    private fileInput;
    private selectButton;
    private pasteButton;
    private dragarea;
    private previewImage;
    private removeCheckbox;
    private modalElement;
    private modal;
    private cropContainer;
    private savebutton;
    private modalToolbarButtons;
    private cropper;
    constructor();
    connectedCallback(): void;
    bindEvents(): void;
    getInputAccept(): string;
    handleFileSelect(file: File): void;
    saveCropped(): Promise<void>;
    getCropper(): Promise<default_2>;
    toolbarClicked(button: HTMLButtonElement, event: MouseEvent): Promise<void>;
    checkFile(file: File): boolean;
    compareMimeType(accept: any, mime: any): boolean;
    /**
     * Check image size.
     *
     * @param {Image} image
     *
     * @returns {boolean}
     */
    checkSize(image: any): boolean;
    alert(title: string, text?: string, type?: string): Promise<void>;
    saveImage(file: File): Promise<void>;
    uploadImage(file: File): Promise<AxiosResponse<any, any, {}>>;
    storeValue(url: string, preview: string): void;
}

declare interface SingleImageDragModule {
    SingleImageDragElement: typeof SingleImageDragElement;
}

export { sleep }

export declare function slideDown(target: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;

/**
 * slideToggle
 */
export declare function slideToggle(target: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;

export declare function slideUp(target: string | HTMLElement, duration?: number): Promise<Animation | void>;

export declare function throttle<T extends Function = Function>(handler: T, wait?: number): T;

export { tid }

declare class TinymceController {
    element: HTMLElement;
    editor?: Editor;
    options: Record<string, any>;
    constructor(element: HTMLElement, options: Record<string, any>);
    prepareOptions(options: Record<string, any>, version?: string): Record<string, any>;
    insert(text: string): void;
    getValue(): string;
    setValue(text: string): void;
    imageUploadHandler(blobInfo: UploadHandlerParams[0], progress: UploadHandlerParams[1]): Promise<any>;
}

declare interface TinymceModule {
    get: typeof get;
    destroy: typeof destroy;
    addHook: typeof addHook;
    clearHooks: typeof clearHooks;
    TinymceController: typeof TinymceController;
}

export declare function trans(id: string, ...args: any[]): string;

declare class UIBootstrap5 implements UIThemeInterface {
    static instance: UIBootstrap5 | null;
    bootstrap: typeof bootstrap_2;
    static get(): UIBootstrap5;
    renderMessage(messages: string | string[], type?: string): void;
    clearMessages(): void;
    keepTab(): Promise<KeepTabModule>;
    keepTab(selector?: string | HTMLElement, options?: KeepTabOptions): Promise<KeepTab>;
    buttonRadio(): Promise<ButtonRadioModule>;
    buttonRadio(selector: string | HTMLElement, options?: ButtonRadioOptions): Promise<ButtonRadio>;
    tooltip(selector?: NodeListOf<Element> | Element | string, config?: Partial<Tooltip.Options>): Tooltip[];
    getMajorVersion(module: any): number;
    pushBootstrapToGlobal(): void;
}

export { uid }

declare interface UIThemeInterface {
    renderMessage(messages: string | string[], type?: string): void;
    clearMessages(): void;
}

export declare interface UnicornApp extends EventAwareInterface {
}

export declare class UnicornApp extends UnicornApp_base implements EventAwareInterface {
    registry: Map<any, any>;
    plugins: Map<any, any>;
    waits: Promise<any>[];
    options: Record<string, any>;
    defaultOptions: Record<string, any>;
    domready: typeof domready;
    data: typeof data;
    constructor(options?: {});
    use(plugin: UnicornPlugin, options?: Record<string, any>): this;
    detach(plugin: any): this;
    inject<T>(id: InjectionKey<T>): T;
    inject<T>(id: InjectionKey<T>, def: T): T;
    provide<T>(id: InjectionKey<T>, value: any): this;
    wait(callback: Function): Promise<any>;
    completed(): Promise<any[]>;
}

declare const UnicornApp_base: Class<any[], EventMixin, typeof EventMixin>;

export declare class UnicornAssetUri {
    static instance: UnicornAssetUri;
    static get(): UnicornAssetUri;
    path(path?: string): string;
    root(path?: string): string;
}

declare class UnicornFieldValidation {
    protected el: HTMLElement;
    $input: InputElements | undefined;
    options: FieldValidationOptions;
    static is: string;
    constructor(el: HTMLElement, options?: Partial<FieldValidationOptions>);
    mergeOptions(options: Partial<FieldValidationOptions>): FieldValidationOptions;
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
    getFormValidation(element?: Nullable<HTMLFormElement>): UnicornFormValidation | null;
    getValidator(name: string): [Validator, Record<string, any>] | null;
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

declare class UnicornFormElement {
    element: HTMLFormElement | undefined;
    options: Record<string, any>;
    constructor(selector?: string | Element, element?: HTMLFormElement, options?: Record<string, any>);
    initComponent(store?: string, custom?: {}): Promise<Alpine_2>;
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

declare class UnicornFormValidation {
    presetFields: HTMLElement[];
    static globalValidators: Record<string, Validator>;
    validators: Record<string, Validator>;
    options: FormValidationOptions;
    $form: HTMLElement;
    static is: string;
    constructor(el: HTMLElement, options?: Partial<FormValidationOptions>);
    mergeOptions(options: Partial<FormValidationOptions>): FormValidationOptions;
    get scrollEnabled(): boolean;
    get scrollOffset(): number;
    get fieldSelector(): string;
    get validatedClass(): string;
    init(): void;
    findDOMFields(): HTMLElement[];
    prepareFields(inputs: HTMLElement[]): Promise<void>;
    prepareFieldWrapper(input: HTMLElement): HTMLElement | null;
    findFields(containsPresets?: boolean): HTMLElement[];
    getFieldComponent(input: HTMLElement): UnicornFieldValidation | null;
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
    static addGlobalValidator(name: string, handler: ValidationHandler, options?: Record<string, any>): typeof UnicornFormValidation;
}

declare class UnicornGridElement {
    element: HTMLElement;
    form: UnicornFormElement;
    options: Record<string, any>;
    ordering: string;
    state: {};
    constructor(selector: string, element: HTMLElement, form: UnicornFormElement, options?: Record<string, any>);
    bindEvents(): void;
    initComponent(store?: string, custom?: Record<string, string>): Promise<Alpine_2>;
    useState(this: any, custom?: Record<string, any>): Partial<Record<string, any>> & Record<string, any>;
    getElement(): HTMLElement;
    sendFilter($event?: Event, method?: string): void;
    clearFilters(element: HTMLElement, method?: Nullable<string>): void;
    toggleFilters(open: boolean, filterForm: HTMLElement): Promise<void>;
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
     * Batch update items.
     */
    updateListByTask(task: string, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
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
    validateChecked(event?: Event, callback?: (grid: UnicornGridElement) => any, msg?: string): this;
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

declare class UnicornHttpClient {
    protected config?: CreateAxiosDefaults | undefined;
    static axiosStatic?: Promise<AxiosStatic>;
    axios?: AxiosInstance;
    constructor(config?: CreateAxiosDefaults | undefined);
    static importAxios(): Promise<any>;
    static getAxiosStatic(): Promise<AxiosStatic>;
    createHttp(): Promise<AxiosInstance>;
    getAxiosInstance(): Promise<AxiosInstance>;
    prepareAxios(axios: AxiosInstance): AxiosInstance;
    requestMiddleware(callback: Parameters<AxiosInstance['interceptors']['request']['use']>[0]): Promise<number>;
    responseMiddleware(callback: Parameters<AxiosInstance['interceptors']['response']['use']>[0]): Promise<number>;
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
    isCancel(cancel: any): cancel is CanceledError<any>;
    /**
     * Send request.
     */
    request<T = any, D = any>(options: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
    errorClass(): Promise<typeof AxiosError>;
}

declare class UnicornLang {
    /**
     * Translate a string.
     */
    trans(id: string, ...args: any[]): string;
    protected replace(str: string, args: any[]): string;
    /**
     * Find text.
     */
    get(id: string): string | null;
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
    protected normalize(text: string): string;
    protected wrapDebug(text: string, success: boolean): string;
    getStrings(): Record<string, string>;
}

export declare class UnicornPhpAdapter {
    static install(app: UnicornApp): void;
}

declare interface UnicornPlugin {
    install?(app: UnicornApp, options?: Record<string, any>): void;
    uninstall?(app: UnicornApp): void;
}

export declare class UnicornSystemUri extends URL {
    static instance: UnicornSystemUri;
    static get(): UnicornSystemUri;
    path(path?: string): string;
    root(path?: string): string;
    current(): string;
    full(): string;
    route(): string;
    script(): string;
    routeWithQuery(): string;
    routeAndQuery(): string[];
}

export declare class UnicornUI {
    theme?: any;
    aliveHandle?: any;
    static get defaultOptions(): {
        messageSelector: string;
    };
    installTheme(theme: any): void;
}

declare type UploadHandlerParams = Parameters<NonNullable<EditorOptions['images_upload_handler']>>;

declare type UriTypes = 'full' | 'path' | 'root' | 'current' | 'route' | 'script';

export declare function useAssetUri(): UnicornAssetUri;

export declare function useAssetUri(type?: AssetTypes, path?: string): string;

export declare function useBs5ButtonRadio(selector?: string | HTMLElement, options?: ButtonRadioOptions): Promise<ButtonRadioModule & ButtonRadio>;

export declare function useBs5KeepTab(selector?: string | HTMLElement, options?: KeepTabOptions): Promise<KeepTab>;

export declare function useBs5Tooltip(selector?: NodeListOf<Element> | Element | string, config?: Partial<Tooltip.Options>): Promise<Tooltip[]>;

export declare function useCheckboxesMultiSelect(): Promise<any>;

export declare function useCheckboxesMultiSelect(selector?: Nullable<string | HTMLElement>, options?: Record<string, any>): Promise<CheckboxesMultiSelect>;

/**
 * Color Picker.
 */
export declare function useColorPicker(selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>, options?: Partial<SpectrumOptions>): Promise<any>;

export declare function useCssImport(...hrefs: string[]): Promise<CSSStyleSheet[]>;

export declare function useCssIncludes(...hrefs: string[]): Promise<void[]>;

export declare function useDisableIfStackNotEmpty(buttonSelector?: string, stackName?: string): void;

export declare function useDisableOnSubmit(formSelector?: string | HTMLFormElement, buttonSelector?: string, options?: Record<string, any>): void;

export declare function useFieldCascadeSelect(): Promise<CascadeSelectModule>;

export declare function useFieldFileDrag(): Promise<FileDragModule>;

export declare function useFieldFlatpickr(): Promise<any>;

export declare function useFieldModalSelect(): Promise<ModalSelectModule>;

export declare function useFieldModalTree(): void;

declare function useFieldMultiUploader(): Promise<void>;

export declare function useFieldRepeatable(): Promise<RepeatableModule>;

export declare function useFieldSingleImageDrag(): Promise<SingleImageDragModule>;

export declare function useFieldValidationSync(selector: string | Element): UnicornFieldValidation;

export declare function useForm(ele?: string | Element, options?: Record<string, any>): Promise<UnicornFormElement>;

export declare function useFormComponent(ele?: string | Element, options?: Record<string, any>): Promise<UnicornFormElement>;

export declare function useFormValidation(): Promise<ValidationModule>;

export declare function useFormValidation(selector: string | Element): Promise<UnicornFormValidation>;

export declare function useFormValidationSync(selector: string | Element): UnicornFormValidation;

export declare function useGrid(ele: string | HTMLElement, options?: Record<string, any> | undefined): Promise<UnicornGridElement>;

export declare function useGridComponent(ele: string | HTMLElement, options?: Record<string, any> | undefined): Promise<UnicornGridElement>;

export declare function useHttpClient(config?: CreateAxiosDefaults | AxiosInstance): Promise<UnicornHttpClient>;

export declare function useIframeModal(): Promise<IframeModalModule>;

export declare function useImport(...src: any[]): Promise<any>;

export declare function useImport<T extends any[]>(...src: string[]): Promise<T>;

export declare function useImport<T = any>(src: string): Promise<{
    default: T;
}>;

export declare function useImport<D = any, C = any>(src: string): Promise<{
    default: D;
} & Dictionary<C>>;

export declare function useInject<T>(id: InjectionKey<T>): T;

export declare function useInject<T>(id: InjectionKey<T>, def: T): T;

/**
 * Keep alive.
 */
export declare function useKeepAlive(url: string, time?: number): () => void;

export declare function useLang(): UnicornLang;

export declare function useListDependent(): Promise<ListDependentModule>;

export declare function useListDependent(element: string | HTMLElement, dependent?: Nullable<string | HTMLElement>, options?: Partial<ListDependentOptions>): Promise<ListDependent>;

export declare function useLoadedHttpClient(config?: CreateAxiosDefaults): Promise<UnicornHttpClient>;

export declare function useQueue(name?: string, maxRunning?: number): TaskQueue;

export declare function useS3Uploader(): Promise<S3UploaderModule>;

export declare function useS3Uploader(name: string, options?: Partial<S3UploaderGlobalOptions>): Promise<S3Uploader>;

export declare function useScriptImport(src: string, attrs?: Record<string, string>): Promise<void>;

export declare function useSeriesImport(...src: any[]): Promise<any>;

export declare function useSeriesImport<T extends any[]>(...src: string[]): Promise<T>;

export declare function useSeriesImport<T = any>(src: string): Promise<{
    default: T;
}>;

export declare function useSeriesImport<D = any, C = any>(src: string): Promise<{
    default: D;
} & Dictionary<C>>;

export declare function useShowOn(): Promise<ShowOnModule>;

export declare function useStack<T = any>(name?: string, store?: any[]): Stack<T>;

export declare function useSystemUri(): UnicornSystemUri;

export declare function useSystemUri(type: UriTypes): string;

declare function useTinymce(): Promise<TinymceModule>;

declare function useTinymce(selector?: string, options?: Record<string, any>): Promise<TinymceController>;

/**
 * @see https://tom-select.js.org/
 */
export declare function useTomSelect(selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>, options?: Record<string, any>, theme?: string): Promise<any>;

export declare function useUI(instance?: UnicornUI): UnicornUI;

export declare function useUIBootstrap5(install?: boolean, pushToGlobal?: boolean): Promise<UIBootstrap5>;

export declare function useUITheme<T extends UIThemeInterface>(theme?: T | Constructor<T>): T;

export declare function useUnicorn(instance?: UnicornApp): UnicornApp;

export declare function useUnicornPhpAdapter(app?: UnicornApp): {
    repeatable: typeof useFieldRepeatable;
    flatpickr: typeof useFieldFlatpickr;
    fileDrag: typeof useFieldFileDrag;
    modalField: typeof useFieldModalSelect;
    cascadeSelect: typeof useFieldCascadeSelect;
    sid: typeof useFieldSingleImageDrag;
    tinymce: {
        init: typeof useTinymce;
    };
    iframeModal: typeof useIframeModal;
    initShowOn: typeof useShowOn;
    modalTree: typeof useFieldModalTree;
    multiUploader: typeof useFieldMultiUploader;
};

export declare function useUniDirective(name: string, handler: WebDirectiveHandler, wdInstance?: default_3 | string): Promise<void>;

/**
 * Vue component field.
 */
export declare function useVueComponentField(selector?: Nullable<string | HTMLElement>, value?: any, options?: Record<string, any>): Promise<any>;

export declare function useWebDirective(name?: string, options?: Partial<WebDirectiveOptions>): Promise<default_3>;

declare type ValidationHandler = (value: any, input: HTMLElement, options?: Record<string, any>, fv?: UnicornFieldValidation) => any;

declare interface ValidationModule {
    UnicornFormValidation: typeof UnicornFormValidation;
    UnicornFieldValidation: typeof UnicornFieldValidation;
    ready: Promise<any>;
    validators: typeof validatorHandlers;
}

declare type Validator = {
    handler: ValidationHandler;
    options?: Record<string, any>;
};

declare const validatorHandlers: Record<string, ValidationHandler>;

export declare function wait<T extends readonly unknown[]>(...promisee: {
    [K in keyof T]: PromiseLike<T[K]> | T[K];
}): Promise<Awaited<T>>;

export { }


declare global {
    var Alpine: AlpineGlobal;
    var TomSelect: typeof TomSelectGlobal;
    var Spectrum: typeof SpectrumGlobal;
    var Mark: any;
}


declare global {
    interface Node {
        __unicorn?: any;
    }
}


declare module '@windwalker-io/unicorn-next' {
    interface UnicornApp {
        /** @deprecated Only for code generator use. */
        $ui: typeof methods;
    }
}


declare global {
    let axios: AxiosStatic;
}


declare module 'axios' {
    interface AxiosRequestConfig {
        vars?: Record<string, any>;
        methodSimulate?: string;
        methodSimulateByHeader?: boolean;
    }
    interface CreateAxiosDefaults {
    }
}

declare global {
    var S: any;
}


declare global {
    export interface Window {
        bootstrap: typeof bootstrap;
    }
}
