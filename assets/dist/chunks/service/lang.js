import { d as data } from "../data.js";
import { i as isDebug } from "./helper.js";
import { s as sprintfExports } from "../legacy/legacy.js";
let lang;
function useLang() {
  return lang ??= new UnicornLang();
}
function trans(id, ...args) {
  return useLang().trans(id, ...args);
}
function __(id, ...args) {
  return trans(id, ...args);
}
class UnicornLang {
  /**
   * Translate a string.
   */
  trans(id, ...args) {
    const key = this.normalize(id);
    let translated = this.get(key) || "";
    translated = this.replace(translated, args);
    return translated !== "" ? translated : this.wrapDebug(id, false);
  }
  replace(str, args) {
    let replacements = {};
    let values = [];
    for (const arg of args) {
      if (typeof arg === "object") {
        replacements = { ...replacements, ...arg };
      } else {
        values.push(arg);
      }
    }
    if (values.length) {
      str = sprintfExports.vsprintf(str, values);
    }
    if (Object.values(replacements).length) {
      for (const key in replacements) {
        let value = replacements[key];
        if (typeof value === "function") {
          value = value();
        }
        str = str.replace(new RegExp(":" + key, "g"), String(value));
      }
    }
    return str;
  }
  /**
   * Find text.
   */
  get(id) {
    const strings = this.getStrings();
    if (strings[id]) {
      return strings[id];
    }
    return null;
  }
  /**
   * Has language key.
   */
  has(key) {
    const strings = this.getStrings();
    return strings[key] !== void 0;
  }
  /**
   * Add language key.
   */
  add(key, value) {
    const strings = this.getStrings();
    strings[this.normalize(key)] = value;
    data("unicorn.languages", strings);
    return this;
  }
  /**
   * Replace all symbols to dot(.).
   */
  normalize(text) {
    return text.replace(/[^A-Z0-9]+/ig, ".");
  }
  wrapDebug(text, success) {
    if (isDebug()) {
      if (success) {
        return "**" + text + "**";
      }
      return "??" + text + "??";
    }
    return text;
  }
  getStrings() {
    return data("unicorn.languages") || {};
  }
}
export {
  __ as _,
  trans as t,
  useLang as u
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2UvbGFuZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XHJcbmltcG9ydCB7IGlzRGVidWcgfSBmcm9tICcuLy9oZWxwZXInO1xyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyB2c3ByaW50ZiB9IGZyb20gJ3NwcmludGYtanMnO1xyXG5cclxubGV0IGxhbmc6IFVuaWNvcm5MYW5nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUxhbmcoKSB7XHJcbiAgcmV0dXJuIGxhbmcgPz89IG5ldyBVbmljb3JuTGFuZygpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdHJhbnMoaWQ6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICByZXR1cm4gdXNlTGFuZygpLnRyYW5zKGlkLCAuLi5hcmdzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fKGlkOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgcmV0dXJuIHRyYW5zKGlkLCAuLi5hcmdzKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29ybkxhbmcge1xyXG4gIC8qKlxyXG4gICAqIFRyYW5zbGF0ZSBhIHN0cmluZy5cclxuICAgKi9cclxuICB0cmFucyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLm5vcm1hbGl6ZShpZCk7XHJcblxyXG4gICAgbGV0IHRyYW5zbGF0ZWQgPSB0aGlzLmdldChrZXkpIHx8ICcnO1xyXG5cclxuICAgIHRyYW5zbGF0ZWQgPSB0aGlzLnJlcGxhY2UodHJhbnNsYXRlZCwgYXJncyk7XHJcblxyXG4gICAgcmV0dXJuIHRyYW5zbGF0ZWQgIT09ICcnID8gdHJhbnNsYXRlZCA6IHRoaXMud3JhcERlYnVnKGlkLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgcmVwbGFjZShzdHI6IHN0cmluZywgYXJnczogYW55W10pOiBzdHJpbmcge1xyXG4gICAgbGV0IHJlcGxhY2VtZW50czogRGljdGlvbmFyeTxhbnk+ID0ge307XHJcbiAgICBsZXQgdmFsdWVzOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcclxuICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmVwbGFjZW1lbnRzID0geyAuLi5yZXBsYWNlbWVudHMsIC4uLmFyZyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlcy5wdXNoKGFyZyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsdWVzLmxlbmd0aCkge1xyXG4gICAgICBzdHIgPSB2c3ByaW50ZihzdHIsIHZhbHVlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKE9iamVjdC52YWx1ZXMocmVwbGFjZW1lbnRzKS5sZW5ndGgpIHtcclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVwbGFjZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gcmVwbGFjZW1lbnRzW2tleV07XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIHZhbHVlID0gdmFsdWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJzonICsga2V5LCAnZycpLCBTdHJpbmcodmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaW5kIHRleHQuXHJcbiAgICovXHJcbiAgZ2V0KGlkOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcclxuXHJcbiAgICBpZiAoc3RyaW5nc1tpZF0pIHtcclxuICAgICAgcmV0dXJuIHN0cmluZ3NbaWRdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFzIGxhbmd1YWdlIGtleS5cclxuICAgKi9cclxuICBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcclxuXHJcbiAgICByZXR1cm4gc3RyaW5nc1trZXldICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgbGFuZ3VhZ2Uga2V5LlxyXG4gICAqL1xyXG4gIGFkZChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHRoaXMge1xyXG4gICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMuZ2V0U3RyaW5ncygpO1xyXG5cclxuICAgIHN0cmluZ3NbdGhpcy5ub3JtYWxpemUoa2V5KV0gPSB2YWx1ZTtcclxuXHJcbiAgICBkYXRhKCd1bmljb3JuLmxhbmd1YWdlcycsIHN0cmluZ3MpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVwbGFjZSBhbGwgc3ltYm9scyB0byBkb3QoLikuXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIG5vcm1hbGl6ZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvW15BLVowLTldKy9pZywgJy4nKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCB3cmFwRGVidWcodGV4dDogc3RyaW5nLCBzdWNjZXNzOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgIGlmIChpc0RlYnVnKCkpIHtcclxuICAgICAgaWYgKHN1Y2Nlc3MpIHtcclxuICAgICAgICByZXR1cm4gJyoqJyArIHRleHQgKyAnKionO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gJz8/JyArIHRleHQgKyAnPz8nO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RyaW5ncygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgIHJldHVybiBkYXRhKCd1bmljb3JuLmxhbmd1YWdlcycpIHx8IHt9O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsidnNwcmludGYiXSwibWFwcGluZ3MiOiI7OztBQUtBLElBQUk7QUFFRyxTQUFTLFVBQVU7QUFDeEIsU0FBTyxTQUFTLElBQUksWUFBQTtBQUN0QjtBQUVPLFNBQVMsTUFBTSxPQUFlLE1BQWE7QUFDaEQsU0FBTyxRQUFBLEVBQVUsTUFBTSxJQUFJLEdBQUcsSUFBSTtBQUNwQztBQUVPLFNBQVMsR0FBRyxPQUFlLE1BQWE7QUFDN0MsU0FBTyxNQUFNLElBQUksR0FBRyxJQUFJO0FBQzFCO0FBRUEsTUFBcUIsWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSS9CLE1BQU0sT0FBZSxNQUFxQjtBQUN4QyxVQUFNLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFFN0IsUUFBSSxhQUFhLEtBQUssSUFBSSxHQUFHLEtBQUs7QUFFbEMsaUJBQWEsS0FBSyxRQUFRLFlBQVksSUFBSTtBQUUxQyxXQUFPLGVBQWUsS0FBSyxhQUFhLEtBQUssVUFBVSxJQUFJLEtBQUs7QUFBQSxFQUNsRTtBQUFBLEVBRVUsUUFBUSxLQUFhLE1BQXFCO0FBQ2xELFFBQUksZUFBZ0MsQ0FBQTtBQUNwQyxRQUFJLFNBQWdCLENBQUE7QUFFcEIsZUFBVyxPQUFPLE1BQU07QUFDdEIsVUFBSSxPQUFPLFFBQVEsVUFBVTtBQUMzQix1QkFBZSxFQUFFLEdBQUcsY0FBYyxHQUFHLElBQUE7QUFBQSxNQUN2QyxPQUFPO0FBQ0wsZUFBTyxLQUFLLEdBQUc7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFFQSxRQUFJLE9BQU8sUUFBUTtBQUNqQixZQUFNQSxlQUFBQSxTQUFTLEtBQUssTUFBTTtBQUFBLElBQzVCO0FBRUEsUUFBSSxPQUFPLE9BQU8sWUFBWSxFQUFFLFFBQVE7QUFDdEMsaUJBQVcsT0FBTyxjQUFjO0FBQzlCLFlBQUksUUFBUSxhQUFhLEdBQUc7QUFFNUIsWUFBSSxPQUFPLFVBQVUsWUFBWTtBQUMvQixrQkFBUSxNQUFBO0FBQUEsUUFDVjtBQUVBLGNBQU0sSUFBSSxRQUFRLElBQUksT0FBTyxNQUFNLEtBQUssR0FBRyxHQUFHLE9BQU8sS0FBSyxDQUFDO0FBQUEsTUFDN0Q7QUFBQSxJQUNGO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLElBQUksSUFBMkI7QUFDN0IsVUFBTSxVQUFVLEtBQUssV0FBQTtBQUVyQixRQUFJLFFBQVEsRUFBRSxHQUFHO0FBQ2YsYUFBTyxRQUFRLEVBQUU7QUFBQSxJQUNuQjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxJQUFJLEtBQXNCO0FBQ3hCLFVBQU0sVUFBVSxLQUFLLFdBQUE7QUFFckIsV0FBTyxRQUFRLEdBQUcsTUFBTTtBQUFBLEVBQzFCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxJQUFJLEtBQWEsT0FBcUI7QUFDcEMsVUFBTSxVQUFVLEtBQUssV0FBQTtBQUVyQixZQUFRLEtBQUssVUFBVSxHQUFHLENBQUMsSUFBSTtBQUUvQixTQUFLLHFCQUFxQixPQUFPO0FBRWpDLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLVSxVQUFVLE1BQXNCO0FBQ3hDLFdBQU8sS0FBSyxRQUFRLGdCQUFnQixHQUFHO0FBQUEsRUFDekM7QUFBQSxFQUVVLFVBQVUsTUFBYyxTQUEwQjtBQUMxRCxRQUFJLFdBQVc7QUFDYixVQUFJLFNBQVM7QUFDWCxlQUFPLE9BQU8sT0FBTztBQUFBLE1BQ3ZCO0FBRUEsYUFBTyxPQUFPLE9BQU87QUFBQSxJQUN2QjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxhQUFxQztBQUNuQyxXQUFPLEtBQUssbUJBQW1CLEtBQUssQ0FBQTtBQUFBLEVBQ3RDO0FBQ0Y7In0=
