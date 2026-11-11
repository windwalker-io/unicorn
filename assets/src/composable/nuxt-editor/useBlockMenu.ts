import { shallowRef } from 'vue';
import type { DragHandleNode, Editor, NuxtEditorItems } from '../../vue/components/NuxtEditor/types';

type BlockMenuItems = ReturnType<NuxtEditorItems['blockMenu']>;

// The block the drag handle currently points at, and the block menu items built for it.
export function useBlockMenu(
  resolveItems: (key: 'blockMenu', defaults: any[], ed: Editor) => any[],
  defaultItems: (node: DragHandleNode) => any[],
  mapEditorItems: (ed: Editor, items: any[]) => BlockMenuItems,
) {
  const selectedNode = shallowRef<DragHandleNode | undefined>();

  const items = (ed: Editor): BlockMenuItems => selectedNode.value?.node?.type
    ? mapEditorItems(ed, resolveItems('blockMenu', defaultItems(selectedNode.value), ed))
    : [];

  return { selectedNode, items };
}
