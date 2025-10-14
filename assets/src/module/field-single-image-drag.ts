
import { useHttpClient } from '../composable';
import { __, injectCssToDocument, selectAll, simpleAlert } from '../service';
import { mergeDeep } from '../utilities';
import css from '../../scss/field/single-image-drag.scss?inline';
import { Modal } from 'bootstrap';
import type Cropper from 'cropperjs';
import { ApiReturn } from './http-client';

export interface SingleImageDragOptions {
  accept: string | string[];
  ajax_url?: string;
  crop: boolean;
  width: number;
  height: number;
  max_width?: number;
  min_width?: number;
  max_height?: number;
  min_height?: number;
  modalTarget: string;
}

const defaultOptions: Partial<SingleImageDragOptions> = {
  accept: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
  ],
  crop: false,
  width: 800,
  height: 800,
};

export class SingleImageDragElement extends HTMLElement {
  static is = 'uni-sid';

  currentImage = '';
  currentFile: File | undefined = undefined;
  lastZoom = 0;
  valueBackup = '';

  private options!: SingleImageDragOptions;
  private valueInput!: HTMLInputElement;
  private fileInput!: HTMLInputElement;
  private selectButton!: HTMLButtonElement;
  private pasteButton!: HTMLButtonElement;
  private dragarea!: HTMLDivElement;
  private previewImage!: HTMLImageElement;
  private removeCheckbox!: HTMLInputElement;
  private modalElement!: HTMLDivElement;
  private modal!: Modal;
  private cropContainer!: HTMLDivElement;
  private savebutton!: HTMLButtonElement;
  private modalToolbarButtons!: NodeListOf<HTMLButtonElement>;
  private cropper!: Cropper;

  constructor() {
    super();
  }

  connectedCallback() {
    this.options = mergeDeep(
      {},
      defaultOptions,
      JSON.parse(this.getAttribute('options') || '{}')
    );

    this.valueInput = this.querySelector<HTMLInputElement>('[data-field-input]')!;
    this.fileInput = this.querySelector<HTMLInputElement>('[data-sid=file]')!;
    this.selectButton = this.querySelector<HTMLButtonElement>('[data-sid=select]')!;
    this.pasteButton = this.querySelector<HTMLButtonElement>('[data-sid=paste]')!;
    this.dragarea = this.querySelector<HTMLDivElement>('[data-sid=dragarea]')!;
    this.previewImage = this.querySelector<HTMLImageElement>('[data-sid=preview]')!;
    this.removeCheckbox = this.querySelector<HTMLInputElement>('[data-sid=remove]')!;

    this.modalElement = document.querySelector<HTMLDivElement>(this.options.modalTarget)!;
    this.modal = Modal.getOrCreateInstance(this.modalElement);
    this.cropContainer = this.modalElement.querySelector<HTMLDivElement>('[data-sid="crop-container"]')!;
    this.savebutton = this.modalElement.querySelector<HTMLButtonElement>('[data-sid=save-button]')!;
    this.modalToolbarButtons = this.modalElement.querySelectorAll<HTMLButtonElement>('[data-sid-toolbar]');

    const modalShown = async () => {
      const cropper = await this.getCropper();
      cropper.replace(this.currentImage);
      this.cropContainer.style.visibility = '';
      this.currentImage = '';
    };

    this.modalElement.addEventListener('shown.bs.modal', modalShown.bind(this));

    this.savebutton.addEventListener('click', () => {
      this.saveCropped();
      this.modal.hide();
    });

    this.bindEvents();

    this.style.visibility = '';
  }

  bindEvents() {
    this.dragarea.addEventListener('dragover', (event) => {
      event.stopPropagation();
      event.preventDefault();

      this.dragarea.classList.add('hover');
    });

    this.dragarea.addEventListener('dragleave', (event) => {
      event.stopPropagation();
      event.preventDefault();

      this.dragarea.classList.remove('hover');
    });

    this.dragarea.addEventListener('drop', (event) => {
      event.stopPropagation();
      event.preventDefault();

      this.dragarea.classList.remove('hover');

      const files = (event.target as HTMLInputElement).files || event.dataTransfer?.files || [];
      this.handleFileSelect(files[0]);
    });

    // Select button
    this.selectButton.addEventListener('click', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', this.getInputAccept());
      input.style.display = 'none';
      input.addEventListener('change', (e) => {
        this.handleFileSelect(input.files![0]!);

        input.remove();
      });

      document.body.appendChild(input);
      input.click();
    });

    this.pasteButton.addEventListener('click', () => {
      navigator.clipboard.read().then((items) => {
        let types = items[0].types;

        if (types.length === 0) {
          this.alert('This browser unable to get clipboard data.');
          return;
        }

        types = types.slice().sort();

        const type = types[0];

        items[0].getType(type).then((blob) => {
          this.handleFileSelect(new File([ blob ], 'image.png', { type }));
        });
      });
    });

    // Delete
    this.removeCheckbox?.addEventListener('click', () => {
      if (this.removeCheckbox.checked) {
        this.valueBackup = this.valueInput.value;
        this.valueInput.value = '';
      } else {
        this.valueInput.value = this.valueBackup;
        this.valueBackup = '';
      }
    });

    // Zoom slider
    selectAll(this.modalToolbarButtons, (button) => {
      button.addEventListener('click', (event) => {
        this.toolbarClicked(button, event);
      });
    });
  }

  getInputAccept() {
    let accept = this.options.accept;

    if (Array.isArray(accept)) {
      accept = accept.join(',');
    }

    return accept;
  }

  handleFileSelect(file: File) {
    if (!this.checkFile(file)) {
      return;
    }

    if (this.options.crop) {
      const reader = new FileReader();

      reader.addEventListener('load', (event) => {
        this.cropContainer.style.visibility = 'hidden';
        this.currentImage = event.target!.result as string;
        this.currentFile = file;

        // After modal shown, cropper will auto load.
        this.modal.show();
      });

      reader.readAsDataURL(file);
      return;
    }

    this.saveImage(file);
  }

  async saveCropped() {
    const Cropper = await this.getCropper();

    Cropper.getCroppedCanvas({
      width: this.options.width,
      height: this.options.height,
      imageSmoothingEnabled: true
    })
      .toBlob((blob) => {
        const file = new File([ blob! ], this.currentFile!.name, { type: 'image/png' });
        this.saveImage(file);
      }, 'image/png');
  }

  async getCropper() {
    if (this.cropper) {
      return this.cropper;
    }

    const Cropper = await loadCropper();

    return this.cropper = new Cropper(this.cropContainer.querySelector('img')!, {
      aspectRatio: this.options.width / this.options.height,
      autoCropArea: 1,
      viewMode: 1,
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      ready: (e) => {
        //
      },
    });
  }

  async toolbarClicked(button: HTMLButtonElement, event: MouseEvent) {
    const cropper = await this.getCropper();

    const data = cropper.getData();

    switch (button.dataset.sidToolbar) {
      case 'zoom-in':
        cropper.zoom(0.1);
        break;

      case 'zoom-out':
        cropper.zoom(-0.1);
        break;

      case 'rotate-left':
        cropper.rotate(-90);
        break;

      case 'rotate-right':
        cropper.rotate(90);
        break;

      case 'scale-x':
        cropper.scaleX(-data.scaleX);
        break;

      case 'scale-y':
        cropper.scaleY(-data.scaleY);
        break;
    }
  }

  checkFile(file: File): boolean {
    let accept = this.options.accept;

    if (typeof accept === 'string') {
      accept = accept.split(',').map(v => v.trim());
    }

    if (!accept.length) {
      return true;
    }

    let allow = false;

    for (const type of accept) {
      if (type.indexOf('/') !== -1) {
        allow = allow || this.compareMimeType(type, file.type);
      } else {
        allow = allow || type.toLowerCase() === getFileExtension(file)?.toLowerCase();
      }
    }

    if (allow) {
      return true;
    }

    this.alert(
      __('unicorn.field.sid.message.invalid.image.title'),
      __('unicorn.field.sid.message.invalid.image.desc'),
      'error'
    );

    return false;
  }

  compareMimeType(accept: string, mime: string) {
    const accept2 = accept.split('/');
    const mime2 = mime.split('/');

    if (accept2[1] === '*') {
      return accept2[0] === mime2[0];
    }

    return accept === mime;
  }

  checkSize(image: HTMLImageElement): boolean {
    try {
      if (this.options.max_width && this.options.max_width < image.width) {
        throw new Error(__('unicorn.field.sid.message.invalid.size.max.width', this.options.max_width));
      }

      if (this.options.min_width && this.options.min_width > image.width) {
        throw new Error(__('unicorn.field.sid.message.invalid.size.min.width', this.options.min_width));
      }

      if (this.options.max_height && this.options.max_height < image.height) {
        throw new Error(__('unicorn.field.sid.message.invalid.size.max.height', this.options.max_height));
      }

      if (this.options.min_height && this.options.min_height > image.height) {
        throw new Error(__('unicorn.field.sid.message.invalid.size.min.height', this.options.min_height));
      }
    } catch (e) {
      this.alert(
        __('unicorn.field.sid.message.invalid.size.title'),
        (e as Error).message,
        'error'
      );

      return false;
    }

    return true;
  }

  alert(title: string, text = '', type = 'info') {
    return simpleAlert(title, text, type);
  }

  async saveImage(file: File) {
    if (this.options.ajax_url) {
      const loading = this.querySelector<HTMLImageElement>('[data-sid=file-uploading]')!;

      this.previewImage.src = '';
      this.previewImage.style.display = 'none';
      loading.style.display = 'flex';

      try {
        const res = await this.uploadImage(file);

        this.storeValue(res.data.data.url, res.data.data.url);
      } catch (e) {
        console.error(e);
        simpleAlert((e as Error).message);
        return;
      } finally {
        loading.style.display = 'none';
      }

      return;
    }

    // @see https://stackoverflow.com/a/47172409
    // @see https://stackoverflow.com/a/47522812
    const dt = new DataTransfer();
    dt.items.add(file);

    // No required for value input to remove validation message
    this.valueInput.required = false;

    this.fileInput.files = dt.files;
    this.fileInput.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    this.fileInput.dispatchEvent(new CustomEvent('input', { bubbles: true }));

    this.storeValue('', URL.createObjectURL(file));
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const { post } = await useHttpClient();

    return post<ApiReturn<{ url: string; }>>(this.options.ajax_url!, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  storeValue(url: string, preview: string) {
    this.previewImage.src = preview;
    this.previewImage.style.display = 'inline-block';

    // Make delete box unchecked
    if (this.removeCheckbox) {
      this.removeCheckbox.checked = false;
    }

    if (url) {
      this.valueInput.value = url;
    }

    // Trigger change
    this.previewImage.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    this.valueInput.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    this.valueInput.dispatchEvent(new CustomEvent('input', { bubbles: true }));
  }
}

// Promise.all([
//   import('@cropperjs/cropper.min.js'),
//   import('@cropperjs/cropper.css'),
// ])
//   .then((service) => {
//     const styleSheet = service[1].default;
//     document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
//   });

function getFileExtension(file: File): string | undefined {
  const parts = file.name.split('.');
  if (parts.length > 1) {
    return parts.pop();
  }
  return undefined;
}

let loadingCropper: Promise<any>;

async function loadCropper(): Promise<typeof Cropper> {
  loadingCropper ??= Promise.all([
    import('cropperjs'),
    import('cropperjs/dist/cropper.min.css?inline').then(({ default: css }) => {
      injectCssToDocument(css);
    })
  ]);

  return (await loadingCropper)[0];
}

async function init() {
  injectCssToDocument(css);

  customElements.define(SingleImageDragElement.is, SingleImageDragElement);

  await loadCropper();
}

export const ready = init();

export interface SingleImageDragModule {
  SingleImageDragElement: typeof SingleImageDragElement;
  ready: typeof ready;
}
