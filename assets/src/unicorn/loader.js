/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornLoader {
  static install(unicorn) {
    unicorn.import = this.import;
  }

  static import(src) {
    const s = window.System;

    return s.import(src);
  }
}
