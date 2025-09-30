import type { TinymceController, TinymceModule } from '../module/tinymce';
import type { MaybePromise } from '../types';
import type { TinyMCE } from 'tinymce';

export async function useTinymce(): Promise<TinymceModule>
export async function useTinymce(
  selector?: string,
  options?: Record<string, any>
): Promise<TinymceController>;
export async function useTinymce(
  selector?: string,
  options: Record<string, any> = {}
): Promise<any> {
  const module = await import('../module/tinymce');

  if (selector) {
    return module.get(selector, options);
  }

  return module;
}

export async function useTinymceHook(
  handler: ((tinymce: TinyMCE) => MaybePromise<any>)
): Promise<void> {
  const { addHook } = await import('../module/tinymce');

  return addHook(handler);
}
