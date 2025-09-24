
import { formRequestSubmit } from './form-request-submit';

export function polyfill() {
  // If in browser
  if (typeof window !== 'undefined') {
    formRequestSubmit(HTMLFormElement.prototype);
  }
}
