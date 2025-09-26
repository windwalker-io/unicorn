import type { Tooltip } from 'bootstrap';
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

export async function useBs5Tooltip(
  selector: NodeListOf<Element> | Element | string = '[data-bs-toggle="tooltip"]',
  config: Partial<Tooltip.Options> = {}
): Promise<Tooltip[]> {
  const bs5 = await useUIBootstrap5();

  return bs5.tooltip(selector, config);
}
