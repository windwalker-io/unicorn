import { numberFormat } from '@lyrasoft/ts-toolkit/generic';
import { sprintf, vsprintf } from 'sprintf-js';
import {
  addGlobalValidator,
  useBs5Tooltip,
  useCheckboxesMultiSelect,
  useFieldValidationSync,
  useFormValidation,
  useFormValidationSync,
  useHttpClient,
  useQueue,
  useStack,
  useTomSelect,
  useUniDirective
} from '../composable';
import { LegacyLoader } from './loader';
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
  notify,
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

async function handleFormGrid(app: any) {
  const { UnicornFormElement } = await import('../module/form');
  const { UnicornGridElement } = await import('../module/grid');

  app.form = function useForm(ele?: string | Element, options: Record<string, any> = {}) {
    if (ele == null) {
      return new UnicornFormElement(undefined, undefined, options);
    }

    const selector = typeof ele === 'string' ? ele : undefined;
    const el = selectOne<HTMLFormElement>(ele as string);

    if (!el) {
      throw new Error(`Form element of: ${selector} not found.`);
    }

    return module(
      el,
      'unicorn.form',
      () => new UnicornFormElement(selector, el, options)
    );
  };

  app.grid = function useGrid(
    ele: string | HTMLElement,
    options: Record<string, any> | undefined = {}
  ) {
    const selector = typeof ele === 'string' ? ele : '';
    const element = selectOne(ele);

    if (!element) {
      throw new Error('Element is empty');
    }

    const form = app.form(selector || element);

    if (!form) {
      throw new Error('UnicornGrid is depends on UnicornForm');
    }

    return module(
      element,
      'grid.plugin',
      () => new UnicornGridElement(selector, element, form, options)
    );
  };
}
