import { Dictionary } from '@/unicorn/types';
import WebDirective from 'web-directive';
import type { WebDirectiveHandler, WebDirectiveOptions } from 'web-directive/src/types';

let instances: Dictionary<WebDirective> = {};

export function useWebDirective(
  name: string = 'unicorn',
  options: Partial<WebDirectiveOptions> = {}
): WebDirective {
  return instances[name] ??= createWebDirective(Object.assign({}, options, { prefix: 'uni-' }));
}

export function useUniDirective(
  name: string,
  handler: WebDirectiveHandler,
  wdInstance: WebDirective | string = 'unicorn'
): void {
  const wd = typeof wdInstance === 'string' ? useWebDirective(wdInstance) : wdInstance;

  wd.register(name, handler);
}

function createWebDirective(options: Partial<WebDirectiveOptions> = {}): WebDirective {
  const wd = new WebDirective(options);
  wd.listen();

  return wd;
}
