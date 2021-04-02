/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export * from './events.js';
export * from './mixwith.js';
export * from './plugin.js';

import UnicornCore from './core.js';

export function createApp(options = {}) {
  return new UnicornCore(options);
}
