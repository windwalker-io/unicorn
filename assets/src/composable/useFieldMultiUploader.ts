import { MultiUploaderModule } from '../module/field-multi-uploader';

export async function useFieldMultiUploader(): Promise<MultiUploaderModule> {
  const module = await import('../module/field-multi-uploader');

  await module.ready;

  return module;
}
