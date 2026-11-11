import { shallowRef } from 'vue';

// The block the drag handle currently points at, and the block menu items built for it.
export function useBlockMenu(
  resolveItems: (key: any, defaults: any[], ed: any) => any[],
  defaultItems: (node: any) => any[],
  mapEditorItems: (ed: any, items: any[]) => any[],
) {
  const selectedNode = shallowRef<{ node: any, pos: number } | undefined>();

  const items = (ed: any) => selectedNode.value?.node?.type
    ? mapEditorItems(ed, resolveItems('blockMenu', defaultItems(selectedNode.value), ed))
    : [];

  return { selectedNode, items };
}
