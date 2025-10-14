import { SingleImageDragModule } from '../module/field-single-image-drag';

export async function useFieldSingleImageDrag(): Promise<SingleImageDragModule> {
  const module = await import('../module/field-single-image-drag');

  await module.ready;

  return module;
}
