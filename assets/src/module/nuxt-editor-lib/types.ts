/**
 * How to customize a toolbar:
 * - `false`: hide it.
 * - array: replace the default items.
 * - function: receive the default items and return the new ones (add / remove / reorder).
 * Items are Nuxt UI `UEditorToolbar` items (`kind`, `onClick`, `slot`...), so functions are only
 * available from JS; PHP can only pass plain-data arrays or `false` (it is JSON).
 */
export type NuxtEditorToolbarOverride =
  | false
  | any[]
  | ((defaults: any[], ctx: { editor: any; options: NuxtEditorOptions }) => any[] | void);

export interface NuxtEditorToolbars {
  /** Fixed toolbar above the editor. */
  fixed?: NuxtEditorToolbarOverride;
  /** Floating toolbar on text selection. */
  textBubble?: NuxtEditorToolbarOverride;
  /** Floating toolbar of a selected image. */
  imageBubble?: NuxtEditorToolbarOverride;
  /** The "/" slash menu (grouped items). */
  slash?: NuxtEditorToolbarOverride;
  /** The drag handle's block menu. */
  blockMenu?: NuxtEditorToolbarOverride;
}

export interface NuxtEditorOptions {
  toolbars?: NuxtEditorToolbars;
  props?: Record<string, any>;
  format?: 'html' | 'markdown' | 'json';
  locale?: string;
  readonly?: boolean;
  imageUploadUrl?: string;
  captionSyncAttrs?: string[];
  captionFigure?: boolean;
  imageFetchUrl?: string;
  imageOwnHosts?: string[];
  unicorn?: { stack_name?: string };
  [key: string]: any;
}

export type UploadImage = (file: File) => Promise<string>;
