export declare function isPlainObject(val: any): val is Record<string, any>;
export declare function mergeDeep<T = Record<string, any>>(target: Partial<T>, ...sources: any[]): T;
