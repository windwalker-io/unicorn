document.currentScript&&(window.unicornScriptVersion=document.currentScript.dataset.version,System.constructor.prototype.createScript=function(t){const r=window.unicornScriptVersion;return-1!==t.indexOf("?")?t+="&"+r:t+="?"+r,Object.assign(document.createElement("script"),{src:t})});
//# sourceMappingURL=system-hooks.js.map
