import { uid, tid, randomBytes, randomBytesString } from '@lyrasoft/ts-toolkit/generic';

export function base64UrlEncode(string: string): string {
  return btoa(String(string))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode
 */
export function base64UrlDecode(string: string): string {
  return atob(
    String(string)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  );
}

export { uid, tid, randomBytes, randomBytesString };

let globalSerial = 1;

export function serial(): number {
  return globalSerial++;
}
