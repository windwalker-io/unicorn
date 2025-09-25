import { UnicornApp } from '../app';
import { useFieldCascadeSelect, useFieldFileDrag, useFieldFlatpickr, useFieldModalSelect, useFieldRepeatable, useFieldSingleImageDrag } from '../composable';
declare module '../app' {
    interface UnicornApp {
        $fields: typeof UnicornFormFields;
    }
}
export declare function useUnicornFormFields(app?: UnicornApp): typeof UnicornFormFields;
export declare class UnicornFormFields {
    repeatable: typeof useFieldRepeatable;
    flatpicker: typeof useFieldFlatpickr;
    fileDrag: typeof useFieldFileDrag;
    modalSelect: typeof useFieldModalSelect;
    cascadeSelect: typeof useFieldCascadeSelect;
    sid: typeof useFieldSingleImageDrag;
    static install(app: UnicornApp): void;
}
