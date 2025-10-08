import { IFrameModalModule } from '../module/iframe-modal';
export type { IFrameModalElement } from '../module/iframe-modal';

export async function useIframeModal(): Promise<IFrameModalModule> {
  const module = await import('../module/iframe-modal');

  await module.ready;

  return module;
}
