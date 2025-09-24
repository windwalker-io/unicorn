
export async function useFieldFileDrag(): Promise<typeof import('@/components/field-file-drag')> {
  const module = await import('@/components/field-file-drag');

  await module.ready;

  return module;
}
