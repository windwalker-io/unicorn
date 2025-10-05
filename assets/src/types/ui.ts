export interface UIThemeInterface {
  renderMessage(messages: string | string[], type?: string): () => any;

  clearMessages(): void;
}

