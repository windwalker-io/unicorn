import UnicornApp from '../app';
import { keys } from 'lodash-es';

const disconnectKey = '_unicornDirectiveDisconnectors';

declare global {
  interface Element {
    _unicornDirectiveDisconnectors?: Record<string, Function>;
  }
}

export default class UnicornDirective {
  directives: Record<string, UnicornDirectiveHandler> = {};

  instances: Record<string, any[]> = {};

  listenTarget: HTMLElement = document.body;

  disconnectCallback: (() => void) | undefined;

  hooks: {
    mounted: {
      before?: DirectiveBaseHook;
      after?: DirectiveBaseHook;
    };
    unmounted: {
      before?: DirectiveBaseHook;
      after?: DirectiveBaseHook;
    };
    updated?: {
      before?: DirectiveBaseHook;
      after?: DirectiveBaseHook;
    }
  } = {
    mounted: {
      before: (directive: string, node: Element) => {
        node[disconnectKey] = node[disconnectKey] || {};
        node[disconnectKey][directive] = this.observeChildren(node);

        this.instances[directive] = this.instances[directive] || [];
        this.instances[directive].push(node);
      }
    },
    unmounted: {
      after: (directive, node: Element) => {
        if (!node[disconnectKey]) {
          return;
        }

        if (node[disconnectKey][directive]) {
          node[disconnectKey][directive]();
          delete node[disconnectKey][directive];
        }
      }
    }
  };

  static get is() {
    return 'directive';
  }

  static install(app: UnicornApp, options = {}) {
    const directive = app.$directive = new this();

    app.directive = directive.register.bind(directive);

    directive.listen();
  }

  register(name: string, handler: UnicornDirectiveHandler) {
    if (!this.disconnectCallback) {
      this.listen();
    }

    const directive = this.getDirectiveAttrName(name);
    this.directives[directive] = handler;

    [].forEach.call(
      this.listenTarget.querySelectorAll<HTMLElement>('[' + directive + ']'),
      (el) => {
        this.runDirectiveIfExists(directive, el, 'mounted');
      }
    );
  }

  remove(name: string) {
    const directive = this.getDirectiveAttrName(name);

    if (this.instances[directive]) {
      this.instances[directive].forEach((node) => {
        this.runDirectiveIfExists(directive, node, 'unmounted');
      });

      delete this.instances[directive];
    }

    delete this.directives[directive];
  }

  getDirectiveAttrName(name: string): string {
    return `uni-${name}`;
  }

  observeRoot(element: Element): () => void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Added Nodes
        [].forEach.call(mutation.addedNodes, (node: Node) => {
          this.findDirectivesFromNode(node as Element).forEach((directive) => {
            this.runDirectiveIfExists(directive, node as HTMLElement, 'mounted', mutation);
          });

          // Find children with all directives
          for (const directive in this.directives) {
            if ('querySelectorAll' in node) {
              (node as HTMLElement).querySelectorAll<HTMLElement>(`[${directive}]`).forEach((node: HTMLElement) => {
                this.runDirectiveIfExists(directive, node, 'mounted', mutation);
              });
            }
          }
        });

        [].forEach.call(mutation.removedNodes, (node) => {
          this.findDirectivesFromNode(node).forEach((directive) => {
            this.runDirectiveIfExists(directive, node, 'unmounted', mutation);
          });
        });

        if (mutation.type === 'attributes' && mutation.oldValue == null) {
          this.runDirectiveIfExists(mutation.attributeName!, mutation.target as HTMLElement, 'mounted', mutation);
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      characterData: false,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }

  observeChildren(element: Element): () => void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Remove
        if (mutation.type === 'attributes' && !(mutation.target as Element).getAttribute(mutation.attributeName!)) {
          this.runDirectiveIfExists(mutation.attributeName!, mutation.target as HTMLElement, 'unmounted', mutation);
        }

        this.findDirectivesFromNode(mutation.target as Element).forEach((directive) => {
          // Attributes
          if (mutation.type === 'attributes' || mutation.type === 'childList') {
            this.runDirectiveIfExists(directive, mutation.target as HTMLElement, 'updated', mutation);
          }
        });
      });
    });

    observer.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      attributeOldValue: true,
      characterDataOldValue: true,
      attributeFilter: keys(this.directives)
    });

    return () => {
      observer.disconnect();
    };
  }

  listenTo(target: HTMLElement) {
    this.listenTarget = target;
  }

  /**
   * @returns {function(): void}
   */
  listen() {
    return this.disconnectCallback = this.observeRoot(this.listenTarget);
  }

  disconnect() {
    if (this.disconnectCallback) {
      this.disconnectCallback();
      this.disconnectCallback = undefined;
    }
  }

  // test() {
  //   this.register('modal-link', {
  //     mounted(...args) {
  //       console.log('mounted', ...args);
  //     },
  //     updated(...args) {
  //       console.log('updated', ...args);
  //     },
  //     unmounted(...args) {
  //       console.log('unmounted', ...args);
  //     }
  //   });
  //
  //   const ele = document.createElement('div');
  //   ele.setAttribute('uni-modal-link', '{}');
  //   document.body.appendChild(ele);
  // }

  getDirective(directive: string): UnicornDirectiveHandler {
    return this.directives[directive];
  }

  runDirectiveIfExists(
    directive: string,
    node: HTMLElement,
    task: 'mounted' | 'unmounted' | 'updated',
    mutation: MutationRecord | undefined = undefined
  ) {
    const handler = this.getDirective(directive);

    if (handler && task in handler) {
      if (this.hooks?.[task]?.before) {
        this.hooks[task]?.before?.(directive, node);
      }

      handler[task]?.(node, {
        directive,
        node,
        value: node.getAttribute(directive),
        oldValue: mutation?.oldValue,
        mutation,
        dir: handler
      });

      if (this.hooks?.[task]?.after) {
        this.hooks[task]?.after?.(directive, node);
      }
    }
  }

  findDirectivesFromNode(node: Element): string[] {
    const directives: string[] = [];

    if (!node.getAttributeNames) {
      return [];
    }

    node.getAttributeNames().forEach((e) => {
      if (e.startsWith('uni-')) {
        directives.push(e);
      }
    });

    return directives;
  }
}

declare type DirectiveBaseHook = (directive: string, node: HTMLElement) => void;

export interface UnicornDirectiveBinding {
  directive: string;
  node: HTMLElement;
  value: any;
  oldValue: any;
  mutation?: MutationRecord;
  dir: UnicornDirectiveHandler;
}

export type UnicornDirectiveHandlerHook = (node: HTMLElement, bindings: UnicornDirectiveBinding) => void

// Directive
export interface UnicornDirectiveHandler {
  mounted?: UnicornDirectiveHandlerHook;
  unmounted?: UnicornDirectiveHandlerHook;
  updated?: UnicornDirectiveHandlerHook;
}
