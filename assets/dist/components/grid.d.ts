import { UnicornFormElement } from '../components/form';
import { Nullable } from '../types';
export declare class UnicornGridElement {
    element: HTMLElement;
    form: UnicornFormElement;
    options: Record<string, any>;
    ordering: string;
    state: {};
    constructor(selector: string, element: HTMLElement, form: UnicornFormElement, options?: Record<string, any>);
    bindEvents(): void;
    initComponent(store?: string, custom?: Record<string, string>): Promise<any>;
    useState(this: any, custom?: Record<string, any>): Partial<Record<string, any>> & Record<string, any>;
    getElement(): HTMLElement;
    sendFilter($event?: Event, method?: string): void;
    clearFilters(element: HTMLElement, method?: Nullable<string>): void;
    toggleFilters(open: boolean, filterForm: HTMLElement): Promise<void>;
    sort($el: HTMLElement): boolean;
    /**
     * Sort two items.
     */
    sortBy(ordering: Nullable<string>): boolean;
    isSortActive($el: HTMLElement): boolean;
    getDirection($el: HTMLElement): "ASC" | "DESC" | null;
    orderingEquals(a: Nullable<string>, b: Nullable<string>): boolean;
    /**
     * Check a row's checkbox.
     */
    checkRow(row: number, value?: boolean): void;
    getCheckboxByRow(row: number): Nullable<HTMLInputElement>;
    /**
     * Update a row.
     */
    updateRow(row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Update an item by id.
     */
    updateItem(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Update a item with batch task.
     */
    updateItemByTask(task: string, id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Update a row with batch task.
     */
    updateRowByTask(task: string, row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Batch update items.
     */
    updateListByTask(task: string, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Copy a row.
     */
    copyItem(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Copy a row.
     */
    copyRow(row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Delete checked items.
     */
    deleteList(message?: Nullable<string> | false, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Delete an item by row.
     */
    deleteRow(row: number, msg?: Nullable<string>, url?: Nullable<string>, data?: Nullable<Record<string, any>>): Promise<boolean>;
    /**
     * Delete an item.
     */
    deleteItem(id: string, msg?: Nullable<string>, url?: Nullable<string>, data?: Nullable<Record<string, any>>): Promise<boolean>;
    /**
     * Toggle all checkboxes.
     */
    toggleAll(value: boolean): this;
    disableAllCheckboxes(): void;
    /**
     * Count checked checkboxes.
     */
    countChecked(): number;
    /**
     * Get Checked boxes.
     */
    getChecked(): HTMLInputElement[];
    getCheckedValues(): string[];
    /**
     * Validate there has one or more checked boxes.
     */
    validateChecked(event?: Event, callback?: Function, msg?: string): this;
    hasChecked(): boolean;
    /**
     * Reorder all.
     */
    reorderAll(url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    /**
     * Reorder items.
     */
    moveItem(id: number | string, delta: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    moveUp(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    moveDown(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean;
    getId(suffix?: string): string;
}
