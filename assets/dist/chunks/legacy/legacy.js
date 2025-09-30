import { u as useQueue, b as simpleConfirm, c as simpleAlert, n as numberFormat, d as uid, t as tid } from "../composable/useQueue.js";
import { L as LegacyLoader } from "./loader.js";
import { a as animateTo } from "../service/animate.js";
import { r as renderMessage, c as clearMessages, n as notify, a as clearNotifies, l as loadAlpine, i as initAlpineComponent, p as prepareAlpine, m as mark, s as slideUp, b as slideDown, d as slideToggle, f as fadeOut, e as fadeIn, h as highlight, g as useColorPicker, j as useDisableOnSubmit, k as useDisableIfStackNotEmpty, o as useKeepAlive } from "../service/ui.js";
import { u as useFormValidation, a as addGlobalValidator, b as useFieldValidationSync, c as useFormValidationSync } from "../composable/useValidation.js";
import { u as useSystemUri, a as useAssetUri } from "../service/uri.js";
import { d as domready, s as selectOne, a as selectAll, g as getBoundedInstance, b as getBoundedInstanceList, m as module, h, c as html, e as delegate } from "../service/dom.js";
import { d as debounce, t as throttle, i as isDebug } from "../service/helper.js";
import { b as base64UrlEncode, a as base64UrlDecode, s as serial } from "../service/crypto.js";
import { u as useCheckboxesMultiSelect } from "../composable/useCheckboxesMultiSelect.js";
import { u as useBs5Tooltip } from "../composable/useUIBootstrap5.js";
import { u as useFormAsync, a as useForm } from "../composable/useForm.js";
import { u as useGridAsync, a as useGrid } from "../composable/useGrid.js";
import { u as useHttpClient } from "../composable/useHttp.js";
import { _ as __ } from "../service/lang.js";
import { r as route } from "../service/router.js";
import { u as useUniDirective } from "../composable/useUniDirective.js";
import { u as useStack } from "../composable/useStack.js";
import { u as useTomSelect } from "../composable/useTomSelect.js";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var sprintf = {};
var hasRequiredSprintf;
function requireSprintf() {
  if (hasRequiredSprintf) return sprintf;
  hasRequiredSprintf = 1;
  (function(exports) {
    !(function() {
      var re = {
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
      };
      function sprintf2(key) {
        return sprintf_format(sprintf_parse(key), arguments);
      }
      function vsprintf(fmt, argv) {
        return sprintf2.apply(null, [fmt].concat(argv || []));
      }
      function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = "", i, k, ph, pad, pad_character, pad_length, is_positive, sign;
        for (i = 0; i < tree_length; i++) {
          if (typeof parse_tree[i] === "string") {
            output += parse_tree[i];
          } else if (typeof parse_tree[i] === "object") {
            ph = parse_tree[i];
            if (ph.keys) {
              arg = argv[cursor];
              for (k = 0; k < ph.keys.length; k++) {
                if (arg == void 0) {
                  throw new Error(sprintf2('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
                }
                arg = arg[ph.keys[k]];
              }
            } else if (ph.param_no) {
              arg = argv[ph.param_no];
            } else {
              arg = argv[cursor++];
            }
            if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
              arg = arg();
            }
            if (re.numeric_arg.test(ph.type) && (typeof arg !== "number" && isNaN(arg))) {
              throw new TypeError(sprintf2("[sprintf] expecting number but found %T", arg));
            }
            if (re.number.test(ph.type)) {
              is_positive = arg >= 0;
            }
            switch (ph.type) {
              case "b":
                arg = parseInt(arg, 10).toString(2);
                break;
              case "c":
                arg = String.fromCharCode(parseInt(arg, 10));
                break;
              case "d":
              case "i":
                arg = parseInt(arg, 10);
                break;
              case "j":
                arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
                break;
              case "e":
                arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
                break;
              case "f":
                arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
                break;
              case "g":
                arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
                break;
              case "o":
                arg = (parseInt(arg, 10) >>> 0).toString(8);
                break;
              case "s":
                arg = String(arg);
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "t":
                arg = String(!!arg);
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "T":
                arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "u":
                arg = parseInt(arg, 10) >>> 0;
                break;
              case "v":
                arg = arg.valueOf();
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "x":
                arg = (parseInt(arg, 10) >>> 0).toString(16);
                break;
              case "X":
                arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                break;
            }
            if (re.json.test(ph.type)) {
              output += arg;
            } else {
              if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                sign = is_positive ? "+" : "-";
                arg = arg.toString().replace(re.sign, "");
              } else {
                sign = "";
              }
              pad_character = ph.pad_char ? ph.pad_char === "0" ? "0" : ph.pad_char.charAt(1) : " ";
              pad_length = ph.width - (sign + arg).length;
              pad = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : "" : "";
              output += ph.align ? sign + arg + pad : pad_character === "0" ? sign + pad + arg : pad + sign + arg;
            }
          }
        }
        return output;
      }
      var sprintf_cache = /* @__PURE__ */ Object.create(null);
      function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
          return sprintf_cache[fmt];
        }
        var _fmt = fmt, match, parse_tree = [], arg_names = 0;
        while (_fmt) {
          if ((match = re.text.exec(_fmt)) !== null) {
            parse_tree.push(match[0]);
          } else if ((match = re.modulo.exec(_fmt)) !== null) {
            parse_tree.push("%");
          } else if ((match = re.placeholder.exec(_fmt)) !== null) {
            if (match[2]) {
              arg_names |= 1;
              var field_list = [], replacement_field = match[2], field_match = [];
              if ((field_match = re.key.exec(replacement_field)) !== null) {
                field_list.push(field_match[1]);
                while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                  if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                    field_list.push(field_match[1]);
                  } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                    field_list.push(field_match[1]);
                  } else {
                    throw new SyntaxError("[sprintf] failed to parse named argument key");
                  }
                }
              } else {
                throw new SyntaxError("[sprintf] failed to parse named argument key");
              }
              match[2] = field_list;
            } else {
              arg_names |= 2;
            }
            if (arg_names === 3) {
              throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
            }
            parse_tree.push(
              {
                placeholder: match[0],
                param_no: match[1],
                keys: match[2],
                sign: match[3],
                pad_char: match[4],
                align: match[5],
                width: match[6],
                precision: match[7],
                type: match[8]
              }
            );
          } else {
            throw new SyntaxError("[sprintf] unexpected placeholder");
          }
          _fmt = _fmt.substring(match[0].length);
        }
        return sprintf_cache[fmt] = parse_tree;
      }
      {
        exports["sprintf"] = sprintf2;
        exports["vsprintf"] = vsprintf;
      }
      if (typeof window !== "undefined") {
        window["sprintf"] = sprintf2;
        window["vsprintf"] = vsprintf;
      }
    })();
  })(sprintf);
  return sprintf;
}
var sprintfExports = /* @__PURE__ */ requireSprintf();
async function useLegacyMethods(app) {
  const http = await useHttpClient();
  app.use(LegacyLoader);
  handleUri(app);
  handlerHelper(app);
  handleCrypto(app);
  app.__ = __;
  app.trans = __;
  app.route = route;
  app.$http = http;
  app.directive = useUniDirective;
  app.animate = animateTo;
  app.$animation = { to: animateTo };
  app.addMessage = renderMessage;
  app.clearMessages = clearMessages;
  app.notify = notify;
  app.clearNotifies = clearNotifies;
  app.loadAlpine = loadAlpine;
  app.initAlpine = initAlpineComponent;
  app.beforeAlpineInit = prepareAlpine;
  app.prepareAlpine = prepareAlpine;
  handleUI(app);
  await handleFormGrid(app);
  app.formValidation = useFormValidation;
  app.$validation = {
    get: useFormValidationSync,
    getField: useFieldValidationSync,
    addGlobalValidator,
    import: () => useFormValidation()
  };
  app.stack = useStack;
  app.queue = useQueue;
}
function handleCrypto(app) {
  app.base64Encode = base64UrlEncode;
  app.base64Decode = base64UrlDecode;
  app.uid = uid;
  app.tid = tid;
  app.serial = serial;
}
function handleUri(app) {
  app.uri = useSystemUri;
  app.asset = useAssetUri;
}
function handlerHelper(app) {
  app.domready = domready;
  app.selectOne = selectOne;
  app.selectAll = selectAll;
  app.each = selectAll;
  app.getBoundedInstance = getBoundedInstance;
  app.getBoundedInstanceList = getBoundedInstanceList;
  app.module = module;
  app.h = h;
  app.html = html;
  app.delegate = delegate;
  app.debounce = debounce;
  app.throttle = throttle;
  app.isDebug = isDebug;
  app.confirm = simpleConfirm;
  app.alert = simpleAlert;
  app.numberFormat = numberFormat;
  app.sprintf = sprintfExports.sprintf;
  app.vsprintf = sprintfExports.vsprintf;
}
function handleUI(app) {
  app.$ui ??= {};
  app.$ui.addMessage = renderMessage;
  app.$ui.clearMessages = clearMessages;
  app.$ui.notify = notify;
  app.$ui.clearNotifies = clearNotifies;
  app.$ui.loadAlpine = loadAlpine;
  app.$ui.initAlpine = initAlpineComponent;
  app.$ui.beforeAlpineInit = prepareAlpine;
  app.$ui.prepareAlpine = prepareAlpine;
  app.$ui.mark = mark;
  app.$ui.tomSelect = useTomSelect;
  app.$ui.slideUp = slideUp;
  app.$ui.slideDown = slideDown;
  app.$ui.slideToggle = slideToggle;
  app.$ui.fadeOut = fadeOut;
  app.$ui.fadeIn = fadeIn;
  app.$ui.highlight = highlight;
  app.$ui.colorPicker = useColorPicker;
  app.$ui.disableOnSubmit = useDisableOnSubmit;
  app.$ui.disableIfStackNotEmpty = useDisableIfStackNotEmpty;
  app.$ui.checkboxesMultiSelect = useCheckboxesMultiSelect;
  app.$ui.keepAlive = useKeepAlive;
  app.$ui.bootstrap = {
    tooltip: useBs5Tooltip
  };
}
async function handleFormGrid(app) {
  await useFormAsync();
  await useGridAsync();
  app.form = useForm;
  app.grid = useGrid;
}
const legacy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  useLegacyMethods
}, /* @__PURE__ */ (() => Symbol.toStringTag)(), { value: "Module" }));
export {
  getDefaultExportFromCjs as g,
  legacy as l,
  sprintfExports as s
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ByaW50Zi1qcy9zcmMvc3ByaW50Zi5qcyIsIi4uLy4uLy4uL3NyYy9sZWdhY3kvbGVnYWN5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3aW5kb3csIGV4cG9ydHMsIGRlZmluZSAqL1xuXG4hZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICB2YXIgcmUgPSB7XG4gICAgICAgIG5vdF9zdHJpbmc6IC9bXnNdLyxcbiAgICAgICAgbm90X2Jvb2w6IC9bXnRdLyxcbiAgICAgICAgbm90X3R5cGU6IC9bXlRdLyxcbiAgICAgICAgbm90X3ByaW1pdGl2ZTogL1tedl0vLFxuICAgICAgICBudW1iZXI6IC9bZGllZmddLyxcbiAgICAgICAgbnVtZXJpY19hcmc6IC9bYmNkaWVmZ3V4WF0vLFxuICAgICAgICBqc29uOiAvW2pdLyxcbiAgICAgICAgbm90X2pzb246IC9bXmpdLyxcbiAgICAgICAgdGV4dDogL15bXlxceDI1XSsvLFxuICAgICAgICBtb2R1bG86IC9eXFx4MjV7Mn0vLFxuICAgICAgICBwbGFjZWhvbGRlcjogL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXildKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWdpam9zdFR1dnhYXSkvLFxuICAgICAgICBrZXk6IC9eKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGtleV9hY2Nlc3M6IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGluZGV4X2FjY2VzczogL15cXFsoXFxkKylcXF0vLFxuICAgICAgICBzaWduOiAvXlsrLV0vXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50ZihrZXkpIHtcbiAgICAgICAgLy8gYGFyZ3VtZW50c2AgaXMgbm90IGFuIGFycmF5LCBidXQgc2hvdWxkIGJlIGZpbmUgZm9yIHRoaXMgY2FsbFxuICAgICAgICByZXR1cm4gc3ByaW50Zl9mb3JtYXQoc3ByaW50Zl9wYXJzZShrZXkpLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdnNwcmludGYoZm10LCBhcmd2KSB7XG4gICAgICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIFtmbXRdLmNvbmNhdChhcmd2IHx8IFtdKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmX2Zvcm1hdChwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSAxLCB0cmVlX2xlbmd0aCA9IHBhcnNlX3RyZWUubGVuZ3RoLCBhcmcsIG91dHB1dCA9ICcnLCBpLCBrLCBwaCwgcGFkLCBwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoLCBpc19wb3NpdGl2ZSwgc2lnblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZV90cmVlW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBwYXJzZV90cmVlW2ldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgcGFyc2VfdHJlZVtpXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBwaCA9IHBhcnNlX3RyZWVbaV0gLy8gY29udmVuaWVuY2UgcHVycG9zZXMgb25seVxuICAgICAgICAgICAgICAgIGlmIChwaC5rZXlzKSB7IC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdXG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBwaC5rZXlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJpbnRmKCdbc3ByaW50Zl0gQ2Fubm90IGFjY2VzcyBwcm9wZXJ0eSBcIiVzXCIgb2YgdW5kZWZpbmVkIHZhbHVlIFwiJXNcIicsIHBoLmtleXNba10sIHBoLmtleXNbay0xXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmdbcGgua2V5c1trXV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwaC5wYXJhbV9ubykgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltwaC5wYXJhbV9ub11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGltcGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5ub3RfdHlwZS50ZXN0KHBoLnR5cGUpICYmIHJlLm5vdF9wcmltaXRpdmUudGVzdChwaC50eXBlKSAmJiBhcmcgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcoKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1lcmljX2FyZy50ZXN0KHBoLnR5cGUpICYmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyAmJiBpc05hTihhcmcpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHNwcmludGYoJ1tzcHJpbnRmXSBleHBlY3RpbmcgbnVtYmVyIGJ1dCBmb3VuZCAlVCcsIGFyZykpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KHBoLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzX3Bvc2l0aXZlID0gYXJnID49IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHBoLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKS50b1N0cmluZygyKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGFyZywgMTApKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2knOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2onOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnLCBudWxsLCBwaC53aWR0aCA/IHBhcnNlSW50KHBoLndpZHRoKSA6IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IHBhcnNlRmxvYXQoYXJnKS50b0V4cG9uZW50aWFsKHBoLnByZWNpc2lvbikgOiBwYXJzZUZsb2F0KGFyZykudG9FeHBvbmVudGlhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IHBhcnNlRmxvYXQoYXJnKS50b0ZpeGVkKHBoLnByZWNpc2lvbikgOiBwYXJzZUZsb2F0KGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2cnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gU3RyaW5nKE51bWJlcihhcmcudG9QcmVjaXNpb24ocGgucHJlY2lzaW9uKSkpIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoOClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nKGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZyghIWFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKSA+Pj4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmUuanNvbi50ZXN0KHBoLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChwaC50eXBlKSAmJiAoIWlzX3Bvc2l0aXZlIHx8IHBoLnNpZ24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gaXNfcG9zaXRpdmUgPyAnKycgOiAnLSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpLnJlcGxhY2UocmUuc2lnbiwgJycpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gJydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gcGgucGFkX2NoYXIgPyBwaC5wYWRfY2hhciA9PT0gJzAnID8gJzAnIDogcGgucGFkX2NoYXIuY2hhckF0KDEpIDogJyAnXG4gICAgICAgICAgICAgICAgICAgIHBhZF9sZW5ndGggPSBwaC53aWR0aCAtIChzaWduICsgYXJnKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgcGFkID0gcGgud2lkdGggPyAocGFkX2xlbmd0aCA+IDAgPyBwYWRfY2hhcmFjdGVyLnJlcGVhdChwYWRfbGVuZ3RoKSA6ICcnKSA6ICcnXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBwaC5hbGlnbiA/IHNpZ24gKyBhcmcgKyBwYWQgOiAocGFkX2NoYXJhY3RlciA9PT0gJzAnID8gc2lnbiArIHBhZCArIGFyZyA6IHBhZCArIHNpZ24gKyBhcmcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRcbiAgICB9XG5cbiAgICB2YXIgc3ByaW50Zl9jYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIGZ1bmN0aW9uIHNwcmludGZfcGFyc2UoZm10KSB7XG4gICAgICAgIGlmIChzcHJpbnRmX2NhY2hlW2ZtdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBzcHJpbnRmX2NhY2hlW2ZtdF1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfZm10ID0gZm10LCBtYXRjaCwgcGFyc2VfdHJlZSA9IFtdLCBhcmdfbmFtZXMgPSAwXG4gICAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gcmUudGV4dC5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaFswXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IHJlLm1vZHVsby5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaCgnJScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5wbGFjZWhvbGRlci5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMVxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXkuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXlfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmluZGV4X2FjY2Vzcy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gZmFpbGVkIHRvIHBhcnNlIG5hbWVkIGFyZ3VtZW50IGtleScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gZmFpbGVkIHRvIHBhcnNlIG5hbWVkIGFyZ3VtZW50IGtleScpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW3NwcmludGZdIG1peGluZyBwb3NpdGlvbmFsIGFuZCBuYW1lZCBwbGFjZWhvbGRlcnMgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCcpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogbWF0Y2hbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbV9ubzogICAgbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzOiAgICAgICAgbWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduOiAgICAgICAgbWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcjogICAgbWF0Y2hbNF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbjogICAgICAgbWF0Y2hbNV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogICAgICAgbWF0Y2hbNl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb246ICAgbWF0Y2hbN10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAgICAgICAgbWF0Y2hbOF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIHVuZXhwZWN0ZWQgcGxhY2Vob2xkZXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2ZtdCA9IF9mbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ByaW50Zl9jYWNoZVtmbXRdID0gcGFyc2VfdHJlZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4cG9ydCB0byBlaXRoZXIgYnJvd3NlciBvciBub2RlLmpzXG4gICAgICovXG4gICAgLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4cG9ydHNbJ3NwcmludGYnXSA9IHNwcmludGZcbiAgICAgICAgZXhwb3J0c1sndnNwcmludGYnXSA9IHZzcHJpbnRmXG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB3aW5kb3dbJ3NwcmludGYnXSA9IHNwcmludGZcbiAgICAgICAgd2luZG93Wyd2c3ByaW50ZiddID0gdnNwcmludGZcblxuICAgICAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NwcmludGYnOiBzcHJpbnRmLFxuICAgICAgICAgICAgICAgICAgICAndnNwcmludGYnOiB2c3ByaW50ZlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBxdW90ZS1wcm9wcyAqL1xufSgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4iLCJpbXBvcnQgeyBudW1iZXJGb3JtYXQgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcclxuaW1wb3J0IHsgc3ByaW50ZiwgdnNwcmludGYgfSBmcm9tICdzcHJpbnRmLWpzJztcclxuaW1wb3J0IHtcclxuICBhZGRHbG9iYWxWYWxpZGF0b3IsXHJcbiAgdXNlQnM1VG9vbHRpcCxcclxuICB1c2VDaGVja2JveGVzTXVsdGlTZWxlY3QsXHJcbiAgdXNlRmllbGRWYWxpZGF0aW9uU3luYyxcclxuICB1c2VGb3JtLFxyXG4gIHVzZUZvcm1Bc3luYyxcclxuICB1c2VGb3JtVmFsaWRhdGlvbixcclxuICB1c2VGb3JtVmFsaWRhdGlvblN5bmMsXHJcbiAgdXNlR3JpZCxcclxuICB1c2VHcmlkQXN5bmMsXHJcbiAgdXNlSHR0cENsaWVudCxcclxuICB1c2VRdWV1ZSxcclxuICB1c2VTdGFjayxcclxuICB1c2VUb21TZWxlY3QsXHJcbiAgdXNlVW5pRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7XHJcbiAgX18sXHJcbiAgYW5pbWF0ZVRvLFxyXG4gIGJhc2U2NFVybERlY29kZSxcclxuICBiYXNlNjRVcmxFbmNvZGUsXHJcbiAgY2xlYXJNZXNzYWdlcyxcclxuICBjbGVhck5vdGlmaWVzLFxyXG4gIGRlYm91bmNlLFxyXG4gIGRlbGVnYXRlLFxyXG4gIGRvbXJlYWR5LFxyXG4gIGZhZGVJbixcclxuICBmYWRlT3V0LFxyXG4gIGdldEJvdW5kZWRJbnN0YW5jZSxcclxuICBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0LFxyXG4gIGgsXHJcbiAgaGlnaGxpZ2h0LFxyXG4gIGh0bWwsXHJcbiAgaW5pdEFscGluZUNvbXBvbmVudCxcclxuICBpc0RlYnVnLFxyXG4gIGxvYWRBbHBpbmUsXHJcbiAgbWFyayxcclxuICBtb2R1bGUsXHJcbiAgbm90aWZ5LFxyXG4gIHByZXBhcmVBbHBpbmUsXHJcbiAgcmVuZGVyTWVzc2FnZSxcclxuICByb3V0ZSxcclxuICBzZWxlY3RBbGwsXHJcbiAgc2VsZWN0T25lLFxyXG4gIHNlcmlhbCxcclxuICBzaW1wbGVBbGVydCxcclxuICBzaW1wbGVDb25maXJtLFxyXG4gIHNsaWRlRG93bixcclxuICBzbGlkZVRvZ2dsZSxcclxuICBzbGlkZVVwLFxyXG4gIHRocm90dGxlLFxyXG4gIHRpZCxcclxuICB1aWQsXHJcbiAgdXNlQXNzZXRVcmksXHJcbiAgdXNlQ29sb3JQaWNrZXIsXHJcbiAgdXNlRGlzYWJsZUlmU3RhY2tOb3RFbXB0eSxcclxuICB1c2VEaXNhYmxlT25TdWJtaXQsXHJcbiAgdXNlS2VlcEFsaXZlLFxyXG4gIHVzZVN5c3RlbVVyaVxyXG59IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBMZWdhY3lMb2FkZXIgfSBmcm9tICcuL2xvYWRlcic7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTGVnYWN5TWV0aG9kcyhhcHA6IGFueSkge1xyXG4gIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VIdHRwQ2xpZW50KCk7XHJcblxyXG4gIGFwcC51c2UoTGVnYWN5TG9hZGVyKTtcclxuXHJcbiAgaGFuZGxlVXJpKGFwcCk7XHJcbiAgaGFuZGxlckhlbHBlcihhcHApO1xyXG4gIGhhbmRsZUNyeXB0byhhcHApO1xyXG5cclxuICBhcHAuX18gPSBfXztcclxuICBhcHAudHJhbnMgPSBfXztcclxuICBhcHAucm91dGUgPSByb3V0ZTtcclxuICBhcHAuJGh0dHAgPSBodHRwO1xyXG4gIGFwcC5kaXJlY3RpdmUgPSB1c2VVbmlEaXJlY3RpdmU7XHJcblxyXG4gIGFwcC5hbmltYXRlID0gYW5pbWF0ZVRvO1xyXG4gIGFwcC4kYW5pbWF0aW9uID0geyB0bzogYW5pbWF0ZVRvIH07XHJcblxyXG4gIGFwcC5hZGRNZXNzYWdlID0gcmVuZGVyTWVzc2FnZTtcclxuICBhcHAuY2xlYXJNZXNzYWdlcyA9IGNsZWFyTWVzc2FnZXM7XHJcbiAgYXBwLm5vdGlmeSA9IG5vdGlmeTtcclxuICBhcHAuY2xlYXJOb3RpZmllcyA9IGNsZWFyTm90aWZpZXM7XHJcblxyXG4gIGFwcC5sb2FkQWxwaW5lID0gbG9hZEFscGluZTtcclxuICBhcHAuaW5pdEFscGluZSA9IGluaXRBbHBpbmVDb21wb25lbnQ7XHJcbiAgYXBwLmJlZm9yZUFscGluZUluaXQgPSBwcmVwYXJlQWxwaW5lO1xyXG4gIGFwcC5wcmVwYXJlQWxwaW5lID0gcHJlcGFyZUFscGluZTtcclxuXHJcbiAgaGFuZGxlVUkoYXBwKTtcclxuXHJcbiAgYXdhaXQgaGFuZGxlRm9ybUdyaWQoYXBwKTtcclxuXHJcbiAgYXBwLmZvcm1WYWxpZGF0aW9uID0gdXNlRm9ybVZhbGlkYXRpb247XHJcbiAgYXBwLiR2YWxpZGF0aW9uID0ge1xyXG4gICAgZ2V0OiB1c2VGb3JtVmFsaWRhdGlvblN5bmMsXHJcbiAgICBnZXRGaWVsZDogdXNlRmllbGRWYWxpZGF0aW9uU3luYyxcclxuICAgIGFkZEdsb2JhbFZhbGlkYXRvcjogYWRkR2xvYmFsVmFsaWRhdG9yLFxyXG4gICAgaW1wb3J0OiAoKSA9PiB1c2VGb3JtVmFsaWRhdGlvbigpXHJcbiAgfTtcclxuXHJcbiAgYXBwLnN0YWNrID0gdXNlU3RhY2s7XHJcbiAgYXBwLnF1ZXVlID0gdXNlUXVldWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNyeXB0byhhcHA6IGFueSkge1xyXG4gIGFwcC5iYXNlNjRFbmNvZGUgPSBiYXNlNjRVcmxFbmNvZGU7XHJcbiAgYXBwLmJhc2U2NERlY29kZSA9IGJhc2U2NFVybERlY29kZTtcclxuICAvLyBhcHAudXVpZDQgPSB1dWlkNDtcclxuICBhcHAudWlkID0gdWlkO1xyXG4gIGFwcC50aWQgPSB0aWQ7XHJcbiAgLy8gYXBwLm1kNSA9IG1kNTtcclxuICBhcHAuc2VyaWFsID0gc2VyaWFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVVcmkoYXBwOiBhbnkpIHtcclxuICBhcHAudXJpID0gdXNlU3lzdGVtVXJpO1xyXG4gIGFwcC5hc3NldCA9IHVzZUFzc2V0VXJpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVySGVscGVyKGFwcDogYW55KSB7XHJcbiAgYXBwLmRvbXJlYWR5ID0gZG9tcmVhZHk7XHJcbiAgYXBwLnNlbGVjdE9uZSA9IHNlbGVjdE9uZTtcclxuICBhcHAuc2VsZWN0QWxsID0gc2VsZWN0QWxsO1xyXG4gIGFwcC5lYWNoID0gc2VsZWN0QWxsO1xyXG4gIGFwcC5nZXRCb3VuZGVkSW5zdGFuY2UgPSBnZXRCb3VuZGVkSW5zdGFuY2U7XHJcbiAgYXBwLmdldEJvdW5kZWRJbnN0YW5jZUxpc3QgPSBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0O1xyXG4gIGFwcC5tb2R1bGUgPSBtb2R1bGU7XHJcbiAgYXBwLmggPSBoO1xyXG4gIGFwcC5odG1sID0gaHRtbDtcclxuICAvLyBhcHAuJGdldCA9IGdldDtcclxuICAvLyBhcHAuJHNldCA9IHNldDtcclxuICBhcHAuZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICBhcHAuZGVib3VuY2UgPSBkZWJvdW5jZTtcclxuICBhcHAudGhyb3R0bGUgPSB0aHJvdHRsZTtcclxuICBhcHAuaXNEZWJ1ZyA9IGlzRGVidWc7XHJcbiAgYXBwLmNvbmZpcm0gPSBzaW1wbGVDb25maXJtO1xyXG4gIGFwcC5hbGVydCA9IHNpbXBsZUFsZXJ0O1xyXG4gIGFwcC5udW1iZXJGb3JtYXQgPSBudW1iZXJGb3JtYXQ7XHJcbiAgYXBwLnNwcmludGYgPSBzcHJpbnRmO1xyXG4gIGFwcC52c3ByaW50ZiA9IHZzcHJpbnRmO1xyXG4gIC8vIGFwcC5nZW5SYW5kb21TdHJpbmcgPSBnZW5SYW5kb21TdHJpbmc7XHJcbiAgLy8gYXBwLmRlZmF1bHRzRGVlcCA9IGRlZmF1bHRzRGVlcDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVUkoYXBwOiBhbnkpIHtcclxuICBhcHAuJHVpID8/PSB7fTtcclxuICBhcHAuJHVpLmFkZE1lc3NhZ2UgPSByZW5kZXJNZXNzYWdlO1xyXG4gIGFwcC4kdWkuY2xlYXJNZXNzYWdlcyA9IGNsZWFyTWVzc2FnZXM7XHJcbiAgYXBwLiR1aS5ub3RpZnkgPSBub3RpZnk7XHJcbiAgYXBwLiR1aS5jbGVhck5vdGlmaWVzID0gY2xlYXJOb3RpZmllcztcclxuXHJcbiAgYXBwLiR1aS5sb2FkQWxwaW5lID0gbG9hZEFscGluZTtcclxuICBhcHAuJHVpLmluaXRBbHBpbmUgPSBpbml0QWxwaW5lQ29tcG9uZW50O1xyXG4gIGFwcC4kdWkuYmVmb3JlQWxwaW5lSW5pdCA9IHByZXBhcmVBbHBpbmU7XHJcbiAgYXBwLiR1aS5wcmVwYXJlQWxwaW5lID0gcHJlcGFyZUFscGluZTtcclxuXHJcbiAgYXBwLiR1aS5tYXJrID0gbWFyaztcclxuICBhcHAuJHVpLnRvbVNlbGVjdCA9IHVzZVRvbVNlbGVjdDtcclxuICBhcHAuJHVpLnNsaWRlVXAgPSBzbGlkZVVwO1xyXG4gIGFwcC4kdWkuc2xpZGVEb3duID0gc2xpZGVEb3duO1xyXG4gIGFwcC4kdWkuc2xpZGVUb2dnbGUgPSBzbGlkZVRvZ2dsZTtcclxuICBhcHAuJHVpLmZhZGVPdXQgPSBmYWRlT3V0O1xyXG4gIGFwcC4kdWkuZmFkZUluID0gZmFkZUluO1xyXG4gIGFwcC4kdWkuaGlnaGxpZ2h0ID0gaGlnaGxpZ2h0O1xyXG4gIGFwcC4kdWkuY29sb3JQaWNrZXIgPSB1c2VDb2xvclBpY2tlcjtcclxuICBhcHAuJHVpLmRpc2FibGVPblN1Ym1pdCA9IHVzZURpc2FibGVPblN1Ym1pdDtcclxuICBhcHAuJHVpLmRpc2FibGVJZlN0YWNrTm90RW1wdHkgPSB1c2VEaXNhYmxlSWZTdGFja05vdEVtcHR5O1xyXG4gIGFwcC4kdWkuY2hlY2tib3hlc011bHRpU2VsZWN0ID0gdXNlQ2hlY2tib3hlc011bHRpU2VsZWN0O1xyXG4gIGFwcC4kdWkua2VlcEFsaXZlID0gdXNlS2VlcEFsaXZlO1xyXG4gIGFwcC4kdWkuYm9vdHN0cmFwID0ge1xyXG4gICAgdG9vbHRpcDogdXNlQnM1VG9vbHRpcFxyXG4gIH07XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUZvcm1HcmlkKGFwcDogYW55KSB7XHJcbiAgYXdhaXQgdXNlRm9ybUFzeW5jKCk7XHJcbiAgYXdhaXQgdXNlR3JpZEFzeW5jKCk7XHJcblxyXG4gIGFwcC5mb3JtID0gdXNlRm9ybTtcclxuICBhcHAuZ3JpZCA9IHVzZUdyaWQ7XHJcbn1cclxuIl0sIm5hbWVzIjpbInNwcmludGYiLCJ2c3ByaW50ZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQUMsV0FBVztBQUdSLFVBQUksS0FBSztBQUFBLFFBR0wsVUFBVTtBQUFB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
