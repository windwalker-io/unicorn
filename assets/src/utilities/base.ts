import { selectAll } from '../modules';

export function removeCloak() {
  if (globalThis.document == null) {
    return;
  }

  selectAll('[uni-cloak]', (el) => el.removeAttribute('uni-cloak'));
}
