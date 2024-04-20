function hookSystemJS() {
  System.constructor.prototype.createScript = function (url) {
    const v = window.unicornScriptVersion;

    if (url.indexOf('?') !== -1) {
      url += '&' + v;
    } else {
      url += '?' + v;
    }
    return Object.assign(document.createElement('script'), { src: url });
  }
}

if (document.currentScript) {
  window.unicornScriptVersion = document.currentScript.dataset.version;
  hookSystemJS();
}
