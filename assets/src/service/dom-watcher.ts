export function watchAttributes<T extends HTMLElement>(el: T, callback?: AttributeMutationCallback<T>) {
  return new AttributeMutationObserver<T>(el, callback);
}

export type AttributeMutationCallback<T extends HTMLElement = HTMLElement> = (el: T, name: string, value: any, oldValue: any) => void;
export type AttributeWatcher<T extends HTMLElement = HTMLElement> = (el: T, value: any, oldValue: any) => void;

export class AttributeMutationObserver<T extends HTMLElement> {
  observer: MutationObserver;
  watches: Record<string, (AttributeWatcher<T>)[]> = {};

  constructor(protected element: T, public callback?: (el: T, name: string, value: any, oldValue: any) => void) {
    this.element = element;

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName!;
          const target = mutation.target as T;
          const value = target.getAttribute(attrName);

          this.callback?.(
            target,
            attrName,
            value,
            mutation.oldValue
          );

          if (this.watches[attrName]) {
            for (const watch of this.watches[attrName]) {
              watch(target, value, mutation.oldValue);
            }
          }
        }
      }
    });

    this.observe();
  }

  watch(name: string, callback: AttributeWatcher<T>): () => void {
    this.watches[name] ??= [];
    this.watches[name].push(callback);

    return () => {
      this.watches[name] = this.watches[name].filter(fn => fn !== callback);
    };
  }

  observe() {
    this.observer.observe(this.element, {
      attributes: true,
      attributeOldValue: true,
    });
  }

  disconnect() {
    this.observer.disconnect();
  }
}


