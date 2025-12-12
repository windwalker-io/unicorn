<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\DateTime\Chronos;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\HTMLElement;
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
 * @method  mixed  noCalendar(bool $value)
 * @method  mixed  getNoCalendar()
 */
class CalendarField extends TextField
{
    use LayoutFieldTrait;

    public const FORMAT_DATE = 'Y-m-d';
    public const FORMAT_DATETIME_FULL = 'Y-m-d H:i:S';
    public const FORMAT_DATETIME_MINUTE = 'Y-m-d H:i';

    #[Inject]
    protected ChronosService $chronosService;

    public function getDefaultLayout(): string
    {
        return '@theme::field/calendar';
    }

    public function getDefaultOptions(): array
    {
        return [
            'dateFormat' => $this->getFormat() ?? self::FORMAT_DATETIME_FULL,
            'enableTime' => $this->getEnableTime() ?? true,
            'enableSeconds' => $this->getEnableTime() ?? true,
            'allowInput' => true,
            'time_24hr' => true,
            'wrap' => true,
            'monthSelect' => $this->getMonthSelect(),
            'noCalendar' => $this->getNoCalendar(),
        ];
    }

    /**
     * @inheritDoc
     */
    public function prepareInput(HTMLElement $input): HTMLElement
    {
        $input = parent::prepareInput($input);

        $tz = $this->getTimezone() ?? $this->chronosService->getTimezone();
        $noCalendar = $this->getNoCalendar();

        if (!$noCalendar && trim((string) $input->getAttribute('value'))) {
            $value = $input->getAttribute('value');

            $input['value'] = $this->chronosService->isNullDate($value)
                ? ''
                : $this->chronosService->toLocalFormat(
                    $value,
                    Chronos::FORMAT_YMD_HIS,
                    $tz,
                );
        }

        return $input;
    }

    public function compileFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $input->setAttribute('data-input', true);

        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => parent::compileFieldElement($input, $options),
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
        if ((string) $value === '') {
            return null;
        }

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
                'timezone',
                'noCalendar',
            ]
        );
    }
}
