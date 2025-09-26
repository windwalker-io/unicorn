import type { UnicornFormElement } from '../module/form';
import { selectOne, module } from '../service';

export async function useForm(ele?: string | Element, options: Record<string, any> = {}): Promise<UnicornFormElement> {
  const { UnicornFormElement } = await import('../module/form');

  if (ele == null) {
    return new UnicornFormElement(undefined, undefined, options);
  }

  const selector = typeof ele === 'string' ? ele : undefined;
  const el = selectOne<HTMLFormElement>(ele as string);

  if (!el) {
    throw new Error(`Form element of: ${selector} not found.`);
  }

  return module(
    el,
    'unicorn.form',
    () => new UnicornFormElement(selector, el, options)
  );
}

