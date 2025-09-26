import { ShowOnModule } from '../module/show-on';

export async function useShowOn(): Promise<ShowOnModule> {
  const module = await import('../module/show-on');

  await module.ready;

  return module;
}
