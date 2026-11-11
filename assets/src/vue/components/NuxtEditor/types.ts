import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type {
  DropdownMenuItem,
  EditorCustomHandlers,
  EditorSuggestionMenuItem,
  EditorToolbarItem,
  Locale,
} from '@nuxt/ui';

export type { Editor, DropdownMenuItem, EditorCustomHandlers, EditorSuggestionMenuItem, EditorToolbarItem, Locale };

export type ToolbarItems = EditorToolbarItem[] | EditorToolbarItem[][];

export interface DragHandleNode {
  node: ProseMirrorNode | null;
  pos: number;
}

export interface BubbleShouldShowProps {
  editor: Editor;
  view: EditorView;
  state: EditorState;
}

export interface NuxtEditorItems {
  fixed: (editor: Editor) => ToolbarItems;
  text: (editor: Editor) => ToolbarItems;
  video: (editor: Editor) => ToolbarItems;
  image: (editor: Editor) => ToolbarItems;
  slash: (editor: Editor) => EditorSuggestionMenuItem[] | EditorSuggestionMenuItem[][];
  tableMenu: (editor: Editor, scope?: 'cell' | 'row' | 'column') => DropdownMenuItem[][];
  blockMenu: (editor: Editor) => DropdownMenuItem[] | DropdownMenuItem[][];
}
