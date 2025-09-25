import { getData, setData, removeData as rmdata } from './utilities';

export function data(name: string, data: any): any;
export function data(name: string): any;
export function data(ele: Element, name: string): any;
export function data(ele: Element, name: string, data?: any): any;
export function data(ele: Element | string, name: any = undefined, value: any = undefined) {
  if (!(ele instanceof HTMLElement)) {
    value = name;
    name = ele;
    ele = document as any as Element;
  }

  if (name === undefined) {
    return getData(ele);
  }

  if (value === undefined) {
    const res = getData(ele, name);

    return res;
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
