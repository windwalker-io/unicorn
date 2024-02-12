
export function getData(element: HTMLElement, name: string | undefined = undefined) {
  prepareData(element);

  if (name === undefined) {
    return element.__unicorn;
  }

  return element.__unicorn[name];
}

export function setData(element: HTMLElement, name: string, value: any) {
  prepareData(element);
  element.__unicorn[name] = value;
}

export function defData(element: HTMLElement, name: string, defCallback: Function) {
  prepareData(element);
  element.__unicorn[name] = element.__unicorn[name] || defCallback(element);

  return element.__unicorn[name];
}

export function removeData(element: HTMLElement, name: string) {
  prepareData(element);

  const v = element.__unicorn[name];
  delete element.__unicorn[name];

  return v;
}

export function prepareData<T extends Node>(element: T): T {
  if (!element) {
    return element;
  }

  element.__unicorn = element.__unicorn || {};
  return element;
}

declare global {
  interface Node {
    __unicorn?: any;
  }
}
