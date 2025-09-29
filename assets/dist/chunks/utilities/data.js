function getData(element, name = void 0) {
  prepareData(element);
  if (name === void 0) {
    return element.__unicorn;
  }
  return element.__unicorn[name];
}
function setData(element, name, value) {
  prepareData(element);
  element.__unicorn[name] = value;
}
function defData(element, name, defCallback) {
  prepareData(element);
  element.__unicorn[name] = element.__unicorn[name] || defCallback(element);
  return element.__unicorn[name];
}
function removeData(element, name) {
  prepareData(element);
  const v = element.__unicorn[name];
  delete element.__unicorn[name];
  return v;
}
function prepareData(element) {
  if (!element) {
    return element;
  }
  element.__unicorn = element.__unicorn || {};
  return element;
}
export {
  defData as d,
  getData as g,
  removeData as r,
  setData as s
};
