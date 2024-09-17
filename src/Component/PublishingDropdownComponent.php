<?php

declare(strict_types=1);

namespace Unicorn\Component;

use Closure;
use Unicorn\Html\State\StateButton;
use Unicorn\Workflow\State;
use Unicorn\Workflow\WorkflowController;
use Unicorn\Workflow\WorkflowInterface;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Edge\Component\ComponentAttributes;
use Windwalker\Utilities\Attributes\Prop;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

use function Windwalker\try_chronos;
use function Windwalker\value;

#[EdgeComponent('publishing-dropdown')]
class PublishingDropdownComponent extends StateDropdownComponent
{
    use TranslatorTrait;

    #[Prop]
    public \DateTimeInterface|string|null $publishUp = null;

    #[Prop]
    public \DateTimeInterface|string|null $publishDown = null;

    #[Inject]
    protected ChronosService $chronosService;

    public function data(): array
    {
        $data = parent::data();

        $publishUp = $this->publishUp;
        $publishDown = $this->publishDown;

        if ($publishUp || $publishDown) {
            /** @var State $currentState */
            $currentState = $data['currentState'] = clone $data['currentState'];
            $value = $currentState->getValue();
            // $default     = $this->getState($value) ?: $this->getState('_default');
            // $tz          = Factory::getUser()->getTimezone();
            $publishUp   = try_chronos($publishUp);
            $publishDown = try_chronos($publishDown);

            // Add tips and special titles
            // Create special titles for published items
            if ($value === '1') {
                // Create tip text, only we have publish up or down settings
                if ($publishUp && $publishUp->isFuture()) {
                    $tips = $this->trans('unicorn.publishing.dropdown.waiting.publish');
                    $currentState->title($tips);
                    $currentState->icon(' fa fa-clock');
                    $data['textColor'] = 'text-warning';
                } elseif ($publishDown && $publishDown->isPast()) {
                    $tips = $this->trans('unicorn.publishing.dropdown.publish.down');
                    $currentState->title($tips);
                    $currentState->icon(' fa fa-stop');
                    $data['textColor'] = 'text-secondary';
                } else {
                    $tips = $this->trans('unicorn.publishing.dropdown.publish.up');
                    $currentState->title($tips);
                    $currentState->icon(' fa fa-play');
                    // $data['textColor'] = 'text-success';
                }

                if ($publishUp) {
                    $tips .= ' - ' . $this->trans(
                        'unicorn.publishing.dropdown.publish.up.time',
                        time: $this->chronosService->toLocalFormat($publishUp, 'Y/m/d H:i:s')
                    );
                }

                if ($publishDown) {
                    $tips .= ' - ' . $this->trans(
                        'unicorn.publishing.dropdown.publish.down.time',
                        time: $this->chronosService->toLocalFormat($publishDown, 'Y/m/d H:i:s')
                    );
                }

                $data['attributes']['data-bs-toggle'] = 'tooltip';
                $data['attributes']['title'] = $tips;
            }
        }

        return $data;
    }

    public function withAttributes(array $attributes, array|ComponentAttributes $binding = []): static
    {
        // if ($binding instanceof ComponentAttributes) {
        //     $binding = $binding->getAttributes();
        // }

        $this->attributes = $this->attributes ?: $this->newAttributeBag();

        $this->attributes->setAttributes(
            [
                ...$this->attributes->getAttributes(),
                ...$attributes
            ]
        );

        return $this;
    }
}
