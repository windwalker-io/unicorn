import { module, useCssImport, useCssIncludes, useImport, wait } from '../service';
import type { Nullable } from '../types';
import { mergeDeep } from '../utilities';

/**
 * @see https://tom-select.js.org/
 */
export async function useTomSelect(
  selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>,
  options: Record<string, any> = {},
  theme: string = 'bootstrap5'
) {
  const [m] = await wait(
    useImport('@vendor/tom-select/dist/js/tom-select.complete.min.js'),
    useCssImport(`@vendor/tom-select/dist/css/tom-select.${theme}.min.css`)
  );

  if (selector) {
    module<any, HTMLSelectElement>(
      selector,
      'tom.select',
      (ele) => {
        options = mergeDeep({
          allowEmptyOption: true,
          maxOptions: null,
          plugins: {
            caret_position: {},
            clear_button: {},
          }
        }, options);

        if ((ele as HTMLSelectElement).multiple) {
          options.plugins.remove_button = {};
        } else {
          options.plugins.dropdown_input = {};
        }

        // Auto select first if options changed.
        // @see https://github.com/orchidjs/tom-select/issues/362
        class UnicornTomSelect extends TomSelect {
          syncOptionsWithoutKeepSelected() {
            const oldValue = ele.value;

            this.clear();
            this.clearOptions();
            this.sync();

            if (ele.value !== oldValue) {
              this.setValue(
                ele.querySelector<HTMLOptionElement>(`option[value="${oldValue}"]`)?.value
                ?? ele.querySelector<HTMLOptionElement>('option')?.value
                ?? '',
                true
              );
            }
          }
        }

        // @ts-ignore
        const t = new UnicornTomSelect(ele as TomInput, options);

        ele.addEventListener('list:updated', () => {
          t.syncOptionsWithoutKeepSelected();
        });

        return t;
      }
    );
  }

  return m;
}
