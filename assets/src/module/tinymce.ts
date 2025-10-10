import type { Editor, EditorOptions, TinyMCE } from 'tinymce';
import { useHttpClient, useStack } from '../composable';
import { useImport, useScriptImport } from '../service';
import { Dictionary, MaybePromise } from '../types';
import { mergeDeep } from '../utilities';

const instances: Dictionary<TinymceController> = {};
let hooks: ((tinymce: TinyMCE) => MaybePromise<any>)[] = [];
let imported: Promise<TinyMCE>;

declare type UploadHandlerParams = Parameters<NonNullable<EditorOptions['images_upload_handler']>>;

export async function get(
  selector: string,
  options: Record<string, any> = {}
): Promise<TinymceController> {
  return instances[selector] ??= await create(document.querySelector<HTMLElement>(selector)!, options);
}

export async function create(
  selector: string | HTMLElement,
  options: Record<string, any> = {}
): Promise<TinymceController> {
  const tinymce = await loadTinymce();
  let el: HTMLElement;

  if (typeof selector === 'string') {
    el = document.querySelector<HTMLElement>(selector)!;
  } else {
    el = selector;
  }

  return new TinymceController(tinymce, el, options);
}

export function destroy(selector: string): void {
  delete instances[selector];
}

export function addHook(handler: ((tinymce: TinyMCE) => MaybePromise<any>)) {
  hooks.push(handler);
}

export function clearHooks() {
  hooks = [];
}

async function loadTinymce(): Promise<TinyMCE> {
  return imported ??= new Promise((resolve) => {
    useScriptImport('@tinymce').then(() => {
      for (const hook of hooks) {
        hook(tinymce);
      }
      registerDragPlugin(tinymce).then(() => {
        resolve(tinymce);
      });
    });
  });
}

const defaultOptions: Record<string, any> = {};

export class TinymceController {
  editor?: Editor;
  options: Record<string, any> = {};

  constructor(protected tinymce: TinyMCE, public element: HTMLElement, options: Record<string, any>) {
    this.options = mergeDeep(
      {
        unicorn: {
          stack_name: 'uploading'
        }
      },
      defaultOptions,
      this.prepareOptions(options, tinymce.majorVersion),
    );

    this.options.target = element;

    tinymce.init(this.options).then((editor) => {
      this.editor = editor[0];
    });
  }

  prepareOptions(options: Record<string, any>, version = '6') {
    const defaults: Partial<EditorOptions> = {};

    if (options.images_upload_url) {
      defaults.paste_data_images = true;
      defaults.remove_script_host = false;
      defaults.relative_urls = false;

      if (Number(version) >= 6) {
        defaults.images_upload_handler = (blobInfo, progress) =>
          this.imageUploadHandler(blobInfo, progress);
      } else {
        options.plugins.push('paste');

        // @ts-ignore
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
        this.tinymce.triggerSave();
      });
    };

    options = mergeDeep({}, defaults, options);

    if (options.plugins.indexOf('unicorndragdrop') === -1) {
      options.plugins.push('unicorndragdrop');
    }

    return options;
  }

  insert(text: string) {
    this.editor?.insertContent(text);
  }

  getValue(): string {
    return this.editor?.getContent() ?? '';
  }

  setValue(text: string): void {
    this.editor?.setContent(text);
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

  async imageUploadHandler(blobInfo: UploadHandlerParams[0], progress: UploadHandlerParams[1]) {
    const element = this.element;

    element.dispatchEvent(new CustomEvent('upload-start'));

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    const stack = useStack(this.options.unicorn.stack_name);
    stack.push(true);

    const { post, isAxiosError } = await useHttpClient();

    try {
      let res = await post(
        this.options.images_upload_url,
        formData,
        {
          withCredentials: false,
          onUploadProgress: (e) => {
            progress(e.loaded / e.total! * 100);
          }
        }
      );
      element.dispatchEvent(new CustomEvent('upload-success'));

      return res.data.data.url;
    } catch (err) {
      if (isAxiosError(err)) {
        const message = err?.response?.data?.message || err.message;
        console.error(err?.response?.data?.message || err.message, err);
        element.dispatchEvent(new CustomEvent('upload-error', { detail: err }));

        return Promise.reject({ message, remove: true });
      }

      throw err;
    } finally {
      element.dispatchEvent(new CustomEvent('upload-complete'));
      stack.pop();
    }
  }
}

function registerDragPlugin(tinymce: TinyMCE) {
  tinymce.PluginManager.add('unicorndragdrop', function (editor) {
    // Reset the drop area border
    tinymce.DOM.bind(document, 'dragleave', function (e) {
      e.stopPropagation();
      e.preventDefault();

      if (tinymce.activeEditor) {
        tinymce.activeEditor.contentAreaContainer.style.transition = 'all .3s';
        tinymce.activeEditor.contentAreaContainer.style.borderWidth = '';
      }

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

        if (tinymce.activeEditor) {
          tinymce.activeEditor.contentAreaContainer.style.transition = 'all .3s';
          tinymce.activeEditor.contentAreaContainer.style.border = '3px dashed rgba(0, 0, 0, .35)';
        }

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

export interface TinymceModule {
  get: typeof get;
  create: typeof create;
  destroy: typeof destroy;
  addHook: typeof addHook;
  clearHooks: typeof clearHooks;
  TinymceController: typeof TinymceController;
}

declare global {
  var tinymce: TinyMCE;
}
