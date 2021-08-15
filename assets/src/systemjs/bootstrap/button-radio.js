/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

const defaultOptions = {
  selector: '.btn-group .radio',
  buttonClass: 'btn',
  activeClass: 'active',
  color: {
    'default': 'btn-default btn-outline-secondary',
    green: 'btn-success',
    red: 'btn-danger',
    blue: 'btn-primary'
  }
};

export class ButtonRadio {
  constructor(selector, options) {
    throw new Error('ButtonRadio Work in process');

    this.element = u.selectOne(selector);
    this.options = u.defaultsDeep({}, options, defaultOptions);
    let colors = [];

    // Turn radios into btn-group
    const $radios = this.element.querySelectorAll(this.options.selector);

    options = this.options;

    u.selectAll($radios, ($radio) => {
      $radio.classList.add(options.buttonClass);
      $radio.classList.add(options.color['default']);
    });

    $radios.on('click', e => {
      const $btn = $(e.currentTarget);
      const $group = $btn.parent().find('.' + options.buttonClass);
      const $input = $btn.find('input[type=radio]');

      if ($input.prop('disabled') || $input.prop('readonly')) {
        return;
      }

      if (!$input.prop('checked')) {
        $group
          .addClass(options.color.default)
          .removeClass(options.activeClass)
          .removeClass(colors);

        $btn.addClass(options.activeClass).addClass($input.attr('data-color-class')).removeClass(options.color.default);

        $input.prop('checked', true);
        $input[0].dispatchEvent(new Event('change'));
      }
    });

    $radios.each(function () {
      const $radio = $(this);
      const $input = $radio.find('input');
      const $label = $radio.find('label');
      const $text = $('<span>' + $label.text() + '</span>');

      $label.hide();
      $input.hide();
      $radio.prepend($text);
      $radio.removeClass('radio');

      // Prepare color schema
      let color = $input.attr('data-color-class');

      if (color == null) {
        switch ($input.val()) {
          case '':
            color = options.color.blue;
            break;

          case '0':
            color = options.color.red;
            break;

          default:
            color = options.color.green;
            break;
        }

        $input.attr('data-color-class', color);
      }

      colors.push(color);

      if ($input.prop('checked')) {
        $radio.removeClass(options.color.default).addClass(options.activeClass).addClass(color);
      }

      if ($input.prop('disabled')) {
        $radio.addClass('disabled');
      }

      if ($input.prop('readonly')) {
        $radio.addClass('readonly');
      }
    });

    $radios.parent().trigger('button-radio.loaded');

    // Make color elements unique
    colors = $.unique(colors);
  }
}
