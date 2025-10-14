import css from '../../scss/field/file-drag.scss?inline';
import { useUniDirective } from '../composable';
import { __, html, injectCssToDocument, simpleAlert, uid, watchAttributes } from '../service';
import { mergeDeep } from '../utilities';

export interface FileDragOptions {
  maxFiles: number | undefined;
  maxSize: number | undefined;
  placeholder: string;
  height: number;
}

const defaultOptions: FileDragOptions = {
  maxFiles: undefined,
  maxSize: undefined,
  placeholder: '',
  height: 125,
}

export class FileDragElement extends HTMLElement {
  static is = 'uni-file-drag';

  element!: HTMLInputElement;
  overlayLabel!: HTMLLabelElement;
  button!: HTMLButtonElement;
  options!: FileDragOptions;

  get inputSelector() {
    return this.getAttribute('selector') || 'input[type=file]';
  }

  get multiple() {
    return this.element.multiple;
  }

  connectedCallback(): void {
    this.element = this.querySelector(this.inputSelector)!;

    this.prepareElements();

    const options = JSON.parse(this.getAttribute('options') || '{}') || {};

    const observer = watchAttributes(this.element);
    observer.watch('readonly', (el) => {
      el.disabled = el.readOnly;
    });

    if (this.element.readOnly) {
      this.element.disabled = true;
    }

    this.options = mergeDeep({}, defaultOptions, options);

    this.bindEvent();

    this.style.visibility = '';

    this.style.height = (this.options.height || 100) + 'px';
  }

  bindEvent() {
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

  prepareElements() {
    if (this.children.length === 0) {
      this.createElementsLayout();
    }

    this.overlayLabel = this.querySelector<HTMLLabelElement>('[data-overlay-label]')!;

    let button = this.overlayLabel.querySelector('button');

    // B/C for new file drag style
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('class', 'c-file-drag-input__button btn btn-success btn-sm px-2 py-1');
      button.innerText = __('unicorn.field.file.drag.button.text');
      this.overlayLabel.appendChild(button);
    }

    this.button = button;
  }

  createElementsLayout() {
    this.id ||= 'c-file-drag-' + uid();
    const name = this.getAttribute('name') || 'file';
    const inputId = this.id + '__input';
    const btnText = __('unicorn.field.file.drag.button.text');

    const input = html(`<input id="${inputId}" type="file" name="${name}" />`);
    const label = html(`<label class="px-3 c-file-drag-input__label"
        data-overlay-label
        for="${inputId}">
        <span class="label-text d-block">
            <span class="fa fa-upload"></span>
        </span>
        <button type="button" class="c-file-drag-input__button btn btn-success btn-sm px-2 py-1">
            ${btnText}
        </button>
    </label>`);

    this.element = input as HTMLInputElement;
    this.overlayLabel = label as HTMLLabelElement;

    this.appendChild(input);
    this.appendChild(label);
  }

  onChange(evt?: Event) {
    const files = this.element.files || [];
    const limit = this.options.maxFiles;
    const maxSize = this.options.maxSize;
    let placeholder = this.options.placeholder;

    const accepted = (this.element.getAttribute('accept') || this.element.getAttribute('data-accepted') || '')
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .map(v => {
        if (v.indexOf('/') === -1 && v[0] === '.') {
          return v.substring(1);
        }

        return v;
      });

    let text: string;

    if (!placeholder) {
      if (this.multiple) {
        placeholder = __('unicorn.field.file.drag.placeholder.multiple');
      } else {
        placeholder = __('unicorn.field.file.drag.placeholder.single');
      }
    }

    // Files limit
    if (limit && files.length > limit) {
      this.alert(__('unicorn.field.file.drag.message.max.files', limit), '', 'warning');
      evt?.preventDefault();
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
        __(
          'unicorn.field.file.drag.message.max.size',
          maxSize < 1 ? (maxSize * 1024) + 'KB' : maxSize + 'MB'
        ),
        '',
        'warning'
      );
      evt?.preventDefault();
      return;
    }

    if (files.length > 1) {
      text = `<span class="fa fa-files fa-copy"></span> ${__('unicorn.field.file.drag.selected', files.length)}`;
    } else if (files.length === 1) {
      text = `<span class="fa fa-file"></span> ${files[0].name}`;
    } else {
      text = `<span class="fa fa-upload"></span> ${placeholder}`;
    }

    //replace the "Choose a file" label
    this.overlayLabel.querySelector<HTMLSpanElement>('span')!.innerHTML = text;
  }

  checkFileType(accepted: string[], file: File) {
    const fileExt = file.name.split('.').pop() || '';

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
          if (type.toLowerCase() === fileExt.toLowerCase()) {
            allow = true;
          }
        }
      });

      if (!allow) {
        this.alert(
          __('unicorn.field.file.drag.message.unaccepted.files'),
          __('unicorn.field.file.drag.message.unaccepted.files.desc', accepted.join(', ')),
          'warning'
        );
        throw new Error('Not accepted file ext');
      }
    }
  }

  compareMimeType(accepted: string, mime: string) {
    const accepted2 = accepted.split('/');
    const mime2 = mime.split('/');

    if (accepted2[1] === '*') {
      return accepted2[0] === mime2[0];
    }

    return accepted === mime;
  }

  async alert(title: string, text: string = '', type: string = 'info') {
    await simpleAlert(title, text, type);
  }
}

async function init() {
  injectCssToDocument(document, css);
  customElements.define(FileDragElement.is, FileDragElement);

 return useUniDirective('file-drag-field', {
   mounted(el) {
     const input = el.querySelector<HTMLInputElement>('input[type=file]')!;
     const placeholderInput = el.querySelector<HTMLInputElement>('[data-role=placeholder]')!;

     const preview = el.querySelector('.c-file-drag-preview');

     if (preview) {
       const previewLink = preview.querySelector<HTMLAnchorElement>('.c-file-drag-preview__link')!;
       const delButton = preview.querySelector<HTMLAnchorElement>('.c-file-drag-preview__delete')!;
       // let linkTitle = previewLink.textContent;
       let inputValue = placeholderInput.value;
       let required = input.required;

       if (placeholderInput.value) {
         input.required = false;
       }

       delButton.addEventListener('click', () => {
         if (delButton.classList.contains('active')) {
           // Restore
           previewLink.style.textDecoration = '';
           previewLink.style.setProperty('color', '');
           placeholderInput.value = inputValue;
           delButton.classList.remove('active');
           input.required = false;
         } else {
           // Delete
           previewLink.style.textDecoration = 'line-through';
           previewLink.style.color = 'var(--fd-delete-color, var(--bs-danger))';
           placeholderInput.value = '';
           delButton.classList.add('active');
           input.required = required;
         }
       });
     }
   }
 });
}

export const ready = init();

export interface FileDragModule {
  FileDragElement: typeof FileDragElement;
}
