import type { UIBootstrap5 } from '@/components/ui-bootstrap5';
import { useUITheme } from '@/modules';

export async function useUIBootstrap5(install = false): Promise<UIBootstrap5> {
  const { UIBootstrap5 } = await import('@/components/ui-bootstrap5');

  const theme = UIBootstrap5.get();

  if (install) {
    useUITheme(theme);
  }

  return theme;
}
