export type Nullable<T> = T | null | undefined;
export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;

export interface Dictionary<T = any> {
  [key: string]: T;
}

export type Constructor<T> = new (...args: any[]) => T;
