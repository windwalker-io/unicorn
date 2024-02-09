import AlpineGlobal from 'alpinejs';

declare module 'md5-es' {
  export default class MD5 {
    static hash: (str: string) => string;
  }
}

declare global {
  var Alpine = AlpineGlobal;
  // var axios: AxiosStatic;

  declare type Nullable<T> = T | null | undefined;
}
