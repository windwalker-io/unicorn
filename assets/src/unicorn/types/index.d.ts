import AlpineGlobal from 'alpinejs';
import { default as SpectrumGlobal } from 'spectrum-vanilla';
import Tinymce, { EditorManager } from 'tinymce';
import { default as TomSelectGlobal } from 'tom-select';

declare module 'md5-es' {
  export default class MD5 {
    static hash: (str: string) => string;
  }
}

declare global {
  var Alpine = AlpineGlobal;
  var tinymce = Tinymce;
  var TomSelect = TomSelectGlobal;
  var Spectrum = SpectrumGlobal;
  // var axios: AxiosStatic;

  declare type Nullable<T> = T | null | undefined;
}
