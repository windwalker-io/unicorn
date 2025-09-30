import { FileDragModule } from '../module/field-file-drag';

export async function useFieldFileDrag(): Promise<FileDragModule> {
  const module = await import('../module/field-file-drag');

  await module.ready;

  return module;
}
