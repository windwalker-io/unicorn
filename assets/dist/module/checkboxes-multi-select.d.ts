export declare class CheckboxesMultiSelect {
    defaultOptions: {
        duration: number;
        inputSelector: string;
    };
    $element: HTMLElement;
    options: any;
    boxes: HTMLInputElement[];
    last: HTMLInputElement | false;
    static handle(selector: any, options?: any): any[];
    constructor(selector: any, options?: {});
    select(box: HTMLInputElement, event: MouseEvent): void;
}
