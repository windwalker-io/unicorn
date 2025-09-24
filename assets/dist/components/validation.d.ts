import { Nullable } from '../types';
export declare type ValidationHandler = (value: any, input: HTMLElement, options?: Record<string, any>, fv?: UnicornFieldValidation) => any;
export declare type Validator = {
    handler: ValidationHandler;
    options?: Record<string, any>;
};
declare const validatorHandlers: Record<string, ValidationHandler>;
type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export interface FormValidationOptions {
    scroll: boolean;
    validatedClass: null;
    fieldSelector: null;
    scrollOffset: number;
    enabled: boolean;
}
export interface FieldValidationOptions {
    validClass: string;
    errorSelector: string;
    inputOptions: boolean;
    inputOptionsSelector: string;
    formSelector: string;
    selector: string;
    inputOptionsWrapperSelector: string;
    events: string[];
    invalidClass: string;
    errorMessageClass: string;
}
export declare class UnicornFormValidation {
    presetFields: HTMLElement[];
    static globalValidators: Record<string, Validator>;
    validators: Record<string, Validator>;
    options: FormValidationOptions;
    $form: HTMLElement;
    static is: string;
    constructor(el: HTMLElement, options?: Partial<FormValidationOptions>);
    mergeOptions(options: Partial<FormValidationOptions>): FormValidationOptions;
    get scrollEnabled(): boolean;
    get scrollOffset(): number;
    get fieldSelector(): string;
    get validatedClass(): string;
    init(): void;
    findDOMFields(): HTMLElement[];
    prepareFields(inputs: HTMLElement[]): Promise<void>;
    prepareFieldWrapper(input: HTMLElement): HTMLElement | null;
    findFields(containsPresets?: boolean): HTMLElement[];
    getFieldComponent(input: HTMLElement): UnicornFieldValidation | null;
    validateAll(fields?: Nullable<HTMLElement[]>): boolean;
    validateAllAsync(fields?: Nullable<HTMLElement[]>): Promise<boolean>;
    scrollTo(element: HTMLElement): void;
    markFormAsValidated(): void;
    markFormAsUnvalidated(): void;
    addField(field: HTMLElement): this;
    registerDefaultValidators(): void;
    /**
     * Add validator handler.
     */
    addValidator(name: string, handler: ValidationHandler, options?: Record<string, any>): this;
    /**
     * Add validator handler.
     */
    static addGlobalValidator(name: string, handler: ValidationHandler, options?: Record<string, any>): typeof UnicornFormValidation;
}
export declare class UnicornFieldValidation {
    protected el: HTMLElement;
    $input: InputElements | undefined;
    options: FieldValidationOptions;
    static is: string;
    constructor(el: HTMLElement, options?: Partial<FieldValidationOptions>);
    mergeOptions(options: Partial<FieldValidationOptions>): FieldValidationOptions;
    get $form(): HTMLFormElement;
    get errorSelector(): string;
    get selector(): string;
    get validClass(): string;
    get invalidClass(): string;
    get isVisible(): boolean;
    get isInputOptions(): boolean;
    get validationMessage(): string;
    get validity(): ValidityState | undefined;
    selectInput(): InputElements | undefined;
    init(): void;
    bindEvents(): void;
    prepareWrapper(): void;
    checkValidity(): boolean;
    runCustomValidity(): boolean;
    checkValidityAsync(): Promise<boolean>;
    runCustomValidityAsync(): Promise<boolean>;
    checkCustomDataAttributeValidity(): boolean;
    checkInputOptionsValidity(): boolean;
    /**
     * @param valid {boolean}
     */
    updateValidClass(valid: Boolean): void;
    getFormValidation(element?: Nullable<HTMLFormElement>): UnicornFormValidation | null;
    getValidator(name: string): [Validator, Record<string, any>] | null;
    handleCustomResult(result: boolean | string | undefined, validator?: Nullable<Validator>): boolean;
    handleAsyncCustomResult(result: boolean, validator?: Nullable<Validator>): boolean;
    raiseCustomErrorState(validator: Validator): void;
    setAsInvalidAndReport(error: string): void;
    setCustomValidity(error: string): void;
    reportValidity(): void;
    showInvalidResponse(): void;
    getErrorElement(): Element;
    createHelpElement(): HTMLElement;
    /**
     * @see https://stackoverflow.com/a/17888178
     */
    parseSelector(subselector: string): {
        tags: string[];
        classes: string[];
        ids: string[];
        attrs: string[][];
    };
    setAsValidAndClearResponse(): void;
    clearInvalidResponse(): void;
    getForm(): HTMLFormElement;
    findLabel(): any;
}
export { validatorHandlers as validators };
export declare const ready: Promise<[void, void]>;
