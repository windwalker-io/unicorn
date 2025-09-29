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
