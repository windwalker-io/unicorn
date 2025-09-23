import { default as AlpineGlobal } from 'alpinejs';
import { default as SpectrumGlobal } from 'spectrum-vanilla';
import { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';
import { default as Tinymce } from 'tinymce';
import { default as TomSelectGlobal } from 'tom-select';
import { default as UnicornApp } from '../app';
import { Nullable } from '../types';
export declare function useUI(): UnicornUI;
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
    mark(selector?: string | HTMLElement, keyword?: string, options?: Record<string, any>): Promise<any>;
    /**
     * @see https://tom-select.js.org/
     */
    tomSelect(selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>, options?: Record<string, any>, theme?: string): Promise<any>;
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
declare global {
    var Alpine: typeof AlpineGlobal;
    var tinymce: typeof Tinymce;
    var TomSelect: typeof TomSelectGlobal;
    var Spectrum: typeof SpectrumGlobal;
    var Choices: any;
    var WebComponents: any;
    var Mark: any;
    var Spruce: any;
}
