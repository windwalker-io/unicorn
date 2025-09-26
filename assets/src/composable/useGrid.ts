import type { UnicornGridElement } from '../module/grid';
import { useForm } from './useForm';
import { selectOne, module } from '../service';

export async function useGrid(
  ele: string | HTMLElement,
  options: Record<string, any> | undefined = {}
): Promise<UnicornGridElement> {
  const { UnicornGridElement } = await import('../module/grid');

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

export async function useGridComponent(
  ele: string | HTMLElement,
  options: Record<string, any> | undefined = {}
): Promise<UnicornGridElement> {
  const grid = await useGrid(ele, options);

  await grid.initComponent();

  return grid;
}
