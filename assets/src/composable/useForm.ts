import type { UnicornFormElement } from '../module/form';
import { selectOne, module } from '../service';

let formElement: typeof UnicornFormElement;

export async function useFormAsync(): Promise<UnicornFormElement>;
export async function useFormAsync(ele?: string | Element, options?: Record<string, any>): Promise<UnicornFormElement | null>;
export async function useFormAsync(ele?: string | Element, options: Record<string, any> = {}): Promise<UnicornFormElement | null> {
  const { UnicornFormElement } = await import('../module/form');

  formElement ??= UnicornFormElement;

  return useForm(ele, options);
}

export function useForm(): UnicornFormElement;
export function useForm(ele?: string | Element, options?: Record<string, any>): UnicornFormElement | null;
export function useForm(ele?: string | Element, options: Record<string, any> = {}): UnicornFormElement | null {
  if (ele == null) {
    return new formElement(undefined, undefined, options);
  }

  const selector = typeof ele === 'string' ? ele : undefined;
  const el = selectOne<HTMLFormElement>(ele as string);

  if (!el) {
    throw new Error(`Form element of: ${selector} not found.`);
  }

  return module(
    el,
    'unicorn.form',
    () => new formElement(selector, el, options)
  );
}

export async function useFormComponent(ele?: string | Element, options: Record<string, any> = {}) {
  const form = await useFormAsync(ele, options);

  await form?.initComponent();

  return form;
}
