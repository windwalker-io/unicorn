
export async function useIframeModal(): Promise<typeof import('../module/iframe-modal')> {
  const module = await import('../module/iframe-modal');

  await module.ready;

  return module;
}
