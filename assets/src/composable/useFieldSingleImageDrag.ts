import { SingleImageDragModule } from '../module/field-single-image-drag';

export function useFieldSingleImageDrag(): Promise<SingleImageDragModule> {
  return import('../module/field-single-image-drag');
}
