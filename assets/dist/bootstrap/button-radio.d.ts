export declare class ButtonRadio {
    wrapper: HTMLElement;
    element: HTMLElement;
    radios: HTMLInputElement[];
    inputs: HTMLInputElement[];
    buttons: HTMLButtonElement[];
    colors: string[];
    options: any;
    static handle(el: any, options?: {}): any;
    constructor(selector: any, options?: {});
    prepareButton(radio: HTMLInputElement, exists?: boolean): HTMLButtonElement;
    syncState(): void;
    parseClasses(...className: string[]): string[];
}
