
export type TreeNode<T = any> = {
  key: string | number;
  value: T;
  children: TreeNode<T>[];
  indeterminate?: boolean;
  selected?: boolean;
};
export type ModalTreeSource = TreeNode | TreeNode[] | string | (() => any);
export type ValueGetter = (item: any) => any;
export type TitleGetter = (item: any) => string;
export type SearchMatcher = (item: any, q: string) => boolean;
