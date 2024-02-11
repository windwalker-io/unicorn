
export * from './events';
export * from './mixwith';

import './polyfill';
// import type { Unicorn } from '../index';

import UnicornApp from './app';
import UnicornAnimate from './plugin/animate';
import UnicornCrypto from './plugin/crypto';
import UnicornDirective from './plugin/directive';
import UnicornForm from './plugin/form';
import UnicornLang from './plugin/lang';
import UnicornValidation from './plugin/validation';
import UnicornRouter from './plugin/router';
import UnicornUI from './plugin/ui';
import UnicornGrid from './plugin/grid';
import UnicornTinymce from './plugin/tinymce';
import UnicornLoader from './plugin/loader';
import UnicornHelper from './plugin/helper';
import UnicornHttp from './plugin/http';
import UnicornUri from './plugin/uri';
import UnicornStack from './plugin/stack';
import UnicornQueue from './plugin/queue';
import UnicornAlpine2 from './plugin/alpine2';

export function createApp(options = {}) {
  return new UnicornApp(options);
}

export function noConflict() {
  const uni = window.u;

  delete window.u;

  return uni;
}

const u = createApp();

window.u = u;

u.use(UnicornLoader);
u.use(UnicornHelper);
u.use(UnicornUri);
u.use(UnicornCrypto);
u.use(UnicornLang);
u.use(UnicornRouter);
u.use(UnicornHttp);
u.use(UnicornDirective);
u.use(UnicornAnimate);
u.use(UnicornUI);
u.use(UnicornAlpine2);
u.use(UnicornForm);
u.use(UnicornGrid);
u.use(UnicornValidation);
u.use(UnicornTinymce);
u.use(UnicornStack);
u.use(UnicornQueue);

u.selectOne('[uni-cloak]')?.removeAttribute('uni-cloak');

declare global {
  interface Window {
    System: any;
    u?: UnicornApp;
  }
}
