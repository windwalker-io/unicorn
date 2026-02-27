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
};

export function useFormAsync(): Promise<UnicornFormElement>;
export function useFormAsync(
  ele?: string | Element,
  options?: Record<string, any>): Promise<UnicornFormElement | null>;
export function useFormAsync(
  ele?: string | Element,
  options: Record<string, any> = {}
): Promise<UnicornFormElement | null> {
  const promise = import('../module/form').then(({ UnicornFormElement }) => {
    formElement ??= UnicornFormElement;

    return useForm(ele, options);
  });

  const proxy = new Proxy({} as FormProxy, {
    get(target, prop) {
      return (...args: any[]) => {
        return promise.then((form) => {
          const func = (form as any)[prop];

          if (typeof func === 'function') {
            return func.apply(form, args);
          }

          throw new Error(`Method ${String(prop)} does not exist on form.`);
        });
      };
    },
  });

  Object.assign(proxy, {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
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

export interface FormSubmitOptions {
  form?: string | Element;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url?: string;
  data?: Record<string, any>;
}

export async function useFormSubmit(options: FormSubmitOptions = {}) {
  const form = (await useFormAsync(options.form)) as UnicornFormElement;

  // fun type should be method of form
  const func = (options.method?.toLowerCase() || 'post') as 'get' | 'post' | 'put' | 'delete' | 'patch';

  return form[func](options.url, options.data);
}
