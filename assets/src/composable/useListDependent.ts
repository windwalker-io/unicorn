import type { ListDependent, ListDependentModule, ListDependentOptions } from '../module/list-dependent';
import { Nullable } from '../types';

export async function useListDependent(): Promise<ListDependentModule>;
export async function useListDependent(
  element: string | HTMLElement,
  dependent?: Nullable<string | HTMLElement>,
  options?: Partial<ListDependentOptions>
): Promise<ListDependent>;
export async function useListDependent(
  element?: Nullable<string | HTMLElement>,
  dependent?: Nullable<string | HTMLElement>,
  options: Partial<ListDependentOptions> = {}
): Promise<any> {
  const module = await import('../module/list-dependent');

  await module.ready;

  if (element) {
    const { ListDependent } = module;

    return ListDependent.handle(element, dependent, options);
  }

  return module;
}
