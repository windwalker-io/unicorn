import { UnicornApp } from '../app';
import { useFieldCascadeSelect, useFieldFileDrag, useFieldFlatpickr, useFieldModalSelect, useFieldRepeatable, useFieldSingleImageDrag } from '../composable';
import { UnicornPlugin } from '../types';
declare module '../app' {
    interface UnicornApp {
        $fields: typeof UnicornFormFields;
    }
}
export declare function useUnicornFormFields(app?: UnicornApp): typeof UnicornFormFields;
export declare class UnicornFormFields implements UnicornPlugin {
    repeatable: typeof useFieldRepeatable;
    flatpicker: typeof useFieldFlatpickr;
    fileDrag: typeof useFieldFileDrag;
    modalSelect: typeof useFieldModalSelect;
    cascadeSelect: typeof useFieldCascadeSelect;
    sid: typeof useFieldSingleImageDrag;
    install(app: any, options?: any): void;
}
