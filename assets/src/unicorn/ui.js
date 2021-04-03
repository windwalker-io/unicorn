/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { Plugin } from './plugin.js';

export default class UnicornUI extends Plugin {
  theme;

  static get is() { return 'ui'; }

  static get defaultOptions() {
    return {
      messageSelector: '.message-wrap',
    };
  }

  static get proxies() {
    return {
      addMessage: 'renderMessage',
      ui: 'ui'
    };
  }

  get ui() {
    return this;
  }

  installTheme(theme) {
    this.theme = theme;
  }

  constructor() {
    super();

    this.aliveHandle = null;
  }

  ready() {
    super.ready();
  }

  renderMessage(messages, type = 'info') {
    //
  }
}
