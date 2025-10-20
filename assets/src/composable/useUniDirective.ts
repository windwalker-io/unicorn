import type { default as WebDirective, WebDirectiveHandler, WebDirectiveOptions } from 'web-directive';
import { Dictionary } from '../types';

let instances: Dictionary<WebDirective> = {};

export async function useWebDirective(
  name: string,
  options: false
): Promise<void>;
export async function useWebDirective(
  name: string,
  options?: Partial<WebDirectiveOptions>
): Promise<WebDirective>;
export async function useWebDirective(
  name: string = 'unicorn',
  options: Partial<WebDirectiveOptions> | false = {}
): Promise<WebDirective | void> {
  if (options === false) {
    delete instances[name];
    return;
  }

  return instances[name] ??= await createWebDirective(Object.assign({}, options, { prefix: 'uni-' }));
}

export async function useUniDirective<T extends Element = HTMLElement, M extends Record<string, boolean> = Record<string, boolean>>(
  name: string,
  handler: WebDirectiveHandler<T, M>,
  wdInstance: WebDirective | string = 'unicorn'
): Promise<void> {
  const wd = typeof wdInstance === 'string' ? await useWebDirective(wdInstance) : wdInstance;

  wd.register<T, M>(name, handler);
}

async function createWebDirective(options: Partial<WebDirectiveOptions> = {}): Promise<WebDirective> {
  const WebDirective = (await import('web-directive')).default;

  const wd = new WebDirective(options);
  wd.listen();

  return wd;
}
