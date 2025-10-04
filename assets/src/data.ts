import { getData, removeData as rmdata, setData } from './utilities';

export function data(name: string, data?: any): any;
export function data<T = void, R = [T] extends [void] ? any : T | undefined>(name: string): R;
export function data<T = void, R = [T] extends [void] ? any : T | undefined>(ele: Element, name: string): R;
export function data(ele: Element, name: string, value: any): any;
export function data(ele: Element | string, name?: any, value?: any) {
  if (!(ele instanceof HTMLElement)) {
    value = name;
    name = ele;
    ele = document as any as Element;
  }

  if (name === undefined) {
    return getData(ele);
  }

  if (value === undefined) {
    return getData(ele, name);
  }

  setData(ele, name, value);
}

export function removeData(name: string): any;
export function removeData(ele: Element, name: string): any;
export function removeData(ele: Element|string, name: any = undefined) {
  if (!(ele instanceof HTMLElement)) {
    name = ele;
    ele = document as any as Element;
  }

  rmdata(ele, name);
}
