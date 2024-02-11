import { UnicornFormValidation as UnicornFormValidationGlobal, UnicornFieldValidation as UnicornFieldValidationGlobal } from '@/modules/ui/validation-components';
import AlpineGlobal from 'alpinejs';
import { default as SpectrumGlobal } from 'spectrum-vanilla';
import Tinymce, { EditorManager } from 'tinymce';
import { default as TomSelectGlobal } from 'tom-select';
import UnicornApp from '../app';


declare module 'md5-es' {
  export default class MD5 {
    static hash: (str: string) => string;
  }
}

declare global {
  var u: UnicornApp;
  var Alpine = AlpineGlobal;
  var tinymce = Tinymce;
  var TomSelect = TomSelectGlobal;
  var Spectrum = SpectrumGlobal;

  // Validation
  var UnicornFormValidation = UnicornFormValidationGlobal;
  var UnicornFieldValidation = UnicornFieldValidationGlobal;

  interface Window {
    u?: UnicornApp;
  }
}
