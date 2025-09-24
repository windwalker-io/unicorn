import { default as WebDirective } from 'web-directive';
import { WebDirectiveHandler, WebDirectiveOptions } from 'web-directive/src/types';
export declare function useWebDirective(name?: string, options?: Partial<WebDirectiveOptions>): Promise<WebDirective>;
export declare function useUniDirective(name: string, handler: WebDirectiveHandler, wdInstance?: WebDirective | string): Promise<void>;
