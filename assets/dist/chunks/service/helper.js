import { d as data } from "../data.js";
import "../composable/useQueue.js";
function forceArray(item) {
  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}
function debounce(handler, wait2 = 1) {
  let timer, result;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => result = handler.call(this, ...args), wait2);
    return result;
  };
}
function throttle(handler, wait2 = 1) {
  return function(...args) {
    {
      return handler.call(this, ...args);
    }
  };
}
function isDebug() {
  return Boolean(data("windwalker.debug"));
}
function nextTick(callback) {
  return Promise.resolve().then(callback ?? (() => null));
}
function wait(...promisee) {
  return Promise.all(promisee);
}
export {
  debounce as d,
  forceArray as f,
  isDebug as i,
  nextTick as n,
  throttle as t,
  wait as w
};
