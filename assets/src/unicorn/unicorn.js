/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export * from './events.js';
export * from './mixwith.js';

import UnicornAnimate from './animate.js';
import UnicornCrypto from './crypto.js';
import UnicornDirective from './directive.js';
import UnicornLang from './lang.js';
import UnicornValidation from './plugin/validation.js';
import UnicornRouter from './router.js';
import UnicornUI from './ui.js';
import UnicornGrid from './plugin/grid.js';
import UnicornForm from './plugin/form.js';
import UnicornTinymce from './plugin/tinymce.js';
import UnicornLoader from './loader.js';
import UnicornHelper from './helper.js';
import UnicornHttp from './http.js';
import UnicornApp from './app.js';
import UnicornUri from './uri.js';
export { default as helper } from './helper.js';

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
u.use(UnicornForm);
u.use(UnicornGrid);
u.use(UnicornValidation);
u.use(UnicornTinymce);
