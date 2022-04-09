/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import '../../../scss/field/file-drag.scss';

class FileDrag extends HTMLElement {
  static is = 'uni-file-drag';
  
  get inputSelector() {
    return this.getAttribute('selector') || 'input[type=file]';
  }
  
  get multiple() {
    return this.element.multiple;
  }

  connectedCallback() {
    this.element = this.querySelector(this.inputSelector);
    this.overlayLabel = this.querySelector('[data-overlay-label]');
    this.options = JSON.parse(this.getAttribute('options') || '{}');
    
    this.bindEvent();

    this.style.visibility = '';

    this.style.height = (this.options.height || 100) + 'px';
  }
  
  bindEvent() {
    this.element.addEventListener('change', (e) => {
      this.onChange(e);
    });

    this.element.addEventListener('dragover', () => {
      this.element.classList.add('hover');
    });

    this.element.addEventListener('dragleave', () => {
      this.element.classList.remove('hover');
    });

    this.element.addEventListener('drop', () => {
      this.element.classList.remove('hover');
    });

    this.onChange();

    this.element.addEventListener('change', (e) => {
      this.onChange(e);
    });
    this.element.addEventListener('input', (e) => {
      this.onChange(e);
    });
  }

  onChange(e) {
    const files = this.element.files;
    const limit = this.options.maxFiles;
    const maxSize = this.options.maxSize;
    let placeholder = this.options.placeholder;

    const accepted = (this.element.getAttribute('accept') || this.element.getAttribute('data-accepted') || '')
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .map(v => {
        if (v.indexOf('/') === -1 && v[0] === '.') {
          return v.substr(1);
        }

        return v;
      });

    let text;

    if (!placeholder) {
      if (this.multiple) {
        placeholder = u.__('unicorn.field.file.drag.placeholder.multiple');
      } else {
        placeholder = u.__('unicorn.field.file.drag.placeholder.single');
      }
    }

    // Files limit
    if (limit && files.length > limit) {
      this.alert(u.__('unicorn.field.file.drag.message.max.files', limit), '', 'warning');
      e.preventDefault();
      return;
    }

    // Files size
    let fileSize = 0;
    Array.prototype.forEach.call(files, file => {
      this.checkFileType(accepted, file);

      fileSize += file.size;
    });

    if (maxSize && (fileSize / 1024 / 1024) > maxSize) {
      this.alert(
        u.__(
          'unicorn.field.file.drag.message.max.size',
          maxSize < 1 ? (maxSize * 1024) + 'KB' : maxSize + 'MB'
        ),
        '',
        'warning'
      );
      e.preventDefault();
      return;
    }

    if (files.length > 1) {
      text = `<span class="fa fa-files fa-copy"></span> ${u.__('unicorn.field.file.drag.selected', files.length)}`;
    } else if (files.length === 1) {
      text = `<span class="fa fa-file"></span> ${files[0].name}`;
    } else {
      text = `<span class="fa fa-upload"></span> ${placeholder}`;
    }

    //replace the "Choose a file" label
    this.overlayLabel.querySelector('span').innerHTML = text;
  }

  checkFileType(accepted, file) {
    const fileExt = file.name.split('.').pop();

    if (accepted.length) {
      let allow = false;

      accepted.forEach((type) => {
        if (allow) {
          return;
        }

        if (type.indexOf('/') !== -1) {
          if (this.compareMimeType(type, file.type)) {
            allow = true;
          }
        } else {
          if (type === fileExt) {
            allow = true;
          }
        }
      });

      if (!allow) {
        this.alert(
          u.__('unicorn.field.file.drag.message.unaccepted.files'),
          u.__('unicorn.field.file.drag.message.unaccepted.files.desc', accepted.join(', ')),
          'warning'
        );
        throw new Error('Not accepted file ext');
      }
    }
  }

  compareMimeType(accepted, mime) {
    const accepted2 = accepted.split('/');
    const mime2 = mime.split('/');

    if (accepted2[1] === '*') {
      return accepted2[0] === mime2[0];
    }

    return accepted === mime;
  }

  alert(title, text = '', type = 'info') {
    if (window.swal) {
      window.swal(title, text, type);
    } else {
      if (text) {
        title += ' - ' + text;
      }
      
      alert(title);
    }
  }
}

u.defineCustomElement(FileDrag.is, FileDrag);
