import { f as formRequestSubmit } from "./form-request-submit.js";
function polyfill() {
  if (typeof window !== "undefined") {
    formRequestSubmit(HTMLFormElement.prototype);
  }
}
export {
  polyfill as p
};
