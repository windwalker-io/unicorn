import { removeData } from '../data';
import { defData } from '../utilities';

/**
 * @see https://stackoverflow.com/a/9899701
 */
export function domready(callback?: ((value: any) => any)): Promise<void> {
  let promise = new Promise<void>((resolve) => {
    // see if DOM is already available
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // call on next available tick
      setTimeout(resolve, 0);
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve());
    }
  });

  if (callback) {
    promise = promise.then(callback);
  }

  return promise;
}

export function selectOne<K extends keyof HTMLElementTagNameMap>(ele: K): HTMLElementTagNameMap[K] | null;
export function selectOne<E extends Element = Element>(ele: string): E | null;
export function selectOne<E extends Element = Element>(ele: E): E;
export function selectOne<E extends Element = Element>(ele: string | E): E | null;
// selectOne(ele: string): Element;
export function selectOne<E extends Element = Element>(ele: E | string): E | null {
  let r: E | null;

  if (typeof ele === 'string') {
    r = document.querySelector<E>(ele);
  } else {
    r = ele;
  }

  if (!r) {
    return r;
  }

  return r;
}

export function selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): E[];
export function selectAll<E extends Element = Element>(ele: NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
export function selectAll<E extends Element = Element>(
  ele: string | NodeListOf<E> | E[],
  callback?: ((ele: E) => any)
): E[];
export function selectAll<E extends keyof HTMLElementTagNameMap>(
  ele: E,
  callback?: ((ele: HTMLElementTagNameMap[E]) => any)
): HTMLElementTagNameMap[E][];
export function selectAll(
  ele: NodeListOf<Element> | Element[] | string,
  callback: ((el: Element) => any) | undefined = undefined
): Element[] {
  if (typeof ele === 'string') {
    ele = document.querySelectorAll(ele);
  }

  const resultSet: Element[] = [].slice.call(ele);

  if (callback) {
    return resultSet.map((el) => callback(el) || el);
  }

  return resultSet;
}

export function getBoundedInstance<T = any, E = Element>(selector: E, name: string, callback?: ((el: E) => any)): T;
export function getBoundedInstance<T = any, E extends Element = Element>(
  selector: string | E,
  name: string,
  callback?: ((el: E) => any)
): T | null;
export function getBoundedInstance<T = any, E extends Element = Element>(
  selector: string | E,
  name: string,
  callback: ((el: E) => any) = () => null
): T | null {
  const element = typeof selector === 'string' ? document.querySelector<E>(selector) : selector;

  if (!element) {
    return null;
  }

  return defData(element, name, callback);
}

export function getBoundedInstanceList<T = any, E extends Element = Element>(
  selector: string | NodeListOf<E>,
  name: string,
  callback: ((el: E) => any) = () => null
): (T | null)[] {
  const items = typeof selector === 'string' ? document.querySelectorAll<E>(selector) : selector;

  return Array.from(items).map((ele: E) => getBoundedInstance(ele, name, callback));
}

export function removeBoundedInstance(selector: string | Element, name: string) {
  const element = typeof selector === 'string' ? document.querySelector<Element>(selector) : selector;

  if (element) {
    removeData(element, name);
  }
}

export function module<T = any, E extends Element = Element>(
  ele: string,
  name: string,
  callback?: ((el: E) => any)
): (T | null)[];
export function module<T = any, E extends Element = Element>(
  ele: NodeListOf<E>,
  name: string,
  callback?: ((el: E) => any)): (T | null)[];
export function module<T = any, E extends Element = Element>(
  ele: E,
  name: string,
  callback?: ((el: E) => any)
): T | null;
export function module<T = any, E extends Element = Element>(
  ele: string | Element | NodeListOf<Element>,
  name: string,
  callback?: ((el: E) => any)
): (T | null)[] | T | null;
export function module<T = any, E extends Element = Element>(
  ele: string | Element | NodeListOf<Element>,
  name: string,
  callback: false
): (T | null)[] | T | null;
export function module<T = any, E extends Element = Element>(
  ele: string | E | NodeListOf<E>,
  name: string,
  callback: ((el: E) => any) | false = () => null
): (T | null)[] | T | null {
  if (callback === false) {
    if (typeof ele === 'string' || ele instanceof Element) {
      removeBoundedInstance(ele, name);
      return null;
    }

    Array.from(ele).forEach((el) => removeBoundedInstance(el, name));
    return null;
  }

  if (typeof ele === 'string') {
    return getBoundedInstanceList<T, E>(ele, name, callback);
  }

  if (ele instanceof HTMLElement) {
    return getBoundedInstance<T, E>(ele, name, callback);
  }

  return getBoundedInstanceList<T, E>(ele as NodeListOf<E>, name, callback);
}

export function h<T extends keyof HTMLElementTagNameMap>(
  element: T,
  attrs?: Record<string, any>,
  content?: any
): HTMLElementTagNameMap[T]
export function h(element: string, attrs: Record<string, any> = {}, content: any = undefined): HTMLElement {
  const ele = document.createElement(element);

  for (let i in attrs) {
    const v = attrs[i];

    ele.setAttribute(i, v);
  }

  if (content !== null) {
    ele.innerHTML = content;
  }

  return ele;
}

export function html<T extends Element = HTMLElement>(html: string): T {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0] as T;
}

/**
 * Pure JS version of jQuery delegate()
 *
 * @see https://gist.github.com/iagobruno/4db2ed62dc40fa841bb9a5c7de92f5f8
 */
export function delegate(
  wrapper: Element | string,
  selector: string,
  eventName: string,
  callback: (e: Event) => void
): () => void {
  if (typeof selector === 'undefined' || selector === '') {
    throw new Error('The provided selector is empty.');
  }

  if (typeof callback === 'undefined' || typeof callback !== 'function') {
    throw new Error('Please specify an callback.');
  }

  const delegationSelectorsMap: Record<string, Function[]> = {};

  const wrapperElement = selectOne(wrapper);

  wrapperElement?.addEventListener(eventName, function (event) {
    let element: HTMLElement | null = event.target as HTMLElement;
    let forceBreak = false;

    while (element && element !== wrapperElement) {
      for (const selector in delegationSelectorsMap) {
        if (element.matches(selector)) {
          event.stopPropagation = function () {
            forceBreak = true;
          };
          Object.defineProperty(
            event,
            'currentTarget',
            {
              get() {
                return element;
              }
            }
          );

          const callbackList = delegationSelectorsMap[selector];

          callbackList.forEach(function (callback) {
            callback(event);
          });
        }
      }

      if (forceBreak) {
        break;
      }

      element = element.parentElement;
    }
  });

  if (!delegationSelectorsMap[selector]) {
    // Add new selector to the list
    delegationSelectorsMap[selector] = [callback];
  } else {
    delegationSelectorsMap[selector].push(callback);
  }

  return function unsubscribe() {
    if (!delegationSelectorsMap[selector]) {
      return;
    }

    if (delegationSelectorsMap[selector].length >= 2) {
      delegationSelectorsMap[selector] = delegationSelectorsMap[selector].filter(cb => cb !== callback);
    } else {
      delete delegationSelectorsMap[selector];
    }
  };
}

type CssSource = string | (() => Promise<{ default: string }>);

export function injectCssToDocument(doc: Document, ...css: (CssSource | CSSStyleSheet)[]): Promise<CSSStyleSheet[]>;
export function injectCssToDocument(...css: (CssSource | CSSStyleSheet)[]): Promise<CSSStyleSheet[]>;
export async function injectCssToDocument(
  doc: Document | CssSource | CSSStyleSheet,
  ...css: (CssSource | CSSStyleSheet)[]
): Promise<CSSStyleSheet[]> {
  if (!(doc instanceof Document)) {
    css.push(doc);
    doc = document;
  }

  const promises: Promise<any>[] = [];

  for (let cssItem of css) {
    promises.push(
      new Promise((resolve, reject) => {
        if (cssItem instanceof CSSStyleSheet) {
          resolve(cssItem);
        } else if (typeof cssItem === 'string') {
          const style = new CSSStyleSheet();

          style.replace(cssItem).then(() => resolve(style)).catch(reject);
        } else if (typeof cssItem === 'function') {
          cssItem().then(({ default: result }) => {
            const style = new CSSStyleSheet();

            style.replace(result).then(() => resolve(style)).catch(reject);
          }).catch(reject);
        } else {
          reject(new Error('Invalid CSS source'));
        }
      })
    );
  }

  const styles = await Promise.all(promises);

  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, ...styles];

  return styles;
}
