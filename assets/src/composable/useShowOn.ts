
export async function useShowOn(): Promise<typeof import('@/components/show-on')> {
  const module = await import('@/components/show-on');

  await module.ready;

  return module;
}
