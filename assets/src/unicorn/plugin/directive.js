import { keys } from 'lodash-es';

const disconnectKey = '_unicornDirectiveDisconnectors';

export default class UnicornDirective {
  directives = {};

  instances = [];

  listenTarget = document.body;

  discountCallback;

  hooks = {
    mounted: {
      before: (directive, node) => {
        node[disconnectKey] = node[disconnectKey] || {};
        node[disconnectKey][directive] = this.observeChildren(node);

        this.instances[directive] = this.instances[directive] || [];
        this.instances[directive].push(node);
      }
    },
    unmounted: {
      after: (directive, node) => {
        if (!node[disconnectKey]) {
          return;
        }

        if (node[disconnectKey][directive]) {
          node[disconnectKey][directive]();
          delete node[disconnectKey][directive];
        }
      }
    }
  }

  static get is() {
    return 'directive';
  }

  static install(app, options = {}) {
    const directive = app.$directive = new this(app);

    app.directive = directive.register.bind(directive);

    directive.listen();
  }

  /**
   * @param {string} name
   * @param {UnicornDirectiveHandler} handler
   */
  register(name, handler) {
    if (!this.discountCallback) {
      this.listen();
    }

    const directive = this.getDirectiveAttrName(name);
    this.directives[directive] = handler;

    [].forEach.call(
      this.listenTarget.querySelectorAll('[' + directive + ']'),
      (el) => {
        this.runDirectiveIfExists(directive, el, 'mounted');
      }
    );
  }

  /**
   * @param {string} name
   */
  remove(name) {
    const directive = this.getDirectiveAttrName(name);

    if (this.instances[directive]) {
      this.instances[directive].forEach((node) => {
        this.runDirectiveIfExists(directive, node, 'unmounted');
      });

      delete this.instances[directive];
    }

    delete this.directives[directive];
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  getDirectiveAttrName(name) {
    return `uni-${name}`;
  }

  /**
   * @param {Element} element
   * @returns {() => void}
   */
  observeRoot(element) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Added Nodes
        [].forEach.call(mutation.addedNodes, (node) => {
          this.findDirectivesFromNode(node).forEach((directive) => {
            this.runDirectiveIfExists(directive, node, 'mounted', mutation);
          });

          // Find children with all directives
          for (const directive in this.directives) {
            if (!node.querySelectorAll) {
              continue;
            }

            node.querySelectorAll(`[${directive}]`).forEach((node) => {
              this.runDirectiveIfExists(directive, node, 'mounted', mutation);
            });
          }
        });

        [].forEach.call(mutation.removedNodes, (node) => {
          this.findDirectivesFromNode(node).forEach((directive) => {
            this.runDirectiveIfExists(directive, node, 'unmounted', mutation);
          });
        });

        if (mutation.type === 'attributes' && mutation.oldValue == null) {
          this.runDirectiveIfExists(mutation.attributeName, mutation.target, 'mounted', mutation);
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

  /**
   * @param {Element} element
   * @returns {() => void}
   */
  observeChildren(element) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Remove
        if (mutation.type === 'attributes' && !mutation.target.getAttribute(mutation.attributeName)) {
          this.runDirectiveIfExists(mutation.attributeName, mutation.target, 'unmounted', mutation);
        }

        this.findDirectivesFromNode(mutation.target).forEach((directive) => {
          // Attributes
          if (mutation.type === 'attributes' || mutation.type === 'childList') {
            this.runDirectiveIfExists(directive, mutation.target, 'updated', mutation);
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

  /**
   * @param {Element} target
   */
  listenTo(target) {
    this.listenTarget = target;
  }

  /**
   * @returns {function(): void}
   */
  listen() {
    return this.discountCallback = this.observeRoot(this.listenTarget);
  }

  disconnect() {
    if (this.discountCallback) {
      this.discountCallback();
      this.discountCallback = null;
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

  /**
   * @param {string} directive
   * @returns {UnicornDirectiveHandler}
   */
  getDirective(directive) {
    return this.directives[directive];
  }

  /**
   * @param {string} directive
   * @param {Element} node
   * @param {string} task
   * @param {MutationRecord} mutation
   */
  runDirectiveIfExists(directive, node, task, mutation) {
    const handler = this.getDirective(directive);

    if (handler && handler[task]) {
      if (this.hooks?.[task]?.before) {
        this.hooks[task].before(directive, node);
      }

      handler[task](node, {
        directive,
        node,
        value: node.getAttribute(directive),
        oldValue: mutation?.oldValue,
        mutation,
        dir: handler
      });

      if (this.hooks?.[task]?.after) {
        this.hooks[task].after(directive, node);
      }
    }
  }

  /**
   * @param {Element} node
   * @returns {UnicornDirectiveHandler[]}
   */
  findDirectivesFromNode(node) {
    const directives = [];

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
