import { Nullable } from '../types';
export declare class UnicornFormElement {
    element: HTMLFormElement | undefined;
    options: Record<string, any>;
    constructor(selector?: string | Element, element?: HTMLFormElement, options?: Record<string, any>);
    initComponent(store?: string, custom?: {}): Promise<any>;
    useState(custom?: {}): Record<string, any>;
    getElement(): HTMLFormElement;
    submit(url?: Nullable<string>, data?: Nullable<Record<string, any>>, method?: Nullable<string>, customMethod?: Nullable<string>): boolean;
    injectInput(name: string, value: any): HTMLInputElement;
    /**
     * Make a GET request.
     */
    get(url?: Nullable<string>, data?: Nullable<Record<string, any>>, customMethod?: Nullable<string>): boolean;
    /**
     * Post form.
     */
    post(url?: Nullable<string>, data?: Nullable<Record<string, any>>, customMethod?: Nullable<string>): boolean;
    /**
     * Make a PUT request.
     */
    put(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Make a PATCH request.
     */
    patch(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Make a DELETE request.
     */
    delete(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * @see https://stackoverflow.com/a/53739792
     *
     * @param {Object} ob
     * @returns {Object}
     */
    static flattenObject(ob: Record<string, any>): Record<string, any>;
    static buildFieldName(field: string): string;
}
