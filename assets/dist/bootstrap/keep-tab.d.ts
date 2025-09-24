export declare class LoadTab {
    $element: HTMLElement;
    tabButtons: any;
    storageKey: string;
    options: any;
    /**
     * Class init.
     *
     * @param {HTMLElement|string} selector
     * @param {Object}      options
     *
     * @constructor
     */
    constructor(selector: any, options?: any);
    protected init(uid: string): Promise<void>;
    bindEvents(): void;
    getButtonHref(button: HTMLAnchorElement): string;
    findTabButtonByHref(href: string): HTMLAnchorElement;
    activateTab(href: string): void;
    hasTab(href: string): boolean;
    /**
     * Switch tab.
     *
     * @returns {boolean}
     */
    switchTab(): boolean;
    /**
     * Hash code.
     */
    hashCode(text: string): Promise<string>;
}
