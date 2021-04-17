/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

customElements.define(
  'uni-validate',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const $input = this.querySelector('input, select, textarea');
      
      $input.addEventListener('unicorn:validated', (e) => {
        this.showResponse(e.detail.valid, e.detail.state, e.detail.input);
      });
    }

    showResponse(valid, state, $input) {
      const $help = document.createElement('div');

      this.querySelector('.invalid-tooltip')?.remove();

      if (valid) {
        return;
      }

      $help.textContent = $input.validationMessage;

      $help.classList.add('invalid-tooltip');

      $input.parentNode.insertBefore($help, $input.nextSibling);
    }
  }
)
