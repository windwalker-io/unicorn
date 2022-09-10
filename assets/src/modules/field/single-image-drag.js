/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import '../../../scss/field/single-image-drag.scss';

class SingleImageDrag extends HTMLElement {
  static is = 'uni-sid';

  currentImage = '';
  currentFile;
  lastZoom = 0;
  valueBackup = '';

  constructor() {
    super();
  }

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');

    this.valueInput = this.querySelector('[data-field-input]');
    this.fileInput = this.querySelector('[data-sid=file]');
    this.selectButton = this.querySelector('[data-sid=select]');
    this.pasteButton = this.querySelector('[data-sid=paste]');
    this.dragarea = this.querySelector('[data-sid=dragarea]');
    this.previewImage = this.querySelector('[data-sid=preview]');
    this.removeCheckbox = this.querySelector('[data-sid=remove]');

    this.modalElement = document.querySelector(this.options.modalTarget);
    this.modal = u.$ui.bootstrap.modal(this.modalElement);
    this.cropContainer = this.modalElement.querySelector('[data-sid="crop-container"]');
    this.savebutton = this.modalElement.querySelector('[data-sid=save-button]');
    this.modalToolbarButtons = this.modalElement.querySelectorAll('[data-sid-toolbar]');

    const modalShown = () => {
      const cropper = this.getCropper();
      cropper.replace(this.currentImage);
      this.cropContainer.style.visibility = '';
      this.currentImage = null;
    };

    // BS5
    if (bootstrap.Modal.VERSION.startsWith('5')) {
      this.modalElement.addEventListener('shown.bs.modal', modalShown.bind(this));
    } else {
      $(this.modalElement).on('shown.bs.modal', modalShown.bind(this));
    }

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

      const files = event.target.files || event.dataTransfer.files;
      this.handleFileSelect(files[0]);
    });

    // Select button
    this.selectButton.addEventListener('click', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', this.getInputAccept());
      input.style.display = 'none';
      input.addEventListener('change', (e) => {
        this.handleFileSelect(input.files[0]);

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
          console.log(blob);
          this.handleFileSelect(new File([ blob ], 'image.png', { type }));
        });
      });
    });

    // Delete
    this.removeCheckbox.addEventListener('click', () => {
      if (this.removeCheckbox.checked) {
        this.valueBackup = this.valueInput.value;
        this.valueInput.value = '';
      } else {
        this.valueBackup = this.valueInput;
        this.valueInput.value = this.valueBackup;
      }
    });

    // Zoom slider
    u.selectAll(this.modalToolbarButtons, (button) => {
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

  handleFileSelect(file) {
    if (!this.checkFile(file)) {
      return;
    }

    if (this.options.crop) {
      const reader = new FileReader();

      reader.addEventListener('load', (event) => {
        this.cropContainer.style.visibility = 'hidden';
        this.currentImage = event.target.result;
        this.currentFile = file;

        // After modal shown, cropper will auto load.
        this.modal.show();
      });

      reader.readAsDataURL(file);
      return;
    }

    this.saveImage(file);
  }

  saveCropped() {
    this.getCropper().getCroppedCanvas({
        width: this.options.width,
        height: this.options.height,
        imageSmoothingEnabled: true
      })
      .toBlob((blob) => {
        const file = new File([ blob ], this.currentFile.name, { type: 'image/png' });
        this.saveImage(file);
      }, 'image/png');
  }

  getCropper() {
    return this.cropper = this.cropper || (() => {
      const cropper = new Cropper(this.cropContainer.querySelector('img'), {
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

      // cropper.addEv

      return cropper;
    })();
  }

  toolbarClicked(button, event) {
    const cropper = this.getCropper();

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

  /**
   * Check file type is image.
   *
   * @param {File} file
   *
   * @returns {boolean}
   */
  checkFile(file) {
    let accept = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ];

    accept = this.options.accept || accept;

    if (typeof accept === 'string') {
      accept = accept.split(',').map(v => v.trim());
    }

    if (!accept.length) {
      return true;
    }

    let allow = false;

    accept.forEach((type) => {
      if (type.indexOf('/') !== -1) {
        allow = allow || this.compareMimeType(type, file.type);
      } else {
        allow = allow || type.toLowerCase() === file.extname.toLowerCase();
      }
    });

    if (allow) {
      return true;
    }

    this.alert(
      u.__('unicorn.field.sid.message.invalid.image.title'),
      u.__('unicorn.field.sid.message.invalid.image.desc'),
      'error'
    );

    return false;
  }

  compareMimeType(accept, mime) {
    const accept2 = accept.split('/');
    const mime2 = mime.split('/');

    if (accept2[1] === '*') {
      return accept2[0] === mime2[0];
    }

    return accept === mime;
  }

  /**
   * Check image size.
   *
   * @param {Image} image
   *
   * @returns {boolean}
   */
  checkSize(image) {
    try {
      if (this.options.max_width !== null && this.options.max_width < image.width) {
        throw new Error(u.__('unicorn.field.sid.message.invalid.size.max.width', this.options.max_width));
      }

      if (this.options.min_width !== null && this.options.min_width > image.width) {
        throw new Error(u.__('unicorn.field.sid.message.invalid.size.min.width', this.options.min_width));
      }

      if (this.options.max_height !== null && this.options.max_height < image.height) {
        throw new Error(u.__('unicorn.field.sid.message.invalid.size.max.height', this.options.max_height));
      }

      if (this.options.min_height !== null && this.options.min_height > image.height) {
        throw new Error(u.__('unicorn.field.sid.message.invalid.size.min.height', this.options.min_height));
      }
    } catch (e) {
      this.alert(
        u.__('unicorn.field.sid.message.invalid.size.title'),
        e.message,
        'error'
      );

      return false;
    }

    return true;
  }

  alert(title, text = '', type = 'info') {
    const swal = window.swal || window.alert;
    if (window.swal) {
      return swal(title, text, type);
    } else {
      if (text) {
        title += ' - ' + text;
      }

      alert(title);

      return Promise.resolve();
    }
  }

  saveImage(file) {
    if (this.options.ajax_url) {
      const loading = this.querySelector('[data-sid=file-uploading]');

      this.previewImage.src = '';
      this.previewImage.style.display = 'none';
      loading.style.display = 'flex';

      this.uploadImage(file)
        .then((res) => {
          this.storeValue(res.data.data.url, res.data.data.url);
        })
        .catch((error) => {
          console.error(error);
          this.alert(error.message);
        }).then(() => {
          loading.style.display = 'none';
        });

      return;
    }

    // @see https://stackoverflow.com/a/47172409
    // @see https://stackoverflow.com/a/47522812
    const dt = new DataTransfer();
    dt.items.add(file);

    this.fileInput.files = dt.files;
    this.fileInput.dispatchEvent(new CustomEvent('change'));
    this.fileInput.dispatchEvent(new CustomEvent('input'));

    this.storeValue(null, URL.createObjectURL(file));
  }

  uploadImage (file) {
    const formData = new FormData();
    formData.append('file', file);

    return u.$http.post(this.options.ajax_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  storeValue (url, preview) {
    this.previewImage.src = preview;
    this.previewImage.style.display = 'inline-block';

    // Make delete box unchecked
    this.removeCheckbox.checked = false;

    if (url) {
      this.valueInput.value = url;
    }

    // Trigger change
    this.previewImage.dispatchEvent(new CustomEvent('change'));
    this.valueInput.dispatchEvent(new CustomEvent('change'));
  }
}

Promise.all([
  u.import('@cropperjs/cropper.min.js'),
  u.import('@cropperjs/cropper.css'),
])
  .then((modules) => {
    const styleSheet = modules[1].default;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
  });

u.defineCustomElement(SingleImageDrag.is, SingleImageDrag);
