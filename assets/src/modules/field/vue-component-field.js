/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export class VueComponentField {
  static async init(selector, value = null, options = {}) {
    const { createApp, ref, reactive, toRefs, onMounted } = Vue;

    options = u.defaultsDeep({}, options, {
      init: null,
      json: false,
    });

    let app = createApp({
      setup(props, { emit }) {
        const state = reactive({
          value,
        });
        const mainInput = ref(null);
        const elPlaceholder = ref(null);
        let storeInput;

        onMounted(() => {
          storeInput = elPlaceholder.value?.closest('[data-field-wrapper]')?.querySelector('[data-field-input]');
        });

        function onChange(e) {
          emit('change', e);

          if (storeInput) {
            storeInput.value = options.json ? JSON.stringify(e) : e;
            storeInput.dispatchEvent(new CustomEvent('change'));
          }
        }

        function onInput(e) {
          emit('input', e);

          if (storeInput) {
            storeInput.value = options.json ? JSON.stringify(e) : e;
            storeInput.dispatchEvent(new CustomEvent('input'));
          }
        }

        function onInvalid(e) {
          emit('invalid', e);

          storeInput?.dispatchEvent(new CustomEvent('invalid'));
        }

        function callGlobal(funcName) {
          return function (...args) {
            return window[funcName](...args);
          }
        }

        function unicornEvent(eventName) {
          return function (...args) {
            return u.trigger(eventName, ...args);
          }
        }

        return {
          ...toRefs(state),
          elPlaceholder,
          mainInput,

          onChange,
          onInput,
          onInvalid,
          callGlobal,
          unicornEvent,
        }
      }
    });

    if (options.init) {
      app = (await options.init(app)) || app;
    }

    app.mount(selector);
  }
}
