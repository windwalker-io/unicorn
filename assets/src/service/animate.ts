import { selectOne } from './dom';

export function animateTo(
  element: HTMLElement,
  styles: Partial<Record<keyof CSSStyleDeclaration, any>>,
  options: number | KeyframeAnimationOptions = {}
): Animation {
  element = selectOne(element);

  const currentStyles = window.getComputedStyle(element);
  const transitions: Record<string, any[]> = {};

  for (const name in styles) {
    const value = styles[name];

    transitions[name] = Array.isArray(value)
      ? value
      : [
        currentStyles.getPropertyValue(name),
        value
      ];
  }

  if (typeof options === 'number') {
    options = { duration: options };
  }

  options = Object.assign(
    {
      duration: 400,
      easing: 'linear',
      fill: 'both'
    },
    options
  );

  const animation = element.animate(
    transitions,
    options
  );

  animation.addEventListener('finish', () => {
    for (const name in styles) {
      const value = styles[name];

      element.style.setProperty(
        name,
        Array.isArray(value)
          ? value[value.length - 1]
          : value
      );
    }

    animation.cancel();
  });

  return animation;
}
