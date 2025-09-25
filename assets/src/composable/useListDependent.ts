import type { ListDependent, ListDependentModule, ListDependentOptions } from '../components/list-dependent';
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
  const module = await import('../components/list-dependent');

  await module.ready;

  if (element) {
    const { ListDependent } = module;

    return ListDependent.handle(element, dependent, options);
  }

  return module;
}
