import { Dictionary } from '../types';
export declare function doImport<T = any>(src: string): T;
export declare function useImport(...src: any[]): Promise<any>;
export declare function useImport<T extends any[]>(...src: string[]): Promise<T>;
export declare function useImport<T = any>(src: string): Promise<{
    default: T;
}>;
export declare function useImport<D = any, C = any>(src: string): Promise<{
    default: D;
} & Dictionary<C>>;
export declare function useSeriesImport(...src: any[]): Promise<any>;
export declare function useSeriesImport<T extends any[]>(...src: string[]): Promise<T>;
export declare function useSeriesImport<T = any>(src: string): Promise<{
    default: T;
}>;
export declare function useSeriesImport<D = any, C = any>(src: string): Promise<{
    default: D;
} & Dictionary<C>>;
export declare function useCssImport(...src: string[]): Promise<CSSStyleSheet[]>;
