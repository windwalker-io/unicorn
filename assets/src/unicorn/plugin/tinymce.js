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
      return this.instances[selector] = new TinymceEditor(selector, options, this.app);
    });
  }

  get(selector) {
    return this.instances[selector];
  }
}

export class TinymceEditor {
  static defaultOptions = {

  };

  constructor(selector, options, app) {
    this.app = app;
    options.selector = selector;

    this.selector = selector;
    this.element = app.selectOne(selector);
    this.options = defaultsDeep({}, this.prepareOptions(options));

    tinymce.init(this.options).then((editor) => {
      this.editor = editor[0];
    });
  }

  getEditor() {
    return this.editor;
  }

  prepareOptions(options) {
    const defaults = {};

    if (options.images_upload_url) {
      defaults.paste_data_images = true;
      defaults.remove_script_host = false;
      defaults.relative_urls = false;

      defaults.images_upload_handler = (...args) => this.imageUploadHandler(...args);
    }

    defaults.setup = (editor) => {
      editor.on('change', () => {
        tinymce.triggerSave();
      });
    };

    return defaultsDeep({}, options, defaults);
  }

  insert(text) {
    return this.editor.insertContent(text);
  }

  getValue() {
    return this.editor.getContent();
  }

  setValue(text) {
    return this.editor.setContent(text);
  }

  imageUploadHandler(blobInfo, success, failure) {
    const element = this.element;

    element.dispatchEvent(new CustomEvent('upload-start'));

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', this.options.images_upload_url);
    xhr.addEventListener('load', () => {
      element.dispatchEvent(new CustomEvent('upload-complete'));

      if (xhr.status !== 200 && xhr.status !== 204) {
        failure('HTTP Error: ' + decodeURIComponent(xhr.statusText));
        element.dispatchEvent(new CustomEvent('upload-error'));
        return;
      }

      const json = JSON.parse(xhr.responseText);

      if (!json || typeof json.data.url !== 'string') {
        failure('Invalid JSON: ' + xhr.responseText);
        console.error('Invalid JSON: ' + xhr.responseText);
        element.dispatchEvent(new CustomEvent('upload-error'));
        return;
      }

      success(json.data.url);

      element.dispatchEvent(new CustomEvent('upload-success'));
    });

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  }
}
