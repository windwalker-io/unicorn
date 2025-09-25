
import { Dictionary } from '../types';
import { Stack, stack } from '@lyrasoft/ts-toolkit/generic';

const stacks: Dictionary<Stack> = {};

export function useStack<T = any>(name: string = 'default', store: any[] = []): Stack<T> {
  return stacks[name] ??= createStack<T>(store);
}

export function createStack<T = any>(store: any[] = []): Stack<T> {
  return stack<T>(store);
}
