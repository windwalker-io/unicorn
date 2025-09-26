import type { UIBootstrap5 } from '../module/ui-bootstrap5';
import { useUITheme } from '../service';

export async function useUIBootstrap5(install = false): Promise<UIBootstrap5> {
  const { UIBootstrap5 } = await import('../module/ui-bootstrap5');

  const theme = UIBootstrap5.get();

  if (install) {
    useUITheme(theme);
  }

  return theme;
}
