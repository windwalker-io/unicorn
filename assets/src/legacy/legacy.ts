import { numberFormat } from '@lyrasoft/ts-toolkit/generic';
import { sprintf, vsprintf } from 'sprintf-js';
import {
  addGlobalValidator, useBs5ButtonRadio, useBs5KeepTab,
  useBs5Tooltip,
  useCheckboxesMultiSelect,
  useFieldValidationSync,
  useForm,
  useFormAsync,
  useFormValidation,
  useFormValidationInstance,
  useGrid,
  useGridAsync,
  useHttpClient,
  useQueue,
  useStack,
  useTomSelect,
  useUniDirective
} from '../composable';
import {
  __,
  animateTo,
  base64UrlDecode,
  base64UrlEncode,
  clearMessages,
  clearNotifies,
  debounce,
  delegate,
  domready,
  fadeIn,
  fadeOut,
  getBoundedInstance,
  getBoundedInstanceList,
  h,
  highlight,
  html,
  initAlpineComponent,
  isDebug,
  loadAlpine,
  mark,
  module,
  simpleNotify,
  prepareAlpine,
  renderMessage,
  route,
  selectAll,
  selectOne,
  serial,
  simpleAlert,
  simpleConfirm,
  slideDown,
  slideToggle,
  slideUp,
  throttle,
  tid,
  uid,
  useAssetUri,
  useColorPicker,
  useDisableIfStackNotEmpty,
  useDisableOnSubmit,
  useKeepAlive,
  useSystemUri
} from '../service';
import { LegacyLoader } from './loader';

export async function useLegacyMethods(app: any) {
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
  app.notify = simpleNotify;
  app.clearNotifies = clearNotifies;

  app.loadAlpine = loadAlpine;
  app.initAlpine = initAlpineComponent;
  app.beforeAlpineInit = prepareAlpine;
  app.prepareAlpine = prepareAlpine;

  handleUI(app);

  await handleFormGrid(app);

  app.formValidation = useFormValidation;
  app.$validation = {
    get: useFormValidationInstance,
    getField: useFieldValidationSync,
    addGlobalValidator: addGlobalValidator,
    import: () => useFormValidation()
  };

  app.stack = useStack;
  app.queue = useQueue;
}

function handleCrypto(app: any) {
  app.base64Encode = base64UrlEncode;
  app.base64Decode = base64UrlDecode;
  // app.uuid4 = uuid4;
  app.uid = uid;
  app.tid = tid;
  // app.md5 = md5;
  app.serial = serial;
}

function handleUri(app: any) {
  app.uri = useSystemUri;
  app.asset = useAssetUri;
}

function handlerHelper(app: any) {
  app.domready = domready;
  app.selectOne = selectOne;
  app.selectAll = selectAll;
  app.each = selectAll;
  app.getBoundedInstance = getBoundedInstance;
  app.getBoundedInstanceList = getBoundedInstanceList;
  app.module = module;
  app.h = h;
  app.html = html;
  // app.$get = get;
  // app.$set = set;
  app.delegate = delegate;
  app.debounce = debounce;
  app.throttle = throttle;
  app.isDebug = isDebug;
  app.confirm = simpleConfirm;
  app.alert = simpleAlert;
  app.numberFormat = numberFormat;
  app.sprintf = sprintf;
  app.vsprintf = vsprintf;
  // app.genRandomString = genRandomString;
  // app.defaultsDeep = defaultsDeep;
}

function handleUI(app: any) {
  app.$ui ??= {};
  app.$ui.addMessage = renderMessage;
  app.$ui.clearMessages = clearMessages;
  app.$ui.notify = simpleNotify;
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
    tooltip: useBs5Tooltip,
    buttonRadio: useBs5ButtonRadio,
    keepTab: useBs5KeepTab,
  };
}

async function handleFormGrid(app: any) {
  await useFormAsync();
  await useGridAsync();

  app.form = useForm;
  app.grid = useGrid;
}
