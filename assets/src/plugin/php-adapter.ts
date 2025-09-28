import type { UnicornApp } from '../app';
import {
  useFieldCascadeSelect,
  useFieldFileDrag,
  useFieldFlatpickr,
  useFieldModalSelect,
  useFieldRepeatable,
  useFieldSingleImageDrag,
  useIframeModal,
} from '../composable';
import { useFieldMultiUploader } from '../composable/useFieldMultiUploader';
import { useTinymce } from '../composable/useTinymce';
import { useUnicorn } from '../unicorn';
import { domready } from '../service';

declare module '../app' {
  export interface UnicornApp {
    /** @deprecated Only for code generator use. */
    $ui: typeof methods;
    /** @deprecated Only for code generator use. */
    domready: typeof domready;
  }
}

// @ts-ignore
declare module '@windwalker-io/unicorn-next' {
  export interface UnicornApp {
    /** @deprecated Only for code generator use. */
    $ui: typeof methods;
    /** @deprecated Only for code generator use. */
    domready: typeof domready;
  }
}

export function useUnicornPhpAdapter(app?: UnicornApp) {
  app ??= useUnicorn();

  app.use(UnicornPhpAdapter);

  return app.$ui;
}

const methods = {
  repeatable: useFieldRepeatable,
  flatpickr: useFieldFlatpickr,
  fileDrag: useFieldFileDrag,
  modalField: useFieldModalSelect,
  cascadeSelect: useFieldCascadeSelect,
  sid: useFieldSingleImageDrag,
  tinymce: useTinymce,
  iframeModal: useIframeModal,
  multiUploader: useFieldMultiUploader,
};

export class UnicornPhpAdapter {
  static install(app: UnicornApp) {
    if (app.$ui) {
      app.$ui = { ...app.$ui, ...methods };
    } else {
      app.$ui = methods;
    }

    app.domready = domready;
  }
}
