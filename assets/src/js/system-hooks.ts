function hookSystemJS() {
  // @ts-ignore
  System.constructor.prototype.createScript = function (url) {
    // @ts-ignore
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
  // @ts-ignore
  window.unicornScriptVersion = document.currentScript.dataset.version;
  hookSystemJS();
}
