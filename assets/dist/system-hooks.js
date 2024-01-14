function hookSystemJS(version) {
  System.constructor.prototype.createScript = function (url) {
    if (url.indexOf('?') !== -1) {
      url += '&' + version;
    } else {
      url += '?' + version;
    }
    return Object.assign(document.createElement('script'), {
      src: url
    });
  };
}
if (document.currentScript) {
  hookSystemJS(document.currentScript.dataset.version);
}
//# sourceMappingURL=system-hooks.js.map
