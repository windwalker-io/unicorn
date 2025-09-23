export declare function forceArray<T>(item: T | T[]): T[];
export declare function debounce<T extends Function = Function>(handler: T, wait?: number): T;
export declare function throttle<T extends Function = Function>(handler: T, wait?: number): T;
export declare function isDebug(): boolean;
export declare function confirm(message: string): Promise<boolean>;
export declare function alert(title: string, text?: string, type?: string): Promise<boolean>;
export declare function nextTick(callback?: () => any): Promise<any>;
export declare function numberFormat(number: string | number, decimals?: number, decPoint?: string, thousandsSep?: string): string;
/**
 * @see https://www.programiz.com/javascript/examples/generate-random-strings
 */
export declare function genRandomString(length: number): string;
