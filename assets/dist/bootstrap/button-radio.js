System.register([], function (_export, _context) {
  "use strict";

  var defaultOptions, ButtonRadio;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      /**
       * Part of unicorn project.
       *
       * @copyright  Copyright (C) 2021 __ORGANIZATION__.
       * @license    __LICENSE__
       */
      defaultOptions = {
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

      _export("ButtonRadio", ButtonRadio = function ButtonRadio(selector, options) {
        _classCallCheck(this, ButtonRadio);

        throw new Error('ButtonRadio Work in process');
        this.element = u.selectOne(selector);
        this.options = u.defaultsDeep({}, options, defaultOptions);
        var colors = []; // Turn radios into btn-group

        var $radios = this.element.querySelectorAll(this.options.selector);
        options = this.options;
        u.selectAll($radios, function ($radio) {
          $radio.classList.add(options.buttonClass);
          $radio.classList.add(options.color['default']);
        });
        $radios.on('click', function (e) {
          var $btn = $(e.currentTarget);
          var $group = $btn.parent().find('.' + options.buttonClass);
          var $input = $btn.find('input[type=radio]');

          if ($input.prop('disabled') || $input.prop('readonly')) {
            return;
          }

          if (!$input.prop('checked')) {
            $group.addClass(options.color["default"]).removeClass(options.activeClass).removeClass(colors);
            $btn.addClass(options.activeClass).addClass($input.attr('data-color-class')).removeClass(options.color["default"]);
            $input.prop('checked', true);
            $input[0].dispatchEvent(new Event('change'));
          }
        });
        $radios.each(function () {
          var $radio = $(this);
          var $input = $radio.find('input');
          var $label = $radio.find('label');
          var $text = $('<span>' + $label.text() + '</span>');
          $label.hide();
          $input.hide();
          $radio.prepend($text);
          $radio.removeClass('radio'); // Prepare color schema

          var color = $input.attr('data-color-class');

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
            $radio.removeClass(options.color["default"]).addClass(options.activeClass).addClass(color);
          }

          if ($input.prop('disabled')) {
            $radio.addClass('disabled');
          }

          if ($input.prop('readonly')) {
            $radio.addClass('readonly');
          }
        });
        $radios.parent().trigger('button-radio.loaded'); // Make color elements unique

        colors = $.unique(colors);
      });
    }
  };
});
//# sourceMappingURL=button-radio.js.map
