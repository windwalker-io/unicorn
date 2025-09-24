import type { UnicornGridElement } from '@/components/grid';
import { useForm } from '@/composable/useForm';
import { selectOne, module } from '@/modules';

export async function useGrid(
  ele: string | HTMLElement,
  options: Record<string, any> | undefined = {}
): Promise<UnicornGridElement> {
  const { UnicornGridElement } = await import('@/components/grid');

  const selector = typeof ele === 'string' ? ele : '';
  const element = selectOne(ele);

  if (!element) {
    throw new Error('Element is empty');
  }

  const form = await useForm(selector || element);

  return module(
    element,
    'grid.plugin',
    () => new UnicornGridElement(selector, element, form, options)
  );
}
