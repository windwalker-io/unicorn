import { TreeNode } from '../types';

export function flattenChildren(children: TreeNode[]) {
  const flat: TreeNode[] = [];

  function loopChildren(children: TreeNode[]) {
    for (const child of children) {
      if (child.children.length === 0) {
        flat.push(child);
        continue;
      }

      loopChildren(child.children);
    }
  }

  loopChildren(children);
  return flat;
}

