
export function isPlainObject(val: any): val is Record<string, any> {
  return val && typeof val === "object" && !Array.isArray(val);
}

export function mergeDeep<T = Record<string, any>>(target: Partial<T>, ...sources: any[]): T {
  let out: any = isPlainObject(target) ? { ...target } : target;

  for (const source of sources) {
    if (Array.isArray(source)) {
      out = (Array.isArray(out) ? out.concat(source) : source) as T;
      continue;
    }
    if (isPlainObject(source)) {
      out = { ...(isPlainObject(out) ? out : {}) };
      for (const key of Object.keys(source)) {
        out[key] =
          key in out ? mergeDeep(out[key], source[key]) : source[key];
      }
      continue;
    }
    out = source as T;
  }
  return out;
}
