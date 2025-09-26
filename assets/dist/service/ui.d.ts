import { Constructor, Nullable, UIThemeInterface } from '../types';
import { AlertAdapter, deleteConfirm, simpleAlert, simpleConfirm } from '@lyrasoft/ts-toolkit/generic';
import { default as AlpineGlobal } from 'alpinejs';
import { default as SpectrumGlobal } from 'spectrum-vanilla';
import { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';
import { default as Tinymce } from 'tinymce';
import { default as TomSelectGlobal } from 'tom-select';
export { simpleAlert, simpleConfirm, deleteConfirm, AlertAdapter };
export declare function useUI(instance?: UnicornUI): UnicornUI;
export declare function useUITheme<T extends UIThemeInterface>(theme?: T | Constructor<T>): T;
export declare class UnicornUI {
    theme?: any;
    aliveHandle?: any;
    static get defaultOptions(): {
        messageSelector: string;
    };
    installTheme(theme: any): void;
}
export declare function loadAlpine(callback?: Nullable<() => void>): Promise<any>;
export declare function initAlpine(directive: string): Promise<void>;
/**
 * Before Alpine init
 */
export declare function prepareAlpine(callback: () => void): void;
/**
 * Render Messages.
 */
export declare function renderMessage(messages: string | string[], type?: string): void;
/**
 * Clear messages.
 */
export declare function clearMessages(): void;
/**
 * Show notify.
 */
export declare function notify(messages: string | string[], type?: string): void;
/**
 * Clear notifies.
 */
export declare function clearNotifies(): void;
export declare function mark(selector?: string | HTMLElement, keyword?: string, options?: Record<string, any>): Promise<any>;
/**
 * Multiple Uploader
 */
export declare function multiUploader(): Promise<any>;
export declare function modalTree(): Promise<any>;
export declare function slideUp(target: string | HTMLElement, duration?: number): Promise<Animation | void>;
export declare function slideDown(target: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;
/**
 * slideToggle
 */
export declare function slideToggle(target: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;
export declare function fadeOut(selector: string | HTMLElement, duration?: number): Promise<Animation | void>;
export declare function fadeIn(selector: string | HTMLElement, duration?: number, display?: string): Promise<Animation | void>;
export declare function highlight(selector: string | HTMLElement, color?: string, duration?: number): Promise<Animation | void>;
/**
 * Color Picker.
 */
export declare function colorPicker(selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>, options?: Partial<SpectrumOptions>): Promise<any>;
export declare function disableOnSubmit(formSelector?: string | HTMLFormElement, buttonSelector?: string, options?: Record<string, any>): void;
export declare function disableIfStackNotEmpty(buttonSelector?: string, stackName?: string): void;
/**
 * Keep alive.
 */
export declare function keepAlive(url: string, time?: number): () => void;
/**
 * Vue component field.
 */
export declare function vueComponentField(selector?: Nullable<string | HTMLElement>, value?: any, options?: Record<string, any>): Promise<any>;
declare global {
    var Alpine: typeof AlpineGlobal;
    var tinymce: typeof Tinymce;
    var TomSelect: typeof TomSelectGlobal;
    var Spectrum: typeof SpectrumGlobal;
    var Mark: any;
}
