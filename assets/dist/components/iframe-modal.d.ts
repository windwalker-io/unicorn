interface IFrameModalOptions {
    id?: string;
    size?: string;
    resize?: boolean;
    height?: string;
}
export declare class IFrameModal extends HTMLElement {
    static is: string;
    options: IFrameModalOptions;
    modalElement: HTMLDivElement;
    modal: any;
    iframe: HTMLIFrameElement;
    template(): string;
    get selector(): string;
    getBootstrapModal(): Promise<any>;
    connectedCallback(): void;
    bindEvents(): void;
    open(href: string, options?: IFrameModalOptions): Promise<void>;
    close(): Promise<void>;
    resize(iframe: HTMLIFrameElement): void;
    getModalId(): string;
}
export declare const ready: Promise<void>;
export {};
