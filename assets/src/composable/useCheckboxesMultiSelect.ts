import type { CheckboxesMultiSelect } from '../module/checkboxes-multi-select';
import type { Nullable } from '../types';

export async function useCheckboxesMultiSelect(): Promise<any>;

export async function useCheckboxesMultiSelect(
  selector?: Nullable<string | HTMLElement>,
  options?: Record<string, any>
): Promise<CheckboxesMultiSelect>;

export async function useCheckboxesMultiSelect(
  selector?: Nullable<string | HTMLElement>,
  options: Record<string, any> = {}
): Promise<any> {
  const m = await import('../module/checkboxes-multi-select');

  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }

  return m;
}
