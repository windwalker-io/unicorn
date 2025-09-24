import type { UnicornApp } from '@/app';
import {
  useFieldCascadeSelect,
  useFieldFileDrag,
  useFieldFlatpickr,
  useFieldModalSelect,
  useFieldRepeatable,
  useFieldSingleImageDrag
} from '@/composable';
import { UnicornPlugin } from '@/types';
import { useUnicorn } from '@/unicorn';

declare module '@/app' {
  interface UnicornApp {
    $fields: typeof UnicornFormFields;
  }
}

export function useUnicornFormFields(app?: UnicornApp) {
  app ??= useUnicorn();

  app.use(UnicornFormFields);

  return app.$fields;
}

export class UnicornFormFields implements UnicornPlugin {
  repeatable = useFieldRepeatable;
  flatpicker = useFieldFlatpickr;
  fileDrag = useFieldFileDrag;
  modalSelect = useFieldModalSelect;
  cascadeSelect = useFieldCascadeSelect;
  sid = useFieldSingleImageDrag;

  install(app, options?: any) {
    app.$fields = this;
    app.inject(UnicornFormFields, this);
  }
}
