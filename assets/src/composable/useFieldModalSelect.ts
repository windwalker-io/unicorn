import type { ModalSelectModule } from '../module/field-modal-select';

export function useFieldModalSelect(): Promise<ModalSelectModule> {
  // Modal select has no exports now
  return import('../module/field-modal-select');
}
