/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';

export default class UnicornTinymce {
  /**
   * @type {{ [name: string]: TinymceEditor }}
   */
  instances = {};

  static install(app) {
    app.$ui.tinymce = new this(app.$ui);
  }

  constructor(ui) {
    this.ui = ui;
    this.app = ui.app;
  }

  /**
   * @returns {Editor}
   */
  loadTinymce() {
    return this.app.import('@tinymce')
      .then((tinymce) => {
        return registerDragPlugin().then(() => tinymce);
      });
  }

  /**
   * @param {string} selector
   * @param {object} options
   * @returns {TinymceEditor}
   */
  init(selector, options = {}) {
    return this.loadTinymce().then(() => {
      return this.instances[selector] = this.create(document.querySelector(selector), options, this.app);
    });
  }

  /**
   * @param {string} selector
   * @returns {TinymceEditor}
   */
  get(selector) {
    return this.instances[selector];
  }

  /**
   * @param {string|Element} ele
   * @returns {TinymceEditor}
   */
  create(ele, options = {}) {
    return new TinymceEditor(ele, options, this.app);
  }
}

export class TinymceEditor {
  static defaultOptions = {

  };

  /**
   * @type {Editor}
   */
  editor;

  /**
   *
   * @param {Element} element
   * @param {object} options
   * @param {Unicorn} app
   */
  constructor(element, options, app) {
    this.app = app;
    this.element = element;

    options.target = element;

    this.options = defaultsDeep(
      {},
      this.prepareOptions(options, tinymce.majorVersion),
      {
        unicorn: {
          stack_name: 'uploading'
        }
      }
    );

    tinymce.init(this.options).then((editor) => {
      this.editor = editor[0];
    });
  }

  /**
   * @returns {Editor}
   */
  getEditor() {
    return this.editor;
  }

  prepareOptions(options, verion = '6') {
    const defaults = {};

    if (options.images_upload_url) {
      defaults.paste_data_images = true;
      defaults.remove_script_host = false;
      defaults.relative_urls = false;

      if (Number(verion) >= 6) {
        defaults.images_upload_handler = (blobInfo, progress) =>
          this.imageUploadHandler(blobInfo, progress);
      } else {
        options.plugins.push('paste');

        defaults.images_upload_handler = (blobInfo, success, failure, progress) =>
          this.imageUploadHandler(blobInfo, progress)
            .then((url) => {
              success(url);
              return url;
            })
            .catch((e) => {
              failure(e.message, { remove: true });
              throw e;
            });
      }
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

  /**
   * @param {string} text
   */
  insert(text) {
    return this.editor.insertContent(text);
  }

  /**
   * @returns {string}
   */
  getValue() {
    return this.editor.getContent();
  }

  /**
   * @param {string} text
   * @returns {string}
   */
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

  /**
   * @param {object} blobInfo
   * @param {Function} progress
   * @returns {Promise<string>}
   */
  imageUploadHandler(blobInfo, progress) {
    const element = this.element;

    element.dispatchEvent(new CustomEvent('upload-start'));

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    const stack = u.stack(this.options.unicorn.stack_name);
    stack.push(true);

    return u.$http.post(
      this.options.images_upload_url,
      formData,
      {
        withCredentials: false,
        onUploadProgress: (e) => {
          progress(e.loaded / e.total * 100);
        }
      }
    )
      .then((res) => {
        element.dispatchEvent(new CustomEvent('upload-success'));

        return res.data.data.url;
      })
      .catch((e) => {
        const message = e?.response?.data?.message || e.message;
        console.error(e?.response?.data?.message || e.message, e);
        element.dispatchEvent(new CustomEvent('upload-error', { detail: e }));

        return Promise.reject({ message, remove: true });
      })
      .finally(() => {
        element.dispatchEvent(new CustomEvent('upload-complete'));
        stack.pop();
      });
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
