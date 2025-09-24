import { TinymceController } from '../components/tinymce';
import { MaybePromise } from '../types';
import { TinyMCE } from 'tinymce';
export declare function useTinymce(): Promise<typeof import('@/components/tinymce')>;
export declare function useTinymce(selector?: string, options?: Record<string, any>): Promise<TinymceController>;
export declare function useTinymceHook(handler: ((tinymce: TinyMCE) => MaybePromise<any>)): Promise<void>;
