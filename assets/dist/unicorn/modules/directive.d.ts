import { default as WebDirective } from 'web-directive';
import { WebDirectiveHandler, WebDirectiveOptions } from 'web-directive/src/types';
export declare function useWebDirective(name?: string, options?: Partial<WebDirectiveOptions>): WebDirective;
export declare function useUniDirective(name: string, handler: WebDirectiveHandler, wdInstance?: WebDirective | string): void;
