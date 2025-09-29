import { d as defData } from "../utilities/data.js";
function domready(callback) {
  let promise = new Promise((resolve) => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(resolve, 0);
    } else {
      document.addEventListener("DOMContentLoaded", () => resolve());
    }
  });
  if (callback) {
    promise = promise.then(callback);
  }
  return promise;
}
function selectOne(ele) {
  let r;
  if (typeof ele === "string") {
    r = document.querySelector(ele);
  } else {
    r = ele;
  }
  if (!r) {
    return r;
  }
  return r;
}
function selectAll(ele, callback = void 0) {
  if (typeof ele === "string") {
    ele = document.querySelectorAll(ele);
  }
  const resultSet = [].slice.call(ele);
  if (callback) {
    return resultSet.map((el) => callback(el) || el);
  }
  return resultSet;
}
function getBoundedInstance(selector, name, callback = () => null) {
  const element = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!element) {
    return null;
  }
  return defData(element, name, callback);
}
function getBoundedInstanceList(selector, name, callback = () => null) {
  const items = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return Array.from(items).map((ele) => getBoundedInstance(ele, name, callback));
}
function module(ele, name, callback = () => null) {
  if (typeof ele === "string") {
    return getBoundedInstanceList(ele, name, callback);
  }
  if (ele instanceof HTMLElement) {
    return getBoundedInstance(ele, name, callback);
  }
  return getBoundedInstanceList(ele, name, callback);
}
function h(element, attrs = {}, content = void 0) {
  const ele = document.createElement(element);
  for (let i in attrs) {
    const v = attrs[i];
    ele.setAttribute(i, v);
  }
  if (content !== null) {
    ele.innerHTML = content;
  }
  return ele;
}
function html(html2) {
  const div = document.createElement("div");
  div.innerHTML = html2;
  return div.children[0];
}
function delegate(wrapper, selector, eventName, callback) {
  if (typeof selector === "undefined" || selector === "") {
    throw new Error("The provided selector is empty.");
  }
  if (typeof callback === "undefined" || typeof callback !== "function") {
    throw new Error("Please specify an callback.");
  }
  const delegationSelectorsMap = {};
  const wrapperElement = selectOne(wrapper);
  wrapperElement?.addEventListener(eventName, function(event) {
    let element = event.target;
    let forceBreak = false;
    while (element && element !== wrapperElement) {
      for (const selector2 in delegationSelectorsMap) {
        if (element.matches(selector2)) {
          event.stopPropagation = function() {
            forceBreak = true;
          };
          Object.defineProperty(
            event,
            "currentTarget",
            {
              get() {
                return element;
              }
            }
          );
          const callbackList = delegationSelectorsMap[selector2];
          callbackList.forEach(function(callback2) {
            callback2(event);
          });
        }
      }
      if (forceBreak) {
        break;
      }
      element = element.parentElement;
    }
  });
  if (!delegationSelectorsMap[selector]) {
    delegationSelectorsMap[selector] = [callback];
  } else {
    delegationSelectorsMap[selector].push(callback);
  }
  return function unsubscribe() {
    if (!delegationSelectorsMap[selector]) {
      return;
    }
    if (delegationSelectorsMap[selector].length >= 2) {
      delegationSelectorsMap[selector] = delegationSelectorsMap[selector].filter((cb) => cb !== callback);
    } else {
      delete delegationSelectorsMap[selector];
    }
  };
}
function injectCssToDocument(doc, ...css) {
  if (!(doc instanceof Document)) {
    css.push(doc);
    doc = document;
  }
  const styles = css.map((css2) => {
    if (typeof css2 === "string") {
      const style = new CSSStyleSheet();
      style.replaceSync(css2);
      return style;
    }
    return css2;
  });
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, ...styles];
  return styles;
}
export {
  selectAll as a,
  getBoundedInstanceList as b,
  html as c,
  domready as d,
  delegate as e,
  getBoundedInstance as g,
  h,
  injectCssToDocument as i,
  module as m,
  selectOne as s
};
