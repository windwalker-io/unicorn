import AlpineGlobal from 'alpinejs';
import Tinymce, { EditorManager } from 'tinymce';

declare module 'md5-es' {
  export default class MD5 {
    static hash: (str: string) => string;
  }
}

declare global {
  var Alpine = AlpineGlobal;
  var tinymce = Tinymce;
  // var axios: AxiosStatic;

  declare type Nullable<T> = T | null | undefined;
}
