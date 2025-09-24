import { sleep } from '@lyrasoft/ts-toolkit/generic';
export { sleep };
export declare function forceArray<T>(item: T | T[]): T[];
export declare function debounce<T extends Function = Function>(handler: T, wait?: number): T;
export declare function throttle<T extends Function = Function>(handler: T, wait?: number): T;
export declare function isDebug(): boolean;
export declare function nextTick(callback?: () => any): Promise<any>;
