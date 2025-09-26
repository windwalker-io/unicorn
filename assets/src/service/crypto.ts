import { uid, tid, randomBytes, randomBytesString } from '@lyrasoft/ts-toolkit/generic';

export function base64UrlEncode(string: string): string {
  return btoa(String(string))
    .replace(/\+/, '-')
    .replace(new RegExp('\\/'), '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode
 */
export function base64UrlDecode(string: string): string {
  return atob(
    String(string)
      .replace(/-/, '+')
      .replace(/_/, '/')
  );
}

export { uid, tid, randomBytes, randomBytesString };

let globalSerial = 1;

export function serial(): number {
  return globalSerial++;
}
