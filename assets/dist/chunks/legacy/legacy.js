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
