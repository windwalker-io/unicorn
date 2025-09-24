export declare function useLang(): UnicornLang;
export declare function trans(id: string, ...args: any[]): string;
export declare function __(id: string, ...args: any[]): string;
export default class UnicornLang {
    /**
     * Translate a string.
     */
    trans(id: string, ...args: any[]): string;
    protected replace(str: string, args: any[]): string;
    /**
     * Find text.
     */
    get(id: string): string | null;
    /**
     * Has language key.
     */
    has(key: string): boolean;
    /**
     * Add language key.
     */
    add(key: string, value: string): this;
    /**
     * Replace all symbols to dot(.).
     */
    protected normalize(text: string): string;
    protected wrapDebug(text: string, success: boolean): string;
    getStrings(): Record<string, string>;
}
