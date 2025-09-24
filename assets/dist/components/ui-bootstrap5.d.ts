import { ButtonRadio } from '../bootstrap/button-radio';
import { LoadTab } from '../bootstrap/keep-tab';
import { UIThemeInterface } from '../types';
export declare class UIBootstrap5 implements UIThemeInterface {
    static instance: UIBootstrap5 | null;
    static get(): UIBootstrap5;
    renderMessage(messages: string | string[], type?: string): void;
    clearMessages(): void;
    keepTab(): Promise<typeof import('@/bootstrap/keep-tab')>;
    keepTab(selector?: string | HTMLElement, config?: Record<string, any>): Promise<LoadTab>;
    buttonRadio(): Promise<typeof import('@/bootstrap/button-radio')>;
    buttonRadio(selector: string | HTMLElement, config?: Record<string, any>): Promise<ButtonRadio>;
    tooltip(selector?: NodeListOf<Element> | Element | string, config?: Record<string, any>): any;
    getMajorVersion(module: any): number;
}
