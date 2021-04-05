/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export function getData(element, name) {
  prepareData(element);
  return element.__unicorn[name];
}

export function setData(element, name, value) {
  prepareData(element);
  element.__unicorn[name] = value;
}

export function defData(element, name, defCallback) {
  prepareData(element);
  element.__unicorn[name] = element.__unicorn[name] || defCallback();

  return element.__unicorn[name];
}

export function prepareData(element) {
  if (!element) {
    return element;
  }

  element.__unicorn = element.__unicorn || {};
  return element;
}
