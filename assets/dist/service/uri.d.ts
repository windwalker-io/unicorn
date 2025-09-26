type UriTypes = 'full' | 'path' | 'root' | 'current' | 'route' | 'script';
type AssetTypes = 'root' | 'path';
export declare function useSystemUri(): UnicornSystemUri;
export declare function useSystemUri(type: UriTypes): string;
export declare function useAssetUri(): UnicornAssetUri;
export declare function useAssetUri(type?: AssetTypes, path?: string): string;
export declare function addUriBase(uri: string, type?: string): string;
export declare class UnicornSystemUri extends URL {
    static instance: UnicornSystemUri;
    static get(): UnicornSystemUri;
    path(path?: string): string;
    root(path?: string): string;
    current(): string;
    full(): string;
    route(): string;
    script(): string;
    routeWithQuery(): string;
    routeAndQuery(): string[];
}
export declare class UnicornAssetUri {
    static instance: UnicornAssetUri;
    static get(): UnicornAssetUri;
    path(path?: string): string;
    root(path?: string): string;
}
export {};
