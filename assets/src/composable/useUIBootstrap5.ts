import type { Tooltip } from 'bootstrap';
import { ButtonRadioOptions } from '../bootstrap/button-radio';
import type { KeepTab, KeepTabModule, KeepTabOptions } from '../bootstrap/keep-tab';
import type { UIBootstrap5 } from '../module/ui-bootstrap5';
import { useUITheme } from '../service';

export async function useUIBootstrap5(install = false, pushToGlobal = false): Promise<UIBootstrap5> {
  const { UIBootstrap5 } = await import('../module/ui-bootstrap5');

  const theme = UIBootstrap5.get();

  if (install) {
    useUITheme(theme);

    if (pushToGlobal) {
      theme.pushBootstrapToGlobal();
    }
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

export async function useBs5KeepTab(selector?: string | HTMLElement, options: KeepTabOptions = {}) {
  const bs5 = await useUIBootstrap5();

  return bs5.keepTab(selector, options);
}

export async function useBs5ButtonRadio(selector?: string | HTMLElement, options: ButtonRadioOptions = {}) {
  const bs5 = await useUIBootstrap5();

  return bs5.buttonRadio(selector, options);
}
