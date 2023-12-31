
export function getData(element, name) {
  prepareData(element);

  if (name === undefined) {
    return element.__unicorn;
  }

  return element.__unicorn[name];
}

export function setData(element, name, value) {
  prepareData(element);
  element.__unicorn[name] = value;
}

export function defData(element, name, defCallback) {
  prepareData(element);
  element.__unicorn[name] = element.__unicorn[name] || defCallback(element);

  return element.__unicorn[name];
}

export function removeData(element, name) {
  prepareData(element);

  const v = element.__unicorn[name];
  delete element.__unicorn[name];

  return v;
}

export function prepareData(element) {
  if (!element) {
    return element;
  }

  element.__unicorn = element.__unicorn || {};
  return element;
}
