import type { UnicornFormElement } from '../components/form';
import { selectOne, module } from '../modules';

export async function useForm(ele?: string | Element, options: Record<string, any> = {}): Promise<UnicornFormElement> {
  const { UnicornFormElement } = await import('../components/form');

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

