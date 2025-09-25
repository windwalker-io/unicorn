import type { TinymceController } from '../components/tinymce';
import type { MaybePromise } from '../types';
import type { TinyMCE } from 'tinymce';

export async function useTinymce(): Promise<typeof import('../components/tinymce')>
export async function useTinymce(
  selector?: string,
  options?: Record<string, any>
): Promise<TinymceController>;
export async function useTinymce(
  selector?: string,
  options: Record<string, any> = {}
): Promise<any> {
  const { get } = await import('../components/tinymce');

  return get(selector, options);
}

export async function useTinymceHook(
  handler: ((tinymce: TinyMCE) => MaybePromise<any>)
): Promise<void> {
  const { addHook } = await import('../components/tinymce');

  return addHook(handler);
}
