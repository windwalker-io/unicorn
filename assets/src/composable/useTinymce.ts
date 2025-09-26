import type { TinymceController } from '../module/tinymce';
import type { MaybePromise } from '../types';
import type { TinyMCE } from 'tinymce';

export async function useTinymce(): Promise<typeof import('../module/tinymce')>
export async function useTinymce(
  selector?: string,
  options?: Record<string, any>
): Promise<TinymceController>;
export async function useTinymce(
  selector?: string,
  options: Record<string, any> = {}
): Promise<any> {
  const { get } = await import('../module/tinymce');

  return get(selector, options);
}

export async function useTinymceHook(
  handler: ((tinymce: TinyMCE) => MaybePromise<any>)
): Promise<void> {
  const { addHook } = await import('../module/tinymce');

  return addHook(handler);
}
