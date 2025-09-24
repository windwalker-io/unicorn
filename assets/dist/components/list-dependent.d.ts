export interface ListDependentOptions {
    ajax: {
        url: string | null | ((self: ListDependent) => string);
        value_field: string;
        data: Record<string, any> | ((data: Record<string, any>, self: ListDependent) => Record<string, any>);
    };
    source: Record<string, any> | null;
    text_field: string;
    value_field: string;
    first_option: Record<string, any> | null;
    default_value: any;
    initial_load: boolean;
    empty_mark: string;
    hooks: {
        before_request: (value: any, element: HTMLSelectElement, dependent: HTMLSelectElement) => any;
        after_request: (value: any, element: HTMLSelectElement, dependent: HTMLSelectElement) => any;
    };
}
type ListItems = Record<string, any>[];
type MaybeGroupedListItems = Record<string, ListItems> | ListItems;
export declare class ListDependent {
    element: HTMLSelectElement;
    dependent: HTMLSelectElement;
    options: ListDependentOptions;
    cancelToken: any;
    static handle(el: string | Element, dependent?: any, options?: Partial<ListDependentOptions>): ListDependent;
    constructor(element: any, dependent: any, options?: Partial<ListDependentOptions>);
    /**
     * Bind events.
     */
    bindEvents(): void;
    /**
     * Update the list elements.
     *
     * @param {*}    value
     * @param {bool} initial
     */
    changeList(value: string, initial?: boolean): void;
    /**
     * Update list by source.
     *
     * @param {string} value
     * @param {bool}   initial
     */
    sourceUpdate(value: string, initial?: boolean): void;
    /**
     * Do ajax.
     *
     * @param {string} value
     */
    ajaxUpdate(value: string): Promise<void>;
    updateListElements(items: MaybeGroupedListItems): void;
    appendOptionTo(item: any, parent: any): void;
    isSelected(value: string): boolean;
    /**
     * Before hook.
     */
    beforeHook(value: string, element: HTMLSelectElement, dependent: HTMLSelectElement): any;
    /**
     * After hook.
     */
    afterHook(value: string, element: HTMLSelectElement, dependent: HTMLSelectElement): any;
    mergeOptions(options: Partial<ListDependentOptions>): ListDependentOptions;
}
export declare const ready: Promise<void>;
export {};
