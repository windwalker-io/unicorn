import { d as data } from "../data.js";
import { u as useSystemUri } from "../service/uri.js";
import { l as loadAlpine } from "../service/ui.js";
class UnicornFormElement {
  element;
  options;
  constructor(selector, element, options = {}) {
    if (!element) {
      element = document.createElement("form");
      if (typeof selector === "string" && selector.startsWith("#")) {
        element.setAttribute("id", selector.substring(1));
        element.setAttribute("name", selector.substring(1));
      }
      element.setAttribute("method", "post");
      element.setAttribute("enctype", "multipart/form-data");
      element.setAttribute("novalidate", "true");
      element.setAttribute("action", useSystemUri("full"));
      element.setAttribute("style", "display: none;");
      const csrf = document.createElement("input");
      csrf.setAttribute("type", "hidden");
      csrf.setAttribute("name", data("csrf-token"));
      csrf.setAttribute("value", "1");
      element.appendChild(csrf);
      document.body.appendChild(element);
    }
    this.element = element;
    this.options = { ...options };
  }
  initComponent(store = "form", custom = {}) {
    return loadAlpine((Alpine) => {
      Alpine.store(store, this.useState(custom));
    });
  }
  useState(custom = {}) {
    const state = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map((item) => {
      return state[item] = this[item].bind(this);
    });
    return Object.assign(
      state,
      custom
    );
  }
  getElement() {
    return this.element;
  }
  submit(url, data2, method, customMethod) {
    const form = this.element;
    if (customMethod) {
      let methodInput = form.querySelector('input[name="_method"]');
      if (!methodInput) {
        methodInput = document.createElement("input");
        methodInput.setAttribute("name", "_method");
        methodInput.setAttribute("type", "hidden");
        methodInput.value = customMethod;
        form.appendChild(methodInput);
      } else {
        methodInput.value = customMethod;
      }
    }
    if (data2) {
      const flatted = UnicornFormElement.flattenObject(data2);
      for (const key in flatted) {
        const value = flatted[key];
        const fieldName = UnicornFormElement.buildFieldName(key);
        this.injectInput(fieldName, value);
      }
    }
    if (url) {
      form.setAttribute("action", url);
    }
    if (method) {
      form.setAttribute("method", method);
    }
    form.requestSubmit();
    return true;
  }
  injectInput(name, value) {
    let input = this.element.querySelector(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement("input");
      input.setAttribute("name", name);
      input.setAttribute("type", "hidden");
      input.setAttribute("data-role", "temp-input");
      this.element.appendChild(input);
    }
    input.value = value;
    return input;
  }
  /**
   * Make a GET request.
   */
  get(url, data2, customMethod) {
    return this.submit(url, data2, "GET", customMethod);
  }
  /**
   * Post form.
   */
  post(url, data2, customMethod) {
    customMethod = customMethod || "POST";
    return this.submit(url, data2, "POST", customMethod);
  }
  /**
   * Make a PUT request.
   */
  put(url, data2) {
    return this.post(url, data2, "PUT");
  }
  /**
   * Make a PATCH request.
   */
  patch(url, data2) {
    return this.post(url, data2, "PATCH");
  }
  /**
   * Make a DELETE request.
   */
  delete(url, data2) {
    return this.post(url, data2, "DELETE");
  }
  /**
   * @see https://stackoverflow.com/a/53739792
   *
   * @param {Object} ob
   * @returns {Object}
   */
  static flattenObject(ob) {
    const toReturn = {};
    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) {
        continue;
      }
      if (typeof ob[i] === "object" && ob[i] != null) {
        const flatObject = this.flattenObject(ob[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) {
            continue;
          }
          toReturn[i + "/" + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }
  static buildFieldName(field) {
    const names = field.split("/");
    const first = names.shift();
    return first + names.map((name) => `[${name}]`).join("");
  }
}
export {
  UnicornFormElement
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZS9mb3JtLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHsgbG9hZEFscGluZSwgdXNlU3lzdGVtVXJpIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB0eXBlIHsgTnVsbGFibGUgfSBmcm9tICcuLi90eXBlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pY29ybkZvcm1FbGVtZW50IHtcclxuICBlbGVtZW50OiBIVE1MRm9ybUVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBzZWxlY3Rvcj86IHN0cmluZyB8IEVsZW1lbnQsXHJcbiAgICBlbGVtZW50PzogSFRNTEZvcm1FbGVtZW50LFxyXG4gICAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxyXG4gICkge1xyXG4gICAgLy8gSWYgZm9ybSBub3QgZm91bmQsIGNyZWF0ZSBvbmVcclxuICAgIGlmICghZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgJiYgc2VsZWN0b3Iuc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc2VsZWN0b3Iuc3Vic3RyaW5nKDEpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsIHNlbGVjdG9yLnN1YnN0cmluZygxKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdtZXRob2QnLCAncG9zdCcpO1xyXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZW5jdHlwZScsICdtdWx0aXBhcnQvZm9ybS1kYXRhJyk7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ3RydWUnKTtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FjdGlvbicsIHVzZVN5c3RlbVVyaSgnZnVsbCcpKTtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcblxyXG4gICAgICBjb25zdCBjc3JmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgY3NyZi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XHJcbiAgICAgIGNzcmYuc2V0QXR0cmlidXRlKCduYW1lJywgZGF0YSgnY3NyZi10b2tlbicpKTtcclxuICAgICAgY3NyZi5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJzEnKTtcclxuXHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NyZik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4ub3B0aW9ucyB9O1xyXG4gIH1cclxuXHJcbiAgaW5pdENvbXBvbmVudChzdG9yZSA9ICdmb3JtJywgY3VzdG9tID0ge30pIHtcclxuICAgIHJldHVybiBsb2FkQWxwaW5lKChBbHBpbmUpID0+IHtcclxuICAgICAgQWxwaW5lLnN0b3JlKHN0b3JlLCB0aGlzLnVzZVN0YXRlKGN1c3RvbSkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1c2VTdGF0ZShjdXN0b20gPSB7fSkge1xyXG4gICAgY29uc3Qgc3RhdGU6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSlcclxuICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlW2l0ZW1dID0gdGhpc1tpdGVtXS5iaW5kKHRoaXMpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIGN1c3RvbVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgc3VibWl0KFxyXG4gICAgdXJsPzogTnVsbGFibGU8c3RyaW5nPixcclxuICAgIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+PixcclxuICAgIG1ldGhvZD86IE51bGxhYmxlPHN0cmluZz4sXHJcbiAgICBjdXN0b21NZXRob2Q/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgZm9ybSA9IHRoaXMuZWxlbWVudCE7XHJcblxyXG4gICAgaWYgKGN1c3RvbU1ldGhvZCkge1xyXG4gICAgICBsZXQgbWV0aG9kSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W25hbWU9XCJfbWV0aG9kXCJdJyk7XHJcblxyXG4gICAgICBpZiAoIW1ldGhvZElucHV0KSB7XHJcbiAgICAgICAgbWV0aG9kSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIG1ldGhvZElucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsICdfbWV0aG9kJyk7XHJcbiAgICAgICAgbWV0aG9kSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xyXG4gICAgICAgIG1ldGhvZElucHV0LnZhbHVlID0gY3VzdG9tTWV0aG9kO1xyXG5cclxuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKG1ldGhvZElucHV0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtZXRob2RJbnB1dC52YWx1ZSA9IGN1c3RvbU1ldGhvZDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCBkYXRhIGludG8gZm9ybS5cclxuICAgIGlmIChkYXRhKSB7XHJcbiAgICAgIGNvbnN0IGZsYXR0ZWQgPSBVbmljb3JuRm9ybUVsZW1lbnQuZmxhdHRlbk9iamVjdChkYXRhKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGZsYXR0ZWQpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZsYXR0ZWRba2V5XTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gVW5pY29ybkZvcm1FbGVtZW50LmJ1aWxkRmllbGROYW1lKGtleSk7XHJcbiAgICAgICAgdGhpcy5pbmplY3RJbnB1dChmaWVsZE5hbWUsIHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh1cmwpIHtcclxuICAgICAgZm9ybS5zZXRBdHRyaWJ1dGUoJ2FjdGlvbicsIHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICBmb3JtLnNldEF0dHJpYnV0ZSgnbWV0aG9kJywgbWV0aG9kKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2UgcmVxdWVzdFN1Ym1pdCgpIHRvIGZpcmUgc3VibWl0IGV2ZW50LlxyXG4gICAgZm9ybS5yZXF1ZXN0U3VibWl0KCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpbmplY3RJbnB1dChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgIGxldCBpbnB1dCA9IHRoaXMuZWxlbWVudCEucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihgaW5wdXRbbmFtZT1cIiR7bmFtZX1cIl1gKTtcclxuXHJcbiAgICBpZiAoIWlucHV0KSB7XHJcbiAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgbmFtZSk7XHJcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdoaWRkZW4nKTtcclxuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdkYXRhLXJvbGUnLCAndGVtcC1pbnB1dCcpO1xyXG5cclxuICAgICAgdGhpcy5lbGVtZW50IS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSBHRVQgcmVxdWVzdC5cclxuICAgKi9cclxuICBnZXQoXHJcbiAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+LFxyXG4gICAgY3VzdG9tTWV0aG9kPzogTnVsbGFibGU8c3RyaW5nPixcclxuICApOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnN1Ym1pdCh1cmwsIGRhdGEsICdHRVQnLCBjdXN0b21NZXRob2QpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUG9zdCBmb3JtLlxyXG4gICAqL1xyXG4gIHBvc3QoXHJcbiAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+LFxyXG4gICAgY3VzdG9tTWV0aG9kPzogTnVsbGFibGU8c3RyaW5nPixcclxuICApIHtcclxuICAgIGN1c3RvbU1ldGhvZCA9IGN1c3RvbU1ldGhvZCB8fCAnUE9TVCc7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3VibWl0KHVybCwgZGF0YSwgJ1BPU1QnLCBjdXN0b21NZXRob2QpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIFBVVCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHB1dChcclxuICAgIHVybD86IE51bGxhYmxlPHN0cmluZz4sXHJcbiAgICBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4sXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3N0KHVybCwgZGF0YSwgJ1BVVCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIFBBVENIIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcGF0Y2goXHJcbiAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+LFxyXG4gICkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zdCh1cmwsIGRhdGEsICdQQVRDSCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIERFTEVURSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIGRlbGV0ZShcclxuICAgIHVybD86IE51bGxhYmxlPHN0cmluZz4sXHJcbiAgICBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4sXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3N0KHVybCwgZGF0YSwgJ0RFTEVURScpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTM3Mzk3OTJcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYlxyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICovXHJcbiAgc3RhdGljIGZsYXR0ZW5PYmplY3Qob2I6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcclxuICAgIGNvbnN0IHRvUmV0dXJuOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XHJcblxyXG4gICAgZm9yIChsZXQgaSBpbiBvYikge1xyXG4gICAgICBpZiAoIW9iLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgodHlwZW9mIG9iW2ldKSA9PT0gJ29iamVjdCcgJiYgb2JbaV0gIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGZsYXRPYmplY3QgPSB0aGlzLmZsYXR0ZW5PYmplY3Qob2JbaV0pO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB4IGluIGZsYXRPYmplY3QpIHtcclxuICAgICAgICAgIGlmICghZmxhdE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh4KSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0b1JldHVybltpICsgJy8nICsgeF0gPSBmbGF0T2JqZWN0W3hdO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0b1JldHVybltpXSA9IG9iW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYnVpbGRGaWVsZE5hbWUoZmllbGQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgbmFtZXMgPSBmaWVsZC5zcGxpdCgnLycpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0ID0gbmFtZXMuc2hpZnQoKTtcclxuXHJcbiAgICByZXR1cm4gZmlyc3QgKyBuYW1lcy5tYXAobmFtZSA9PiBgWyR7bmFtZX1dYCkuam9pbignJyk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7QUFJTyxNQUFNLG1CQUFtQjtBQUFBLEVBQzlCO0FBQUEsRUFDQTtBQUFBLEVBRUEsWUFDRSxVQUNBLFNBQ0EsVUFBK0IsQ0FBQSxHQUMvQjtBQUVBLFFBQUksQ0FBQyxTQUFTO0FBQ1osZ0JBQVUsU0FBUyxjQUFjLE1BQU07QUFFdkMsVUFBSSxPQUFPLGFBQWEsWUFBWSxTQUFTLFdBQVcsR0FBRyxHQUFHO0FBQzVELGdCQUFRLGFBQWEsTUFBTSxTQUFTLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELGdCQUFRLGFBQWEsUUFBUSxTQUFTLFVBQVUsQ0FBQyxDQUFDO0FBQUEsTUFD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
