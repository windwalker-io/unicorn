import { IframeModalModule } from '../module/iframe-modal';

export async function useIframeModal(): Promise<IframeModalModule> {
  const module = await import('../module/iframe-modal');

  await module.ready;

  return module;
}
