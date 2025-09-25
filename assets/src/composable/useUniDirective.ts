import { Dictionary } from '../types';
import type { default as WebDirective } from 'web-directive';
import type { WebDirectiveHandler, WebDirectiveOptions } from 'web-directive/src/types';

let instances: Dictionary<WebDirective> = {};

export async function useWebDirective(
  name: string = 'unicorn',
  options: Partial<WebDirectiveOptions> = {}
): Promise<WebDirective> {
  return instances[name] ??= await createWebDirective(Object.assign({}, options, { prefix: 'uni-' }));
}

export async function useUniDirective(
  name: string,
  handler: WebDirectiveHandler,
  wdInstance: WebDirective | string = 'unicorn'
): Promise<void> {
  const wd = typeof wdInstance === 'string' ? await useWebDirective(wdInstance) : wdInstance;

  wd.register(name, handler);
}

async function createWebDirective(options: Partial<WebDirectiveOptions> = {}): Promise<WebDirective> {
  const WebDirective = (await import('web-directive')).default;

  const wd = new WebDirective(options);
  wd.listen();

  return wd;
}
