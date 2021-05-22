/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import Cropper from 'cropperjs';

class SingleImageDrag extends HTMLElement {
  static is = 'uni-sid';

  constructor() {
    super();
  }

  connectedCallback() {
    this.style.visibility = '';
  }
}

u.import('@unicorn/field/single-image-drag.css').then((module) => {
  const styleSheet = module.default; // A CSSStyleSheet object
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

  customElements.define(SingleImageDrag.is, SingleImageDrag);
});
