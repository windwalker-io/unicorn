import { U as UnicornApp } from "./chunks/app.js";
import { p as polyfill } from "./chunks/polyfill/index.js";
import { d, r } from "./chunks/data.js";
import { a, E } from "./chunks/events.js";
import { r as removeCloak } from "./chunks/utilities/base.js";
import { a as a2 } from "./chunks/service/animate.js";
import { a as a3, b, s } from "./chunks/service/crypto.js";
import { A, h, g, r as r2, j, c, b as b2, s as s2, t, d as d2, u } from "./chunks/composable/useQueue.js";
import { e, d as d3, g as g2, b as b3, h as h2, c as c2, i, m, a as a4, s as s3 } from "./chunks/service/dom.js";
import { d as d4, f, i as i2, n, t as t2, w } from "./chunks/service/helper.js";
import { _, t as t3, u as u2 } from "./chunks/service/lang.js";
import { d as d5, u as u3, e as e2, a as a5, b as b4, c as c3 } from "./chunks/service/loader.js";
import { U, c as c4, a as a6, e as e3, f as f2, h as h3, i as i3, l, m as m2, n as n2, p, q, r as r3, b as b5, d as d6, s as s4, g as g3, k, j as j2, o, t as t4, u as u4, v } from "./chunks/service/ui.js";
import { c as c5, U as U2, b as b6, a as a7, u as u5 } from "./chunks/service/uri.js";
import { b as b7, a as a8, c as c6, h as h4, p as p2, r as r4 } from "./chunks/service/router.js";
import { u as u6 } from "./chunks/composable/useCheckboxesMultiSelect.js";
import { u as u7 } from "./chunks/composable/useFieldCascadeSelect.js";
import { u as u8 } from "./chunks/composable/useFieldFileDrag.js";
import { u as u9 } from "./chunks/composable/useFieldFlatpickr.js";
import { u as u10 } from "./chunks/composable/useFieldModalSelect.js";
import { u as u11 } from "./chunks/composable/useFieldModalTree.js";
import { u as u12 } from "./chunks/composable/useFieldRepeatable.js";
import { u as u13 } from "./chunks/composable/useFieldSingleImageDrag.js";
import { a as a9, u as u14, b as b8 } from "./chunks/composable/useForm.js";
import { a as a10, u as u15, b as b9 } from "./chunks/composable/useGrid.js";
import { u as u16, a as a11 } from "./chunks/composable/useHttp.js";
import { u as u17 } from "./chunks/composable/useIframeModal.js";
import { u as u18 } from "./chunks/composable/useListDependent.js";
import { a as a12, u as u19 } from "./chunks/composable/useS3Uploader.js";
import { u as u20 } from "./chunks/composable/useShowOn.js";
import { c as c7, u as u21 } from "./chunks/composable/useStack.js";
import { u as u22 } from "./chunks/composable/useTomSelect.js";
import { c as c8, b as b10, u as u23, a as a13 } from "./chunks/composable/useUIBootstrap5.js";
import { u as u24, a as a14 } from "./chunks/composable/useUniDirective.js";
import { a as a15, b as b11, u as u25, c as c9 } from "./chunks/composable/useValidation.js";
import { U as U3, u as u26 } from "./chunks/plugin/php-adapter.js";
let app;
function createUnicorn() {
  polyfill();
  removeCloak();
  return app = new UnicornApp();
}
function createUnicornWithPlugins() {
  const app2 = createUnicorn();
  return app2;
}
function useUnicorn(instance) {
  if (instance) {
    app = instance;
  }
  return app ??= createUnicorn();
}
const useInject = (id, def) => {
  return useUnicorn().inject(id, def);
};
function pushUnicornToGlobal(app2) {
  window.u = app2 ?? useUnicorn();
}
function useMacro(name, handler) {
  useUnicorn().macro(name, handler);
}
async function useLegacy(app2) {
  app2 ??= useUnicorn();
  pushUnicornToGlobal(app2);
  const { useLegacyMethods } = await import("./chunks/legacy/legacy.js").then((n3) => n3.l);
  await useLegacyMethods(app2);
  return app2;
}
export {
  A as AlertAdapter,
  a as EventBus,
  E as EventMixin,
  c5 as UnicornAssetUri,
  U3 as UnicornPhpAdapter,
  U2 as UnicornSystemUri,
  U as UnicornUI,
  _ as __,
  a15 as addGlobalValidator,
  b7 as addQuery,
  a8 as addRoute,
  b6 as addUriBase,
  a2 as animateTo,
  a3 as base64UrlDecode,
  b as base64UrlEncode,
  c6 as buildQuery,
  c4 as clearMessages,
  a6 as clearNotifies,
  h as createQueue,
  c7 as createStack,
  createUnicorn,
  createUnicornWithPlugins,
  d as data,
  d4 as debounce,
  e as delegate,
  g as deleteConfirm,
  d5 as doImport,
  d3 as domready,
  e3 as fadeIn,
  f2 as fadeOut,
  f as forceArray,
  g2 as getBoundedInstance,
  b3 as getBoundedInstanceList,
  h2 as h,
  h4 as hasRoute,
  h3 as highlight,
  c2 as html,
  i3 as initAlpineComponent,
  i as injectCssToDocument,
  i2 as isDebug,
  l as loadAlpine,
  m2 as mark,
  m as module,
  n as nextTick,
  n2 as notify,
  p2 as parseQuery,
  p as prepareAlpine,
  q as prepareAlpineDefer,
  pushUnicornToGlobal,
  r2 as randomBytes,
  j as randomBytesString,
  r as removeData,
  r3 as renderMessage,
  r4 as route,
  a4 as selectAll,
  s3 as selectOne,
  s as serial,
  c as simpleAlert,
  b2 as simpleConfirm,
  s2 as sleep,
  b5 as slideDown,
  d6 as slideToggle,
  s4 as slideUp,
  t2 as throttle,
  t as tid,
  t3 as trans,
  d2 as uid,
  a7 as useAssetUri,
  c8 as useBs5ButtonRadio,
  b10 as useBs5KeepTab,
  u23 as useBs5Tooltip,
  u6 as useCheckboxesMultiSelect,
  g3 as useColorPicker,
  u3 as useCssImport,
  e2 as useCssIncludes,
  k as useDisableIfStackNotEmpty,
  j2 as useDisableOnSubmit,
  u7 as useFieldCascadeSelect,
  u8 as useFieldFileDrag,
  u9 as useFieldFlatpickr,
  u10 as useFieldModalSelect,
  u11 as useFieldModalTree,
  u12 as useFieldRepeatable,
  u13 as useFieldSingleImageDrag,
  b11 as useFieldValidationSync,
  a9 as useForm,
  u14 as useFormAsync,
  b8 as useFormComponent,
  u25 as useFormValidation,
  c9 as useFormValidationSync,
  a10 as useGrid,
  u15 as useGridAsync,
  b9 as useGridComponent,
  u16 as useHttpClient,
  u17 as useIframeModal,
  a5 as useImport,
  useInject,
  o as useKeepAlive,
  u2 as useLang,
  useLegacy,
  u18 as useListDependent,
  a11 as useLoadedHttpClient,
  useMacro,
  u as useQueue,
  a12 as useS3MultipartUploader,
  u19 as useS3Uploader,
  b4 as useScriptImport,
  c3 as useSeriesImport,
  u20 as useShowOn,
  u21 as useStack,
  u5 as useSystemUri,
  u22 as useTomSelect,
  t4 as useUI,
  a13 as useUIBootstrap5,
  u4 as useUITheme,
  u24 as useUniDirective,
  useUnicorn,
  u26 as useUnicornPhpAdapter,
  v as useVueComponentField,
  a14 as useWebDirective,
  w as wait
};
