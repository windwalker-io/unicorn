<?php

declare(strict_types=1);

namespace Unicorn\Listener;

use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Events\Web\AfterRequestEvent;
use Windwalker\Core\Language\LangService;
use Windwalker\Data\Collection;
use Windwalker\Data\Format\FormatInterface;
use Windwalker\Data\Format\FormatRegistry;
use Windwalker\Event\Attributes\EventSubscriber;
use Windwalker\Event\Attributes\ListenTo;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Language\Language;
use Windwalker\Utilities\Contract\LanguageInterface;

/**
 * The DumpOrphansListener class.
 */
#[EventSubscriber]
class DumpOrphansSubscriber
{
    public function __construct(
        protected LangService $lang,
        protected string $format = 'ini',
    ) {
    }

    #[ListenTo(AfterRequestEvent::class)]
    public function afterRequest(AfterRequestEvent $event): void
    {
        $app = $event->container->get(ApplicationInterface::class);

        if (!$app->isDebug()) {
            return;
        }

        $format = strtolower($this->format);
        $ext    = ($format === 'yaml') ? 'yml' : $format;

        $file = WINDWALKER_LOGS . '/language-orphans.' . $ext;

        if (!is_file($file)) {
            Filesystem::mkdir(dirname($file));
            file_put_contents($file, '');
        }

        $orphans = Collection::from($file, $format, ['processSections' => true]);

        $orphans->load($this->getFormattedOrphans($format), $format, ['processSections' => true]);

        file_put_contents($file, $orphans->toString($format, ['inline' => 99]));
    }

    public function getFormattedOrphans($format = 'ini')
    {
        /** @var FormatInterface $formatter */
        $formatter = FormatRegistry::createFormatHandler($format);

        $returns = [];
        $options = [];

        switch (strtolower($format)) {
            case 'ini':
                $orphans = $this->getAutoHandledOrphans();

                foreach ($orphans as $key => $value) {
                    if ($key === '') {
                        continue;
                    }

                    $key2 = explode('.', $key);

                    if (isset($key2[1])) {
                        $returns[$key2[1]][$key] = $value;

                        continue;
                    }

                    $returns[$key] = $value;
                }

                break;

            case 'yaml':
            case 'yml':
                $options['inline'] = 99;
            // No break
            default:
                $orphans = $this->getAutoHandledOrphans(false);
                $returns = $orphans;
        }

        return $formatter->dump($returns, $options);
    }

    public function getAutoHandledOrphans($flatten = true, $stripPrefix = 1)
    {
        $orphans = $this->lang->getOrphans();

        foreach ($orphans as $key => $value) {
            $value = explode('.', $key);

            $value = array_map('ucfirst', $value);

            foreach (range(1, $stripPrefix) as $i) {
                array_shift($value);
            }

            $value = implode(' ', $value);

            $orphans[$key] = $value;
        }

        if (!$flatten) {
            $reg = new Collection();

            foreach ($orphans as $key => $value) {
                $reg->set($key, $value);
            }

            $orphans = $reg->dump();
        }

        return $orphans;
    }
}
