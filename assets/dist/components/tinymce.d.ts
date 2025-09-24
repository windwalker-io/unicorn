import { MaybePromise } from '../types';
import { Editor, EditorOptions, TinyMCE } from 'tinymce';
declare type UploadHandlerParams = Parameters<NonNullable<EditorOptions['images_upload_handler']>>;
export declare function get(selector: string, options?: Record<string, any>): Promise<TinymceController>;
export declare function destroy(selector: string): void;
export declare function addHook(handler: ((tinymce: TinyMCE) => MaybePromise<any>)): void;
export declare function clearHooks(): void;
export declare class TinymceController {
    element: HTMLElement;
    editor?: Editor;
    options: Record<string, any>;
    constructor(element: HTMLElement, options: Record<string, any>);
    prepareOptions(options: Record<string, any>, version?: string): Record<string, any>;
    insert(text: string): void;
    getValue(): string;
    setValue(text: string): string;
    imageUploadHandler(blobInfo: UploadHandlerParams[0], progress: UploadHandlerParams[1]): Promise<any>;
}
export {};
