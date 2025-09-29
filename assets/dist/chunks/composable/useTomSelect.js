import { w as wait } from "../service/helper.js";
import { u as useCssImport, a as useImport } from "../service/loader.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { m as module } from "../service/dom.js";
async function useTomSelect(selector, options = {}, theme = "bootstrap5") {
  const [m] = await wait(
    useImport("@vendor/tom-select/dist/js/tom-select.complete.min.js"),
    useCssImport(`@vendor/tom-select/dist/css/tom-select.${theme}.min.css`)
  );
  if (selector) {
    module(
      selector,
      "tom.select",
      (ele) => {
        options = mergeDeep({
          allowEmptyOption: true,
          maxOptions: null,
          plugins: {
            caret_position: {},
            clear_button: {}
          }
        }, options);
        if (ele.multiple) {
          options.plugins.remove_button = {};
        } else {
          options.plugins.dropdown_input = {};
        }
        class UnicornTomSelect extends TomSelect {
          syncOptionsWithoutKeepSelected() {
            const oldValue = ele.value;
            this.clear();
            this.clearOptions();
            this.sync();
            if (ele.value !== oldValue) {
              this.setValue(
                ele.querySelector(`option[value="${oldValue}"]`)?.value ?? ele.querySelector("option")?.value ?? "",
                true
              );
            }
          }
        }
        const t = new UnicornTomSelect(ele, options);
        ele.addEventListener("list:updated", () => {
          t.syncOptionsWithoutKeepSelected();
        });
        return t;
      }
    );
  }
  return m;
}
export {
  useTomSelect as u
};
