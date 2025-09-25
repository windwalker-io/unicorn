import type { UnicornApp } from '../app';
import {
  useFieldCascadeSelect,
  useFieldFileDrag,
  useFieldFlatpickr,
  useFieldModalSelect,
  useFieldRepeatable,
  useFieldSingleImageDrag
} from '../composable';
import { useUnicorn } from '../unicorn';

declare module '../app' {
  interface UnicornApp {
    $fields: typeof UnicornFormFields;
  }
}

export function useUnicornFormFields(app?: UnicornApp) {
  app ??= useUnicorn();

  app.use(UnicornFormFields);

  return app.$fields;
}

export class UnicornFormFields {
  repeatable = useFieldRepeatable;
  flatpicker = useFieldFlatpickr;
  fileDrag = useFieldFileDrag;
  modalSelect = useFieldModalSelect;
  cascadeSelect = useFieldCascadeSelect;
  sid = useFieldSingleImageDrag;

  static install(app: UnicornApp) {
    app.$fields = this;
    app.provide(UnicornFormFields, this);
  }
}
