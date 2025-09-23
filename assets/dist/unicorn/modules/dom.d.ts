/**
 * @see https://stackoverflow.com/a/9899701
 */
export declare function domready(callback?: ((value: any) => void) | undefined): Promise<void>;
export declare function selectOne<K extends keyof HTMLElementTagNameMap>(ele: K): HTMLElementTagNameMap[K] | null;
export declare function selectOne<E extends Element = Element>(ele: string): E | null;
export declare function selectOne<E extends Element = Element>(ele: E): E;
export declare function selectOne<E extends Element = Element>(ele: string | E): E | null;
export declare function selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): E[];
export declare function selectAll<E extends Element = Element>(ele: NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
export declare function selectAll<E extends Element = Element>(ele: string | NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
export declare function selectAll<E extends keyof HTMLElementTagNameMap>(ele: E, callback?: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
export declare function getBoundedInstance<T = any, E = Element>(selector: E, name: string, callback?: ((el: E) => any)): T;
export declare function getBoundedInstance<T = any, E extends Element = Element>(selector: string | E, name: string, callback?: ((el: E) => any)): T | null;
export declare function getBoundedInstanceList<T = any, E extends Element = Element>(selector: string | NodeListOf<E>, name: string, callback?: ((el: E) => any)): (T | null)[];
export declare function singletonModule<T = any, E extends Element = Element>(ele: string, name: string, callback?: ((el: E) => any)): (T | null)[];
export declare function singletonModule<T = any, E extends Element = Element>(ele: NodeListOf<Element>, name: string, callback?: ((el: E) => any)): (T | null)[];
export declare function singletonModule<T = any, E extends Element = Element>(ele: Element, name: string, callback?: ((el: E) => any)): T | null;
export declare function singletonModule<T = any, E extends Element = Element>(ele: string | Element | NodeListOf<Element>, name: string, callback?: ((el: E) => any)): (T | null)[] | T | null;
export declare function h<T extends keyof HTMLElementTagNameMap>(element: T, attrs?: Record<string, any>, content?: any): HTMLElementTagNameMap[T];
export declare function uri(type: string): any;
export declare function asset(type: string): any;
export declare function html<T extends Element = HTMLElement>(html: string): T;
export declare function addUriBase(uri: string, type?: string): string;
/**
 * Pure JS version of jQuery delegate()
 *
 * @see https://gist.github.com/iagobruno/4db2ed62dc40fa841bb9a5c7de92f5f8
 */
export declare function delegate(wrapper: Element | string, selector: string, eventName: string, callback: (e: Event) => void): () => void;
