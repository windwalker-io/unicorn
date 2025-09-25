
export async function useIframeModal(): Promise<typeof import('../components/iframe-modal')> {
  const module = await import('../components/iframe-modal');

  await module.ready;

  return module;
}
