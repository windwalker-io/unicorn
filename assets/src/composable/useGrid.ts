import type { UnicornGridElement } from '../module/grid';
import { useForm, useFormInit } from './useForm';
import { selectOne, module } from '../service';

let gridElement: typeof UnicornGridElement;

export async function useGridInit(
  ele?: string | HTMLElement,
  options: Record<string, any> | undefined = {}
): Promise<UnicornGridElement | null> {
  await useFormInit();

  const { UnicornGridElement } = await import('../module/grid');

  gridElement ??= UnicornGridElement;

  if (!ele) {
    return null;
  }

  return useGrid(ele, options);
}

export function useGrid(
  ele: string | HTMLElement,
  options: Record<string, any> | undefined = {}
): UnicornGridElement | null {
  const selector = typeof ele === 'string' ? ele : '';
  const element = selectOne(ele);

  if (!element) {
    throw new Error('Element is empty');
  }

  const form = useForm(selector || element);

  if (!form) {
    throw new Error('UnicornGrid is depends on UnicornForm');
  }

  return module(
    element,
    'grid.plugin',
    () => new gridElement(selector, element, form, options)
  );
}

export async function useGridComponent(
  ele: string | HTMLElement,
  options: Record<string, any> | undefined = {}
): Promise<UnicornGridElement | null> {
  const grid = await useGridInit(ele, options);

  await grid?.initComponent();

  return grid;
}
