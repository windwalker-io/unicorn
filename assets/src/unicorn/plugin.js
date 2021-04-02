/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2018 ${ORGANIZATION}.
 * @license    __LICENSE__
 */

export class Plugin {
  name = '';

  static get is() {
    throw new Error(`Please add "is" property to Unicorn Plugin: ${this.name}`);
  }

  static get proxies() {
    return {};
  }

  static get defaultOptions() {
    return {};
  }

  get options() {
    return this.unicorn.options[this.constructor.is.toLowerCase()];
  }

  static install(unicorn) {
    const self = new this();

    this.createProxies(unicorn, self);
    return self;
  }

  static uninstall(unicorn) {
    const self = new this(unicorn);

    this.resetProxies(unicorn, self);
  }

  constructor() {
    //
  }

  boot(unicorn) {
    this.unicorn = unicorn;

    const name = this.constructor.is.toLowerCase();

    // Merge to global options
    this.unicorn.options[name] = $.extend(
      true,
      {},
      this.constructor.defaultOptions,
      this.unicorn.options[name],
    );

    // Created hook
    this.created();

    // DOM Ready hook
    $(() => this.ready());

    // Unicorn onload hook
    this.unicorn.on('loaded', this.loaded);
  }

  created() {
    //
  }

  ready() {
    //
  }

  loaded() {
    //
  }

  static createProxies(unicorn, plugin) {
    if (plugin.constructor.proxies === undefined) {
      return this;
    }

    this.resetProxies(unicorn, plugin);

    unicorn[plugin.constructor.is] = plugin;

    const { proxies } = plugin.constructor;

    for (const name in proxies) {
      if (!proxies.hasOwnProperty(name)) {
        continue;
      }

      const origin = proxies[name];

      if (unicorn[name] !== undefined) {
        throw new Error(`Property: ${name} has exists in Unicorn instance.`);
      }

      if (typeof origin === 'function') {
        unicorn[name] = origin;
      } else if (plugin[origin] !== undefined) {
        if (typeof plugin[origin] === 'function') {
          unicorn[name] = function (...args) {
            return plugin[origin](...args);
          };
        } else {
          Object.defineProperties(unicorn, name, {
            get: () => plugin[origin],
            set: (value) => {
              plugin[origin] = value;
            },
          });
        }
      } else {
        throw new Error(`Proxy property: "${origin}" not found in Plugin: ${plugin.constructor.name}`);
      }
    }
  }

  static resetProxies(unicorn, plugin) {
    const name = typeof plugin === 'string' ? plugin : plugin.constructor.is;

    if (unicorn[name]) {
      plugin = unicorn[name];
    }

    if (plugin.constructor.proxies === undefined) {
      return;
    }

    for (const name in plugin.constructor.proxies) {
      delete unicorn[name];
    }

    delete unicorn[plugin.constructor.is];
  }
}

export class JQueryPlugin extends Plugin {
  /**
   * Plugin name.
   * @returns {string|null}
   */
  static get pluginName() {
    throw new Error('Please provide a plugin name.');
  }

  static get pluginClass() {
    throw new Error('Please provide a class as plugin instance.');
  }

  static install(unicorn) {
    const instance = super.install(unicorn);

    unicorn.plugin(this.pluginName, this.pluginClass);

    return instance;
  }

  createPlugin(selector, options = {}, ...args) {
    options.mainSelector = selector;

    return $(selector)[this.constructor.pluginName](options, this.unicorn, ...args);
  }
}
