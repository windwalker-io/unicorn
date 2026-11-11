import type { NuxtEditorController, NuxtEditorModule } from '../module/nuxt-editor';

export async function useNuxtEditor(): Promise<NuxtEditorModule>;
export async function useNuxtEditor(
  selector: string | HTMLElement,
  options?: Record<string, any>
): Promise<NuxtEditorController>;
export async function useNuxtEditor(
  selector?: string | HTMLElement,
  options: Record<string, any> = {}
): Promise<any> {
  const module = await import('../module/nuxt-editor');

  if (selector) {
    return module.get(selector, options);
  }

  return module;
}
