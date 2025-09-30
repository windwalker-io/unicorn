import { CascadeSelectModule } from '../module/field-cascade-select';

export async function useFieldCascadeSelect(): Promise<CascadeSelectModule> {
  const module = await import('../module/field-cascade-select');

  await module.ready;

  return module;
}
