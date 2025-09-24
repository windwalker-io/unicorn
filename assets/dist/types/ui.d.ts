export interface UIThemeInterface {
    renderMessage(messages: string | string[], type?: string): void;
    clearMessages(): void;
}
