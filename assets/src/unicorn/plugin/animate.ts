import UnicornApp from '../app';
import { defaultsDeep, each } from 'lodash-es';

export default class UnicornAnimate {
  static install(app: UnicornApp) {
    const self = app.$animate = new this(app);
    app.animate = self.to.bind(self);
  }

  constructor(protected app: UnicornApp) {
    //
  }

  to(
    element: HTMLElement,
    styles: Partial<Record<keyof CSSStyleDeclaration, any>>,
    options: number | KeyframeAnimationOptions = {}
  ): Animation {
    element = this.app.selectOne(element);

    const currentStyles = window.getComputedStyle(element);
    const transitions: Record<string, any[]> = {};

    each(styles, (value: any, name: string) => {
      transitions[name] = Array.isArray(value)
        ? value
        : [
          currentStyles.getPropertyValue(name),
          value
        ];
    });

    if (typeof options === 'number') {
      options = { duration: options };
    }

    options = defaultsDeep(
      options,
      {
        duration: 400,
        easing: 'linear',
        fill: 'both'
      }
    );

    const animation = element.animate(
      transitions,
      options
    );

    animation.addEventListener('finish', () => {
      each(styles, (value: any, name: string) => {
        element.style.setProperty(
          name,
          Array.isArray(value)
            ? value[value.length - 1]
            : value
        );
      });
      animation.cancel();
    });

    return animation;
  }

  getCurrentStyle(element: Element, name: keyof CSSStyleDeclaration): any {
    return window.getComputedStyle(element)[name];
  }
}

// declare global {
//   interface UnicornApp {
//     $animate: UnicornAnimate;
//     animate: typeof UnicornAnimate.prototype.to;
//   }
// }
