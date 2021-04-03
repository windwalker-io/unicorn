/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export * from './events.js';
export * from './mixwith.js';
export * from './plugin.js';

import UnicornUI from './ui.js';
import UnicornGrid from './plugin/grid.js';
import UnicornForm from './plugin/form.js';
import UnicornLoader from './loader.js';
import UnicornHelper from './helper.js';
import UnicornHttp from './http.js';
import { installFor } from './plugin.js';
import UnicornCore from './core.js';
export { default as helper } from './helper.js';

export function createApp(options = {}) {
  return new UnicornCore(options);
}

export function install(plugin) {
  return installFor(plugin, this);
}

export function noConflict() {
  const uni = window.uni;

  delete window.uni;

  return uni;
}

const u = createApp();

u.use(UnicornLoader);
u.use(UnicornHelper);
u.use(UnicornHttp);
u.use(UnicornForm);
u.use(UnicornGrid);
u.use(UnicornUI);

window.u = u;
