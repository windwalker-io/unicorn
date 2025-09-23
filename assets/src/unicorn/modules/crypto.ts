import crypto from 'node:crypto';

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

/**
 * Get uid, similar Windwalker Uililities uid().
 */
export function uid(prefix: string = '', timebase: boolean = false): string {
  if (timebase) {
    const start = performance?.timeOrigin
      ? Math.round(performance.timeOrigin)
      : performance.timing.navigationStart;

    const time = (start * 100000) + (performance.now() * 100);

    return prefix + time.toString(12) + (randomBytesHex(4));
  }

  return prefix + randomBytesHex(12);
}

export function tid(prefix: string = ''): string {
  return uid(prefix, true);
}

export function randomBytesHex(size: number = 12): string {
  const bytes = randomBytes(size);

  return [...bytes]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export function randomBytes(size: number): Uint8Array<ArrayBuffer> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(size);
    window.crypto.getRandomValues(arr);
    return arr;
  }

  return new Uint8Array(crypto.randomBytes(size));
}

let globalSerial = 1;

export function serial(): number {
  return globalSerial++;
}
