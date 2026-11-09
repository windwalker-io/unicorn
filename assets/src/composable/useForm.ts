import type { UnicornFormElement } from '../module/form';
import { module, selectOne } from '../service';

let formElement: typeof UnicornFormElement;

type FormProxy = {
  submit: (...args: Parameters<UnicornFormElement['submit']>) => Promise<ReturnType<UnicornFormElement['submit']> | undefined>;
  get: (...args: Parameters<UnicornFormElement['get']>) => Promise<ReturnType<UnicornFormElement['get']> | undefined>;
  post: (...args: Parameters<UnicornFormElement['post']>) => Promise<ReturnType<UnicornFormElement['post']> | undefined>;
  put: (...args: Parameters<UnicornFormElement['put']>) => Promise<ReturnType<UnicornFormElement['put']> | undefined>;
  patch: (...args: Parameters<UnicornFormElement['patch']>) => Promise<ReturnType<UnicornFormElement['patch']> | undefined>;
  delete: (...args: Parameters<UnicornFormElement['delete']>) => Promise<ReturnType<UnicornFormElement['delete']> | undefined>;
  query: (...args: Parameters<UnicornFormElement['query']>) => Promise<ReturnType<UnicornFormElement['query']> | undefined>;
};

export function useFormAsync(): FormProxy & Promise<UnicornFormElement>;
export function useFormAsync(
  ele?: string | Element,
  options?: Record<string, any>): FormProxy & Promise<UnicornFormElement | null>;
export function useFormAsync(
  ele?: string | Element,
  options: Record<string, any> = {}
): FormProxy & Promise<UnicornFormElement | null> {
  const promise = import('../module/form').then(({ UnicornFormElement }) => {
    formElement ??= UnicornFormElement;

    return useForm(ele, options);
  });

  const proxy = new Proxy({} as FormProxy, {
    get(target, prop) {
      return (...args: any[]) => {
        if (prop === 'then' || prop === 'catch') {
          return (promise as any)[prop].apply(promise, args);
        }

        return promise.then((form) => {
          const p = (form as any)[prop];

          if (typeof p === 'function') {
            return p.apply(form, args);
          }

          return p;
        });
      };
    },
  });

  return proxy as FormProxy & Promise<UnicornFormElement | null>;
}

export function useForm(): UnicornFormElement;
export function useForm(ele?: string | Element, options?: Record<string, any>): UnicornFormElement | null;
export function useForm(ele?: string | Element, options: Record<string, any> = {}): UnicornFormElement | null {
  if (!formElement) {
    throw new Error('Form module is not loaded. Please use useFormAsync() to load the module before using useForm().');
  }

  if (ele == null) {
    return new formElement(undefined, undefined, options);
  }

  let selector: string | undefined = undefined;
  let el: HTMLFormElement | undefined = undefined;

  if (typeof ele === 'string') {
    selector = ele;
    el = selectOne<HTMLFormElement>(ele) ?? undefined;
  } else {
    el = ele as HTMLFormElement;
  }

  if (!el) {
    return new formElement(selector, el, options);
  }

  return module(
    el,
    'unicorn.form',
    () => new formElement(selector, el, options)
  );
}

export async function useFormComponent(ele?: string | Element, options: Record<string, any> = {}) {
  const form = await useFormAsync(ele, options);

  await form?.initComponent();

  return form;
}

type AllowedMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'QUERY';

export interface FormSubmitOptions {
  form?: string | Element;
  method?: AllowedMethods;
  url?: string;
  data?: Record<string, any>;
}

export async function useFormSubmit(
  method: AllowedMethods,
  url: string,
  data?: Record<string, any>,
  options?: Omit<FormSubmitOptions, 'url' | 'data' | 'method'>
): Promise<boolean>;
export async function useFormSubmit(
  url: string,
  data?: Record<string, any>,
  options?: Omit<FormSubmitOptions, 'url' | 'data'>
): Promise<boolean>;
export async function useFormSubmit(options: FormSubmitOptions): Promise<boolean>;
export async function useFormSubmit(...args: any[]) {
  let options: FormSubmitOptions = {};

  if (args.length === 1 && typeof args[0] === 'object') {
    // (options)
    options = args[0];
  } else if (typeof args[0] === 'string' && typeof args[1] === 'string') {
    // (method, url, data, options)
    options.method = args[0] as AllowedMethods;
    options.url = args[1];
    options.data = args[2] ?? {};
    options = { ...options, ...(args[3] ?? {}) };
  } else if (typeof args[0] === 'string') {
    // (url, data, options)
    options.url = args[0];
    options.data = args[1] ?? {};
    options = { ...options, ...(args[2] ?? {}) };
  }

  const form = (await useFormAsync(options.form)) as UnicornFormElement;

  // fun type should be method of form
  const func = (options.method?.toLowerCase() || 'post') as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'query';

  return form[func](options.url, options.data);
}
