<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\DateTime\Chronos;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\TextField;
use Windwalker\Utilities\Arr;

/**
 * The CalendarField class.
 *
 * @method  $this  calendarOptions(array $value = [])
 * @method  mixed  getCalendarOptions()
 * @method  $this  from(string $value = [])
 * @method  mixed  getFrom()
 * @method  $this  to(string $value = [])
 * @method  mixed  getTo()
 * @method  $this  format(string $value = [])
 * @method  mixed  getFormat()
 * @method  $this  enableTime(bool $value = [])
 * @method  mixed  getEnableTime()
 * @method  $this  monthSelect(bool $value = [])
 * @method  mixed  getMonthSelect()
 * @method  mixed  timezone(string $value)
 * @method  mixed  getTimezone()
 */
class CalendarField extends TextField
{
    use LayoutFieldTrait;

    #[Inject]
    protected ChronosService $chronosService;

    public function getDefaultLayout(): string
    {
        return '@theme/field/calendar';
    }

    public function getDefaultOptions(): array
    {
        return [
            'dateFormat' => $this->getFormat() ?? 'Y-m-d H:i:S',
            'enableTime' => $this->getEnableTime(),
            'enableSeconds' => $this->getEnableTime(),
            'allowInput' => true,
            'time_24hr' => true,
            'wrap' => true,
            'monthSelect' => $this->getMonthSelect()
        ];
    }

    /**
     * @inheritDoc
     */
    public function prepareInput(DOMElement $input): DOMElement
    {
        $input = parent::prepareInput($input);

        $tz = $this->getTimezone() ?? $this->chronosService->getTimezone();

        $input['value'] = $this->chronosService->toLocalFormat(
            $input->getAttribute('value'),
            Chronos::FORMAT_YMD_HIS,
            $tz,
        );

        return $input;
    }

    public function buildInput(DOMElement $input, array $options = []): string|DOMElement
    {
        $input->setAttribute('data-input', true);

        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => parent::buildInput($input, $options),
                'field' => $this,
                'options' => Arr::mergeRecursive(
                    $this->getDefaultOptions(),
                    $this->getCalendarOptions() ?? []
                )
            ]
        );
    }

    /**
     * prepareStore
     *
     * @param  mixed  $value
     *
     * @return  mixed
     */
    public function prepareStore(mixed $value): mixed
    {
        $value = parent::prepareStore($value);

        return $this->chronosService->toServer($value);
    }

    /**
     * getAccessors
     *
     * @return  array
     *
     * @since   3.1.2
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'calendarOptions',
                'from',
                'to',
                'enableTime',
                'format',
                'monthSelect',
                'timezone'
            ]
        );
    }
}
