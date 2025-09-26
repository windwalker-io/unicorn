
export async function useFieldFileDrag(): Promise<typeof import('../module/field-file-drag')> {
  const module = await import('../module/field-file-drag');

  await module.ready;

  return module;
}
