/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export * from './events.js';
export * from './mixwith.js';

import './polyfill.js';

import UnicornAnimate from './plugin/animate.js';
import UnicornCrypto from './plugin/crypto.js';
import UnicornDirective from './plugin/directive.js';
import UnicornLang from './plugin/lang.js';
import UnicornValidation from './plugin/validation.js';
import UnicornRouter from './plugin/router.js';
import UnicornUI from './plugin/ui.js';
import UnicornGrid from './plugin/grid.js';
import UnicornForm from './plugin/form.js';
import UnicornTinymce from './plugin/tinymce.js';
import UnicornLoader from './plugin/loader.js';
import UnicornHelper from './plugin/helper.js';
import UnicornHttp from './plugin/http.js';
import UnicornUri from './plugin/uri.js';
import UnicornStack from './plugin/stack.js';
import UnicornAlpine2 from './plugin/alpine2.js';
import UnicornApp from './app.js';

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

u.selectOne('[uni-cloak]')?.removeAttribute('uni-cloak');
