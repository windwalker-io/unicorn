
export async function useShowOn(): Promise<typeof import('../module/show-on')> {
  const module = await import('../module/show-on');

  await module.ready;

  return module;
}
