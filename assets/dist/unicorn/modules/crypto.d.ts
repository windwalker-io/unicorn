export declare function base64UrlEncode(string: string): string;
/**
 * Base64 URL decode
 */
export declare function base64UrlDecode(string: string): string;
/**
 * Get uid, similar Windwalker Uililities uid().
 */
export declare function uid(prefix?: string, timebase?: boolean): string;
export declare function tid(prefix?: string): string;
export declare function randomBytesHex(size?: number): string;
export declare function randomBytes(size: number): Uint8Array<ArrayBuffer>;
export declare function serial(): number;
