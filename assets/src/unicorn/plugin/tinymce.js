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
    return this.app.import('@tinymce')
      .then((tinymce) => {
        return registerDragPlugin().then(() => tinymce);
      });
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

    // defaults.file_picker_callback = (...args) => this.filePickerCallback(...args);

    defaults.plugins = defaults.plugins || [];
    
    defaults.setup = (editor) => {
      editor.on('change', () => {
        tinymce.triggerSave();
      });
    };

    options = defaultsDeep({}, options, defaults);

    if (options.plugins.indexOf('unicorndragdrop') === -1) {
      options.plugins.push('unicorndragdrop');
    }

    return options;
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

  // filePickerCallback(callback, value, meta) {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.style.display = 'none';
  //
  //   if (meta.filetype === 'image') {
  //     input.setAttribute('accept', `image/\*`);
  //   }
  //
  //   document.body.appendChild(input);
  //
  //   input.onchange = function () {
  //     const file = this.files[0];
  //
  //     const reader = new FileReader();
  //     reader.onload = function () {
  //       const id = 'blobid' + (new Date()).getTime();
  //       const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
  //       const base64 = reader.result.split(',')[1];
  //       const blobInfo = blobCache.create(id, file, base64);
  //       blobCache.add(blobInfo);
  //
  //       /* call the callback and populate the Title field with the file name */
  //       callback(blobInfo.blobUri(), { title: file.name, text: file.name });
  //     };
  //     reader.readAsDataURL(file);
  //     input.remove();
  //   };
  //
  //   input.click();
  // }

  imageUploadHandler(blobInfo, success, failure, progress) {
    const element = this.element;

    element.dispatchEvent(new CustomEvent('upload-start'));

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', this.options.images_upload_url);

    xhr.upload.onprogress = function (e) {
      progress(e.loaded / e.total * 100);
    };

    xhr.addEventListener('load', () => {
      element.dispatchEvent(new CustomEvent('upload-complete'));

      const json = JSON.parse(xhr.responseText);

      if (xhr.status !== 200 && xhr.status !== 204) {
        failure('HTTP Error: ' + decodeURIComponent(json?.message || xhr.statusText), { remove: true });
        element.dispatchEvent(new CustomEvent('upload-error'));
        return;
      }

      if (!json || typeof json.data.url !== 'string') {
        failure('Invalid JSON: ' + xhr.responseText, { remove: true });
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

function registerDragPlugin() {
  tinymce.PluginManager.add('unicorndragdrop', function(editor) {
    // Reset the drop area border
    tinyMCE.DOM.bind(document, 'dragleave', function(e) {
      e.stopPropagation();
      e.preventDefault();
      tinyMCE.activeEditor.contentAreaContainer.style.transition = 'all .3s';
      tinyMCE.activeEditor.contentAreaContainer.style.borderWidth = '';

      return false;
    });

    if (typeof FormData !== 'undefined') {

      // Fix for Chrome
      editor.on('dragenter', e => {
        e.stopPropagation();
        return false;
      });

      // Notify user when file is over the drop area
      editor.on('dragover', e => {
        e.preventDefault();
        tinyMCE.activeEditor.contentAreaContainer.style.transition = 'all .3s';
        tinyMCE.activeEditor.contentAreaContainer.style.border = '3px dashed rgba(0, 0, 0, .35)';

        return false;
      });

      editor.on('drop', e => {
        editor.contentAreaContainer.style.borderWidth = '';
        editor.contentAreaContainer.style.borderWidth = '';
      });
    }
  });

  return Promise.resolve();
}
