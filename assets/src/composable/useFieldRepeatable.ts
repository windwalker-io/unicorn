import { RepeatableModule } from '../module/field-repeatable';

export async function useFieldRepeatable(): Promise<RepeatableModule> {
  const module = await import('../module/field-repeatable');

  await module.ready;

  return module;
}
