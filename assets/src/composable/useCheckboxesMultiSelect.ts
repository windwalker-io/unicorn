import type { CheckboxesMultiSelect } from '@/components/checkboxes-multi-select';
import type { Nullable } from '@/types';

export async function useCheckboxesMultiSelect(): Promise<typeof import('@/components/checkboxes-multi-select')>;

export async function useCheckboxesMultiSelect(
  selector?: Nullable<string | HTMLElement>,
  options?: Record<string, any>
): Promise<CheckboxesMultiSelect>;

export async function useCheckboxesMultiSelect(
  selector?: Nullable<string | HTMLElement>,
  options: Record<string, any> = {}
): Promise<any> {
  const m = await import('@/components/checkboxes-multi-select');

  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }

  return m;
}
