/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';

export default class UnicornTinymce {
  instances = {};

  static install(app) {
    app.$ui.tinymce = new this(app.$ui);
  }

  constructor(ui) {
    this.ui = ui;
    this.app = ui.app;
  }

  loadTinymce() {
    return this.app.import('@tinymce');
  }

  init(selector, options = {}) {
    return this.loadTinymce().then(() => {
      return this.instances[selector] = new TinymceEditor(selector, options);
    });
  }

  get(selector) {
    this.instances[selector];
  }
}

export class TinymceEditor {
  static defaultOptions = {

  };

  constructor(selector, options) {
    options.selector = selector;

    this.selector = selector;
    this.options  = defaultsDeep({}, options, this.constructor.defaultOptions);

    const editor = tinymce.init(options);

    this.editor = editor;
  }

  getEditor() {
    return this.editor;
  }

  propareOptions(options) {
    //
  }

  insert(text) {
    return this.editor.insertContent(text);
  }

  getValue() {
    return this.editor.getContent();
  }

  getValue(text) {
    return this.editor.setContent(text);
  }
}
