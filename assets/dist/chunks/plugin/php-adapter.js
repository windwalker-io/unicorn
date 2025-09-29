import { u as useFieldMultiUploader } from "../composable/useFieldMultiUploader.js";
import { u as useTinymce } from "../composable/useTinymce.js";
import { useUnicorn } from "../../unicorn.js";
import { u as useTomSelect } from "../composable/useTomSelect.js";
import { u as useFieldModalTree } from "../composable/useFieldModalTree.js";
import { u as useShowOn } from "../composable/useShowOn.js";
import { u as useIframeModal } from "../composable/useIframeModal.js";
import { u as useS3Uploader } from "../composable/useS3Uploader.js";
import { u as useFieldSingleImageDrag } from "../composable/useFieldSingleImageDrag.js";
import { u as useFieldCascadeSelect } from "../composable/useFieldCascadeSelect.js";
import { u as useFieldModalSelect } from "../composable/useFieldModalSelect.js";
import { u as useFieldFileDrag } from "../composable/useFieldFileDrag.js";
import { u as useFieldFlatpickr } from "../composable/useFieldFlatpickr.js";
import { u as useFieldRepeatable } from "../composable/useFieldRepeatable.js";
function useUnicornPhpAdapter(app) {
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
  tinymce: {
    init: useTinymce
  },
  s3Uploader: useS3Uploader,
  iframeModal: useIframeModal,
  initShowOn: useShowOn,
  modalTree: useFieldModalTree,
  multiUploader: useFieldMultiUploader,
  tomSelect: useTomSelect
};
class UnicornPhpAdapter {
  static install(app) {
    if (app.$ui) {
      app.$ui = { ...app.$ui, ...methods };
    } else {
      app.$ui = methods;
    }
  }
}
export {
  UnicornPhpAdapter as U,
  useUnicornPhpAdapter as u
};
